import { createFileRoute } from '@tanstack/react-router';

import { PemberdayaanMasyarakatScreen } from '@/features/program-kami/screen/pemberdayaan-masyarakat/screen/PemberdayaanMasyarakatScreen';

export const Route = createFileRoute('/_authenticated/program-kami/pemberdayaan-masyarakat/')({
  component: PemberdayaanMasyarakatScreen,
});
