export const uploadFile = async (
  imageFile: File,
  dir?: string,
  options?: {
    withTimeMilis?: boolean;
    withoutDir?: boolean;
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

  return filePath;
};

export const deleteImage = async (dir: string) => {
  const fs = await import('fs/promises');
  try {
    await fs.unlink(`server/public/${dir}`);
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
