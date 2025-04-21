import type { z } from 'zod';

export const validateImage = (image: File | string | undefined) => {
  const errors: z.ZodIssue[] = [];

  if (!image) {
    errors.push({ code: 'custom', message: 'Image is required', path: ['image'] });
  }

  if (image instanceof File) {
    if (image.size > 5 * 1024 * 1024) {
      errors.push({ code: 'custom', message: 'Image size exceeds 5MB', path: ['image'] });
    }
    if (!['image/jpeg', 'image/png'].includes(image.type)) {
      errors.push({
        code: 'custom',
        message: 'Invalid image type (only jpeg and png allowed)',
        path: ['image'],
      });
    }
  }

  return errors;
};
