import { createFileRoute } from '@tanstack/react-router';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { recaptchaSiteKey } from '@/constants/env';
import { LoginScreen } from '@/features/auth/LoginScreen';

export const Route = createFileRoute('/login')({
  component: ComponentLoginScreen,
});

function ComponentLoginScreen() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <LoginScreen />
    </GoogleReCaptchaProvider>
  );
}
