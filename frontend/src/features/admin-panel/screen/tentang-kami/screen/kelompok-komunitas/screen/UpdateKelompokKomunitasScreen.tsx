import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

import { FormKelompokKomunitas } from '../components/form-kelompok-komunitas/FormKelompokKomunitas';

export function UpdateKelompokKomunitasScreen({
  kelompokKomunitas,
}: {
  kelompokKomunitas: KelompokKomunitasType;
}) {
  return <FormKelompokKomunitas kelompokKomunitas={kelompokKomunitas} />;
}
