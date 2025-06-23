import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { FC } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { FieldForm, FieldItemType } from '@/components/field-form';
import { MapsForm } from '@/components/maps-form';
import { Button } from '@/components/ui/button';
import { PERMISSION } from '@/enum/permission.enum';
import { useMapsState } from '@/hooks/use-maps-state';
import { createBoundaryMarker, updateBoundaryMarkerById } from '@/lib/api/boundaryMarkerApi';
import { useUserStore } from '@/lib/stores/userStore';
import { checkPermission } from '@/lib/utils/permissions';
import { assertAndHandleFormErrors } from '@/lib/utils/setErrorForms';
import { BoundaryMarkerType } from '@/types/boundaryMarker.type';

export const FormBoundaryMarker: FC<{
  boundaryMarker?: BoundaryMarkerType | null;
}> = ({ boundaryMarker }) => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const loggedInUserId = user?.id ? String(user.id) : '';
  const loggedInUserGroupId = user?.groupId ? String(user.groupId) : '';

  const form = useForm({
    defaultValues: {
      code: boundaryMarker?.code ?? '',
      kelompokKomunitasId: boundaryMarker?.kelompokKomunitasId
        ? String(boundaryMarker.kelompokKomunitasId)
        : loggedInUserGroupId,
      checkerId: boundaryMarker?.checkerId ? String(boundaryMarker.checkerId) : loggedInUserId,
      installYear: boundaryMarker?.installYear ? String(boundaryMarker.installYear) : '',
      status: boundaryMarker?.status ? String(boundaryMarker.status) : '',
      description: boundaryMarker?.description ?? '',
      latitude: boundaryMarker?.latitude ? String(boundaryMarker.latitude) : '',
      longitude: boundaryMarker?.longitude ? String(boundaryMarker.longitude) : '',
    },
    onSubmit: async ({ value, formApi }) => {
      if (value.latitude === '' || value.longitude === '') {
        formApi.setFieldMeta('latitude', (meta) => ({
          ...meta,
          errorMap: { onSubmit: 'Latitude is required' },
        }));
        formApi.setFieldMeta('longitude', (meta) => ({
          ...meta,
          errorMap: { onSubmit: 'Longitude is required' },
        }));
        return;
      }

      const dataValue = {
        code: value.code,
        kelompokKomunitasId: Number(value.kelompokKomunitasId),
        checkerId: Number(value.checkerId),
        installYear: Number(value.installYear),
        status: Number(value.status),
        description: value.description,
        latitude: Number(value.latitude),
        longitude: Number(value.longitude),
      };
      try {
        if (boundaryMarker) {
          const result = await updateBoundaryMarkerById(
            { id: boundaryMarker.id, ...dataValue },
            String(boundaryMarker.id)
          );
          assertAndHandleFormErrors<typeof value>(result, formApi.setFieldMeta);
          toast('Patok batas updated successfully');
        } else {
          const result = await createBoundaryMarker(dataValue);
          assertAndHandleFormErrors<typeof value>(result, formApi.setFieldMeta);
          toast('Patok batas added successfully');
        }
        form.reset();
        navigate({ to: '/admin/data/patok-batas' });
      } catch {
        if (boundaryMarker) {
          toast.error('Failed to update patok batas');
        } else {
          toast.error('Failed to add patok batas');
        }
      }
    },
  });

  const isGlobalAdmin = checkPermission(user?.permissions ?? [], [
    PERMISSION.BOUNDARY_MARKER_CREATE_LEVEL_GLOBAL,
    PERMISSION.BOUNDARY_MARKER_UPDATE_LEVEL_GLOBAL,
  ]);

  const { mapRef, mapCenter, markerPosition, handleLocationSelect } = useMapsState({
    form,
    center: boundaryMarker ? [boundaryMarker.latitude, boundaryMarker.longitude] : undefined,
  });

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    { name: 'code', label: 'Code', type: 'text', required: true },
    {
      name: 'kelompokKomunitasId',
      label: 'Kelompok Komunitas',
      type: 'dropdown-comunity-group',
      paginationParams: { limit: 9999, filter: isGlobalAdmin ? undefined : `id:${user?.groupId}` },
      required: true,
    },
    {
      name: 'checkerId',
      label: 'Checker',
      type: 'dropdown-surveyor',
      paginationParams: {
        limit: 9999,
        filter: isGlobalAdmin ? undefined : `groupId:${user?.groupId}`,
      },
      required: true,
    },
    { name: 'installYear', label: 'Install Year', type: 'text', required: true },
    {
      name: 'status',
      label: 'Status',
      type: 'dropdown',
      data: [
        { label: 'Aktif', value: '1' },
        { label: 'Tidak Aktif', value: '0' },
      ],
    },
    { name: 'description', label: 'Description', type: 'text' },
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
        {boundaryMarker ? 'Update Patok Batas' : 'Tambah Patok Batas'}
      </h2>
      {formItem.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => <FieldForm item={item} field={field}></FieldForm>}
        </form.Field>
      ))}

      <MapsForm
        required
        form={form}
        mapRef={mapRef}
        mapCenter={mapCenter}
        markerPosition={markerPosition}
        handleLocationSelect={handleLocationSelect}
      />

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <ConfirmationDialog
            title={
              boundaryMarker
                ? 'Apakah anda yakin untuk mengupdate?'
                : 'Apakah anda yakin untuk menambah?'
            }
            message={
              boundaryMarker
                ? 'Data yang sudah ada akan diupdate'
                : 'Data akan ditambahkan ke dalam database patok batas'
            }
            confirmText={
              isSubmitting
                ? 'Submitting...'
                : boundaryMarker
                  ? 'Update Patok Batas'
                  : 'Tambah Patok Batas'
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
                {boundaryMarker ? 'Update Patok Batas' : 'Tambah Patok Batas'}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
};
