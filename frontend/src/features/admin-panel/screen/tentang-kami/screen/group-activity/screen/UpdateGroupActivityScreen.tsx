import { Route } from '@/routes/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/$kelompokKomunitasId/aktivitas/$groupActivityId/update/index';

import { FormGroupActivity } from '../components/form-group-activity/FormGroupActivity';

export function UpdateGroupActivityScreen() {
  const { kelompokKomunitasId, groupActivity } = Route.useLoaderData();
  return (
    <FormGroupActivity
      kelompokKomunitasId={kelompokKomunitasId ?? undefined}
      groupActivity={groupActivity}
    />
  );
}
