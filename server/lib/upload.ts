import type { Context } from 'hono';
import type { BlankInput } from 'hono/types';

import { STATUS_RECORD } from '../constants/STATUS_RECORD.js';

export const uploadFile = async (
  file: File,
  dir?: string,
  options?: {
    withTimeMilis?: boolean;
    withoutDir?: boolean;
    withThumbnail?: boolean;
  }
) => {
  const sharp = await import('sharp');
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    // Resolve the real path of the symlinked directory
    const publicDir = path.resolve('server/public');
    const realPublicDir = await fs.realpath(publicDir);
    const uploadsDir = path.join(realPublicDir, dir ?? '');

    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `${options?.withTimeMilis ? Date.now() + '-' : ''}${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const image = sharp.default(fileBuffer);
    const metadata = await image.metadata();

    if (metadata.height && metadata.height > 960) {
      await image
        .resize({
          height: 960,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFile(filePath);
    } else {
      await fs.writeFile(filePath, fileBuffer);
    }

    if (options?.withThumbnail) {
      const thumbnailDir = path.join(realPublicDir, 'thumbnails', dir ?? '');
      await fs.mkdir(thumbnailDir, { recursive: true });
      const thumbnailPath = path.join(thumbnailDir, fileName);

      await sharp
        .default(filePath)
        .resize({
          height: 150,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFile(thumbnailPath);
      console.log(`Thumbnail created at: ${thumbnailPath}`);
    }

    const relativeDir = path.join('/', dir ?? '');
    const relativePath = path.join(relativeDir, fileName);

    return relativePath.replace(/\\/g, '/');
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export const deleteImage = async (dir: string) => {
  const fs = await import('fs/promises');
  const path = await import('path');

  try {
    // Resolve the real path of the symlinked directory
    const publicDir = path.resolve('server/public');
    const realPublicDir = await fs.realpath(publicDir);

    // Construct the full file path
    const filePath = path.join(realPublicDir, dir);

    // Delete the main file
    await fs.unlink(filePath);

    // Check if the thumbnail exists and delete it
    const thumbnailPath = path.join(realPublicDir, 'thumbnails', dir);
    const thumbnailExists = await fs
      .access(thumbnailPath)
      .then(() => true)
      .catch(() => false);

    if (thumbnailExists) {
      await fs.unlink(thumbnailPath);
      console.log(`Deleted thumbnail: ${thumbnailPath}`);
    }

    console.log(`Deleted file: ${dir}`);
  } catch (error) {
    console.error(`Error deleting file: ${dir}`, error);
  }
};

// Helper function to clean up uploaded images on error
export async function cleanupUploadedImages(imageUploads: Record<string, string | undefined>) {
  await Promise.all(
    Object.values(imageUploads)
      .filter((path): path is string => !!path)
      .map(async (path) => {
        try {
          await deleteImage(path);
        } catch (deleteErr) {
          console.error('Error deleting image:', deleteErr);
        }
      })
  );
}

// clean upload images based on string[]
export async function cleanupUploadedImagesByArray(imageUploads: string[]) {
  await Promise.all(
    imageUploads.map(async (path) => {
      try {
        await deleteImage(path);
      } catch (deleteErr) {
        console.error('Error deleting image:', deleteErr);
      }
    })
  );
}

export function getYearMonthInNameImage(fileName: string) {
  const parts = fileName.split('.')?.[0]?.split('_') ?? '';
  if (parts.length < 5) {
    return '';
  }
  const datePart = parts[4];
  return `${datePart.slice(0, 4)}/${datePart.slice(4, 6)}`;
}

export async function massUploadFiles(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { c, dir: dirParam }: { c: Context<object, any, BlankInput>; dir?: string }
) {
  const formData = (await c.req.parseBody()) as Record<string, File>;

  const formDataLength = Object.keys(formData).length;

  if (formDataLength === 0) {
    return c.json({ message: 'No files provided' }, 400);
  }
  const dir = 'uploads/' + (dirParam ?? '');

  const responses: { fileIndex: number; status: number; message: string }[] = [];

  for (let i = 0; i < formDataLength; i++) {
    const file = formData[`file[${i}]`] as File;

    const fileName = file.name;
    if (!fileName) {
      responses.push({
        fileIndex: i,
        status: STATUS_RECORD.FAILED,
        message: 'File name is missing',
      });
      continue;
    }

    const date = getYearMonthInNameImage(fileName);

    const newDir = date ? `${dir}${date}/` : dir;

    try {
      await uploadFile(file, newDir, {
        withThumbnail: true,
      });
      responses.push({
        fileIndex: i,
        status: STATUS_RECORD.UPLOADED,
        message: 'File uploaded successfully',
      });
    } catch (err) {
      console.error(`Error uploading file at index ${i}:`, err);
      responses.push({
        fileIndex: i,
        status: STATUS_RECORD.FAILED,
        message: 'Error uploading file',
      });
    }
  }

  const notAllFilesUploaded = responses.some((response) => response.status === 0);
  if (notAllFilesUploaded) {
    return c.json({ message: 'Some files failed to upload', responses }, 500);
  }

  return c.json({ message: 'All files uploaded successfully', responses }, 201);
}
