import { DetailGroupScreenComponent } from '@/components/screen/detail-group-screen-component';
import { Route } from '@/routes/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/$kelompokKomunitasId';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

export function DetailKelompokKomunitasScreen() {
  const { kelompokKomunitas }: { kelompokKomunitas?: KelompokKomunitasType } =
    Route.useLoaderData();

  if (!kelompokKomunitas) {
    return <div>Kelompok Komunitas tidak ditemukan.</div>;
  }

  return (
    <DetailGroupScreenComponent
      kelompokKomunitas={kelompokKomunitas}
      allPhotosRoute={`/admin/tentang-kami/kelompok-komunitas/${kelompokKomunitas.id}/all-photos`}
    />
  );
}
