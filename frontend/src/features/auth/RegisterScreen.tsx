import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FieldInfo } from '@/components/ui/field-info';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/lib/api/authApi';
import { assertAndHandleFormErrors } from '@/lib/utils/setErrorForms';

export function RegisterScreen() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value, formApi }) => {
      if (!executeRecaptcha) {
        toast('Recaptcha not ready');
        return;
      }

      const recaptchaToken = await executeRecaptcha('register');

      try {
        const result = await register(value.name, value.email, value.password, recaptchaToken);
        assertAndHandleFormErrors<typeof value>(result, formApi.setFieldMeta);
        toast('Register successfully');
        form.reset();
        navigate({ to: '/login' });
      } catch {
        toast('Invalid email or data');
      }
    },
  });

  const formItem: {
    name: keyof (typeof form)['state']['values'];
    label: string;
    type: string;
  }[] = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'password', label: 'Password', type: 'password' },
  ];

  return (
    <form
      className="flex flex-col gap-2 max-w-xl m-auto mt-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
      <h2 className="text-2xl font-bold">Register</h2>
      {formItem.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => (
            <>
              <Label htmlFor={field.name}>{item.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={item.type}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        </form.Field>
      ))}
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? 'Regsitering...' : 'Register'}
          </Button>
        )}
      </form.Subscribe>
      <Label
        className="text-center"
        onClick={() => {
          navigate({ to: '/login' });
        }}>
        Login
      </Label>
    </form>
  );
}
