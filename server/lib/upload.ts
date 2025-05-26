export const uploadFile = async (
  imageFile: File,
  dir?: string,
  options?: {
    withTimeMilis?: boolean;
    withoutDir?: boolean;
    withThumbnail?: boolean; // thumbnail with 150x150px
  }
) => {
  const fs = await import('fs/promises');
  const path = await import('path');
  const uploadsDir = path.resolve(`server/public/${dir ?? ''}`);
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(
    uploadsDir,
    `${options?.withTimeMilis ? Date.now() + '-' : ''}${imageFile.name}`
  );
  const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
  await fs.writeFile(filePath, fileBuffer);

  if (options?.withThumbnail) {
    const sharp = await import('sharp');
    const thumbnailDir = path.resolve(`server/public/thumbnails/${dir ?? ''}`);
    // Ensure the thumbnail directory exists
    await fs.mkdir(thumbnailDir, { recursive: true });
    const thumbnailPath = path.join(thumbnailDir, `${imageFile.name}`);
    await sharp
      .default(filePath)
      .resize(125, 150, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFile(thumbnailPath);
    console.log(`Thumbnail created at: ${thumbnailPath}`);
  }

  return filePath;
};

export const deleteImage = async (dir: string) => {
  const fs = await import('fs/promises');
  try {
    await fs.unlink(`server/public/${dir}`);
    // check if the thumbnail exists and delete it
    const thumbnailPath = `server/public/thumbnails/${dir}`;
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
