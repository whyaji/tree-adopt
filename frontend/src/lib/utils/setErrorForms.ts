/* eslint-disable @typescript-eslint/no-explicit-any */
export function assertAndHandleFormErrors<T>(
  result: unknown,
  setFieldMeta: (field: keyof T, updater: (meta: any) => any) => void
): asserts result is { data: any } {
  if (typeof result === 'object' && result !== null && 'error' in result) {
    const errorResult = result as {
      error: { issues: { path: (keyof T | string)[]; message: string }[] };
    };

    errorResult.error.issues.forEach((issue) => {
      issue.path.forEach((field) => {
        setFieldMeta(field as keyof T, (meta) => ({
          ...meta,
          errorMap: { onSubmit: issue.message },
        }));
      });
    });

    throw new Error('Form submission failed due to validation errors');
  }
}
