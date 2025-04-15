import { createFileRoute } from '@tanstack/react-router';

import { ProgramKamiScreen } from '@/features/program-kami/screen/ProgramKamiScreen';

export const Route = createFileRoute('/_authenticated/program-kami/')({
  component: ProgramKamiScreen,
});
