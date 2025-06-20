import { AnyFieldApi } from '@tanstack/react-form';

export function FieldInfo({ field }: { readonly field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em
          style={{
            color: 'red',
            fontSize: '0.875rem',
          }}>
          {field.state.meta.errors.join(', ')}
        </em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  );
}
