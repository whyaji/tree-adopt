import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { FC } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { FieldForm, FieldItemType } from '@/components/field-form';
import { Button } from '@/components/ui/button';
import { PERMISSION } from '@/enum/permission.enum';
import {
  createBoundaryMarkerCode,
  updateBoundaryMarkerCodeById,
} from '@/lib/api/boundaryMarkerApi';
import { useUserStore } from '@/lib/stores/userStore';
import { checkPermission } from '@/lib/utils/permissions';
import { assertAndHandleFormErrors } from '@/lib/utils/setErrorForms';
import { BoundarymarkerCodeType } from '@/types/boundaryMarker.type';

export const FormBoundaryMarkerCode: FC<{
  boundaryMarkerCode?: BoundarymarkerCodeType | null;
}> = ({ boundaryMarkerCode }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const loggedInUserGroupId = user?.groupId ? String(user.groupId) : '';

  const form = useForm({
    defaultValues: {
      code: boundaryMarkerCode?.code ?? '',
      kelompokKomunitasId: boundaryMarkerCode?.kelompokKomunitasId
        ? String(boundaryMarkerCode.kelompokKomunitasId)
        : loggedInUserGroupId,
    },
    onSubmit: async ({ value, formApi }) => {
      const valueInput = {
        code: value.code,
        kelompokKomunitasId: Number(value.kelompokKomunitasId),
      };
      try {
        if (boundaryMarkerCode?.id) {
          const res = await updateBoundaryMarkerCodeById(
            { id: boundaryMarkerCode.id, ...valueInput },
            String(boundaryMarkerCode.id)
          );
          assertAndHandleFormErrors<typeof value>(res, formApi.setFieldMeta);
          toast('Kode Patok Batas updated successfully');
        } else {
          const res = await createBoundaryMarkerCode(valueInput);
          assertAndHandleFormErrors<typeof value>(res, formApi.setFieldMeta);
          toast('Kode Patok Batas added successfully');
        }

        form.reset();
        navigate({ to: '/admin/master/kode-patok-batas' });
      } catch (error) {
        console.error(error);
        toast.error(
          boundaryMarkerCode
            ? 'Failed to update Kode Patok Batas'
            : 'Failed to add Kode Patok Batas'
        );
      }
    },
  });

  const isGlobalAdmin = checkPermission(user?.permissions ?? [], [
    PERMISSION.MASTER_BOUNDARY_MARKER_CODE_CREATE_LEVEL_GLOBAL,
    PERMISSION.MASTER_BOUNDARY_MARKER_CODE_UPDATE_LEVEL_GLOBAL,
  ]);

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    {
      name: 'code',
      label: 'Kode',
      type: 'text',
      required: true,
    },
    {
      name: 'kelompokKomunitasId',
      label: 'Kelompok Komunitas',
      type: 'dropdown-comunity-group',
      required: true,
      paginationParams: { limit: 9999, filter: isGlobalAdmin ? undefined : `id:${user?.groupId}` },
    },
  ];

  return (
    <form
      className="flex flex-col gap-2 max-w-6xl m-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
      <h2 className="text-2xl font-bold">
        {boundaryMarkerCode ? 'Update Kode Patok Batas' : 'Add Kode Patok Batas'}
      </h2>

      {formItem.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => <FieldForm item={item} field={field} />}
        </form.Field>
      ))}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <ConfirmationDialog
            title={
              boundaryMarkerCode
                ? 'Apakah anda yakin untuk mengupdate?'
                : 'Apakah anda yakin untuk menambah?'
            }
            message={
              boundaryMarkerCode
                ? 'Data yang sudah ada akan diupdate'
                : 'Data akan ditambahkan ke dalam database Kode Patok Batas'
            }
            confirmText={
              isSubmitting
                ? 'Submitting...'
                : boundaryMarkerCode
                  ? 'Update Kode Patok Batas'
                  : 'Tambah Kode Patok Batas'
            }
            onConfirm={async () => {
              try {
                await form.handleSubmit();
              } catch (error) {
                console.error(error);
                toast.error('Failed to submit form');
              }
            }}
            triggerButton={
              <Button disabled={!canSubmit} className="mt-4">
                {boundaryMarkerCode ? 'Update Kode Patok Batas' : 'Tambah Kode Patok Batas'}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
};
