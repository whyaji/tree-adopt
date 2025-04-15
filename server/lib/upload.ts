export const uploadFile = async (imageFile: File, dir: string) => {
  const fs = await import('fs/promises');
  const path = await import('path');
  const uploadsDir = path.resolve(`frontend/public/${dir}`);
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, `${Date.now()}-${imageFile.name}`);
  const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
  await fs.writeFile(filePath, fileBuffer);

  return filePath;
};

export const deleteImage = async (dir: string) => {
  const fs = await import('fs/promises');
  try {
    await fs.unlink(`frontend/public/${dir}`);
    console.log(`Deleted file: ${dir}`);
  } catch (error) {
    console.error(`Error deleting file: ${dir}`, error);
  }
};
