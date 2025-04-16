import { Route } from '@/routes/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/update-komunitas/$kelompokKomunitasId';

import { FormKelompokKomunitas } from '../components/form-kelompok-komunitas/FormKelompokKomunitas';

export function UpdateKelompokKomunitasScreen() {
  const { komunitas } = Route.useLoaderData();
  return <FormKelompokKomunitas kelompokKomunitas={komunitas} />;
}
