import { createFileRoute } from '@tanstack/react-router';

import { AdopsiPohonScreen } from '@/features/program-kami/screen/adopsi-pohon/screen/AdopsiPohonScreen';

export const Route = createFileRoute('/_authenticated/program-kami/adopsi-pohon/')({
  component: AdopsiPohonScreen,
});
