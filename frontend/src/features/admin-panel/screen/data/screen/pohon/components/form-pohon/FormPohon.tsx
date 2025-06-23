import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { FC } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { FieldForm, FieldItemType } from '@/components/field-form';
import { MapsForm } from '@/components/maps-form';
import { Button } from '@/components/ui/button';
import { ListLandCover } from '@/enum/landCover.enum';
import { PERMISSION } from '@/enum/permission.enum';
import { useMapsState } from '@/hooks/use-maps-state';
import { createTree, updateTree } from '@/lib/api/treeApi';
import { useUserStore } from '@/lib/stores/userStore';
import { checkPermission } from '@/lib/utils/permissions';
import { assertAndHandleFormErrors } from '@/lib/utils/setErrorForms';
import { TreeType } from '@/types/tree.type';

export const FormPohon: FC<{
  tree?: TreeType | null;
}> = ({ tree }) => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      code: tree?.code ?? '',
      masterTreeId: tree?.masterTreeId ? String(tree.masterTreeId) : '',
      localTreeName: tree?.localTreeName ?? '',
      kelompokKomunitasId: tree?.kelompokKomunitasId ? String(tree.kelompokKomunitasId) : '',
      surveyorId: tree?.surveyorId ? String(tree.surveyorId) : '',
      status: tree?.status ? String(tree.status) : '',
      elevation: tree?.elevation ? String(tree.elevation) : '',
      latitude: tree?.latitude ? String(tree.latitude) : '',
      longitude: tree?.longitude ? String(tree.longitude) : '',
      landCover: tree?.landCover ? String(tree.landCover) : '',
    },
    onSubmit: async ({ value, formApi }) => {
      const dataValue = {
        code: value.code,
        masterTreeId: Number(value.masterTreeId),
        localTreeName: value.localTreeName,
        kelompokKomunitasId: Number(value.kelompokKomunitasId),
        surveyorId: Number(value.surveyorId),
        status: Number(value.status),
        elevation: Number(value.elevation),
        latitude: Number(value.latitude),
        longitude: Number(value.longitude),
        landCover: Number(value.landCover),
      };
      try {
        if (tree) {
          const result = await updateTree({ id: tree.id, ...dataValue });
          assertAndHandleFormErrors<typeof value>(result, formApi.setFieldMeta);
          toast('Pohon updated successfully');
        } else {
          const result = await createTree(dataValue);
          assertAndHandleFormErrors<typeof value>(result, formApi.setFieldMeta);
          toast('Pohon added successfully');
        }
        form.reset();
        navigate({ to: '/admin/data/pohon' });
      } catch {
        if (tree) {
          toast.error('Failed to update pohon');
        } else {
          toast.error('Failed to add pohon');
        }
      }
    },
  });

  const isGlobalAdmin = checkPermission(user?.permissions ?? [], [
    PERMISSION.TREE_CREATE_LEVEL_GLOBAL,
    PERMISSION.TREE_UPDATE_LEVEL_GLOBAL,
  ]);

  const { mapRef, mapCenter, markerPosition, handleLocationSelect } = useMapsState({
    form,
    center: tree ? [tree.latitude, tree.longitude] : undefined,
  });

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    { name: 'code', label: 'Code', type: 'text', required: true },
    {
      name: 'masterTreeId',
      label: 'Tree',
      type: 'dropdown-master-tree',
      paginationParams: { withData: 'masterLocalTree', limit: 9999 },
    },
    { name: 'localTreeName', label: 'Local Tree Name', type: 'text', required: true },
    {
      name: 'kelompokKomunitasId',
      label: 'Kelompok Komunitas',
      type: 'dropdown-comunity-group',
      paginationParams: { limit: 9999, filter: isGlobalAdmin ? undefined : `id:${user?.groupId}` },
      required: true,
    },
    {
      name: 'surveyorId',
      label: 'Surveyor',
      type: 'dropdown-surveyor',
      paginationParams: {
        limit: 9999,
        filter: isGlobalAdmin ? undefined : `groupId:${user?.groupId}`,
      },
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'dropdown',
      data: [
        { label: 'Aktif', value: '1' },
        { label: 'Tidak Aktif', value: '0' },
      ],
    },
    { name: 'elevation', label: 'Elevation', type: 'number', required: true },
    {
      name: 'landCover',
      label: 'Land Cover',
      type: 'dropdown',
      data: ListLandCover,
      required: true,
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
      <h2 className="text-2xl font-bold">Add Tree</h2>
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
              tree ? 'Apakah anda yakin untuk mengupdate?' : 'Apakah anda yakin untuk menambah?'
            }
            message={
              tree
                ? 'Data yang sudah ada akan diupdate'
                : 'Data akan ditambahkan ke dalam database master pohon'
            }
            confirmText={isSubmitting ? 'Submitting...' : tree ? 'Update Pohon' : 'Tambah Pohon'}
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
                {tree ? 'Update Pohon' : 'Tambah Pohon'}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
};
