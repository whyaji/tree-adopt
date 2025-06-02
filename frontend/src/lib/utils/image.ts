import { readAndCompressImage } from 'browser-image-resizer';

const config = {
  maxHeight: 960,
};

export async function resizedImageBeforeUpload({
  file,
  fileName,
}: {
  file: File;
  fileName?: string;
}): Promise<File> {
  try {
    const resizedBlob = await readAndCompressImage(file, config);
    return new File([resizedBlob], fileName ?? file.name, { type: file.type });
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
}
