import { DetailGroupScreenComponent } from '@/components/screen/detail-group-screen-component';
import { Route } from '@/routes/_authenticated/tentang-kami/kelompok-komunitas/$kelompokKomunitasName';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

export function DetailKelompokKomunitasScreen() {
  const { kelompokKomunitas }: { kelompokKomunitas?: KelompokKomunitasType } =
    Route.useLoaderData();

  if (!kelompokKomunitas) {
    return <div>Kelompok Komunitas tidak ditemukan.</div>;
  }

  return <DetailGroupScreenComponent kelompokKomunitas={kelompokKomunitas} />;
}
