import { useForm } from '@tanstack/react-form';
import Cookies from 'js-cookie';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROLE } from '@/enum/role.enum';
import { getCurrentUserWithToken, login } from '@/lib/api/authApi';
import { cn } from '@/lib/utils';
import { assertAndHandleFormErrors } from '@/lib/utils/setErrorForms';

export function LoginScreen() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value, formApi }) => {
      if (!executeRecaptcha) {
        toast('Recaptcha not ready');
        return;
      }

      const recaptchaToken = await executeRecaptcha('login');

      try {
        console.log('value', value);
        const res = await login(value.email, value.password, recaptchaToken);
        assertAndHandleFormErrors<typeof value>(res, formApi.setFieldMeta);
        toast('Login successfully');
        Cookies.set('auth_token', res.data.token, { expires: 7, secure: true });
        try {
          const resUser = await getCurrentUserWithToken(res.data.token);
          Cookies.set('user', JSON.stringify(resUser.data));
          form.reset();
          window.location.href = resUser.data.role === ROLE.ADMIN ? '/admin' : '/';
        } catch (error) {
          Cookies.remove('auth_token');
          Cookies.remove('user');
          console.error('Error fetching user data:', error);
          toast('Error fetching user data');
          throw error;
        }
      } catch {
        toast('Invalid email or password');
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
                <h1 className="text-2xl font-bold">Masuk ke Akun Anda</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Masukkan email dan kata sandi Anda untuk masuk ke akun Anda.
                </p>
              </div>
              <div className="grid gap-6">
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
                  {(field) => {
                    return (
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
                              <Eye
                                className="h-5 w-5"
                                strokeWidth={1.5}
                                onClick={() => setShowPassword(true)}
                              />
                            ) : (
                              <EyeOff
                                className="h-5 w-5"
                                strokeWidth={1.5}
                                onClick={() => setShowPassword(false)}
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  }}
                </form.Field>
                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit}>
                      {isSubmitting ? '...' : 'Masuk'}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
              <div className="text-center text-sm">
                {/* Don&apos;t have an account?{' '} */}
                {'Belum memiliki akun? '}
                <a href="/register" className="underline underline-offset-4">
                  Daftar sekarang
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block rounded-3xl overflow-hidden">
        <img
          src="/images/auth/login-bg.jpg"
          alt="Login background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
