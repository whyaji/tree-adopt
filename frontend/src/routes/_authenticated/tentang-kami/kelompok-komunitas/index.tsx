import { createFileRoute } from '@tanstack/react-router';

import { KelompokKomunitasScreen } from '@/features/tentang-kami/screen/kelompok-komunitas/screen/KelompokKomunitasScreen';

export const Route = createFileRoute('/_authenticated/tentang-kami/kelompok-komunitas/')({
  component: KelompokKomunitasScreen,
});
