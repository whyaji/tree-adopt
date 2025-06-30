import { createFileRoute } from '@tanstack/react-router';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import { recaptchaSiteKey } from '@/constants/env';
import { RegisterScreen } from '@/features/auth/RegisterScreen';

export const Route = createFileRoute('/register')({
  component: ComponentRegisterScreen,
});

function ComponentRegisterScreen() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <RegisterScreen />
    </GoogleReCaptchaProvider>
  );
}
