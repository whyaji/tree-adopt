import { createFileRoute } from '@tanstack/react-router';

import { PohonListScreen } from '@/features/data/screen/pohon/screen/PohonListScreen';

export const Route = createFileRoute('/_authenticated/data/pohon/')({
  component: PohonListScreen,
});
