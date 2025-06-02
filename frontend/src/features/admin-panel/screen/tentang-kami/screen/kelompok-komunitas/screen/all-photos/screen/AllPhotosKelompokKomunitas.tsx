import { AllPhotosGroupScreenComponent } from '@/components/screen/all-photos-group-screen-component';

export function AllPhotosKelompokKomunitas({
  kelompokKomunitasId,
}: {
  kelompokKomunitasId: string;
}) {
  return <AllPhotosGroupScreenComponent kelompokKomunitasId={kelompokKomunitasId} />;
}
