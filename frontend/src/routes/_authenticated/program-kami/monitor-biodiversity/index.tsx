import { createFileRoute } from '@tanstack/react-router';

import { MonitorBiodiversityScreen } from '@/features/program-kami/screen/monitor-biodiversity/screen/MonitorBiodiversityScreen';

export const Route = createFileRoute('/_authenticated/program-kami/monitor-biodiversity/')({
  component: MonitorBiodiversityScreen,
});
