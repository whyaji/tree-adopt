import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/lib/api/authApi';
import { cn } from '@/lib/utils';
import { assertAndHandleFormErrors } from '@/lib/utils/setErrorForms';

export function RegisterScreen() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <img
              src="/images/tree-adopt-logo.png"
              alt="Logo"
              className="h-16 w-full object-contain rounded-full"
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form
              className={cn('flex flex-col gap-6')}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Daftar Akun Baru</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Masukkan nama, email, dan kata sandi Anda untuk membuat akun baru.
                </p>
              </div>
              <div className="grid gap-6">
                <form.Field name="name">
                  {(field) => (
                    <div className="grid gap-3">
                      <Label htmlFor="name">Nama</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nama lengkap"
                        required
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="email">
                  {(field) => (
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="password">
                  {(field) => (
                    <div className="grid gap-3">
                      <Label htmlFor="password">Kata Sandi</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}>
                          {showPassword ? (
                            <Eye className="h-5 w-5" strokeWidth={1.5} />
                          ) : (
                            <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form.Field>
                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit}>
                      {isSubmitting ? '...' : 'Daftar'}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
              <div className="text-center text-sm">
                {'Sudah punya akun? '}
                <a href="/login" className="underline underline-offset-4">
                  Masuk sekarang
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block rounded-bl-3xl rounded-tl-3xl overflow-hidden">
        <img
          src="/images/auth/login-bg.jpg"
          alt="Register background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
