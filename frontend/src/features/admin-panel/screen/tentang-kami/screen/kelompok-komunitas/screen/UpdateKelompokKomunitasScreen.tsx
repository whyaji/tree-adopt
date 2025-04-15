import { Route } from '@/routes/_authenticated/tentang-kami/kelompok-komunitas/list-komunitas/update-komunitas/$kelompokKomunitasId';

import { FormKelompokKomunitas } from '../components/form-kelompok-komunitas/FormKelompokKomunitas';

export function UpdateKelompokKomunitasScreen() {
  const { komunitas } = Route.useLoaderData();
  return <FormKelompokKomunitas kelompokKomunitas={komunitas} />;
}
