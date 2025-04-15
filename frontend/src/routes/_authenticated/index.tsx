import { createFileRoute } from '@tanstack/react-router';

import HomeScreen from '@/features/home/screen/HomeScreen';

export const Route = createFileRoute('/_authenticated/')({
  component: HomeScreen,
});
