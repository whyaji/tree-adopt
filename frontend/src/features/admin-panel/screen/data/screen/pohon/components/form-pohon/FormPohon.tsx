import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { FC } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { FieldForm, FieldItemType } from '@/components/field-form';
import { MapsForm } from '@/components/maps-form';
import { Button } from '@/components/ui/button';
import { ListLandType } from '@/enum/landType.enum';
import { useMapsState } from '@/hooks/use-maps-state';
import { createTree, updateTree } from '@/lib/api/treeApi';
import { TreeType } from '@/types/tree.type';

export const FormPohon: FC<{
  tree?: TreeType | null;
}> = ({ tree }) => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      code: tree?.code ?? '',
      masterTreeId: tree?.masterTreeId ? String(tree.masterTreeId) : '',
      kelompokKomunitasId: tree?.kelompokKomunitasId ? String(tree.kelompokKomunitasId) : '',
      surveyorId: tree?.surveyorId ? String(tree.surveyorId) : '',
      status: tree?.status ? String(tree.status) : '',
      elevation: tree?.elevation ? String(tree.elevation) : '',
      address: tree?.address ?? '',
      latitude: tree?.latitude ? String(tree.latitude) : '',
      longitude: tree?.longitude ? String(tree.longitude) : '',
      landType: tree?.landType ? String(tree.landType) : '',
    },
    onSubmit: async ({ value }) => {
      const dataValue = {
        code: value.code,
        masterTreeId: Number(value.masterTreeId),
        kelompokKomunitasId: Number(value.kelompokKomunitasId),
        surveyorId: Number(value.surveyorId),
        status: Number(value.status),
        elevation: Number(value.elevation),
        address: value.address,
        latitude: Number(value.latitude),
        longitude: Number(value.longitude),
        landType: Number(value.landType),
      };
      try {
        if (tree) {
          await updateTree({ id: tree.id, ...dataValue });
          toast('Pohon updated successfully');
        } else {
          await createTree(dataValue);
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

  const { mapRef, mapCenter, markerPosition, handleLocationSelect } = useMapsState({
    form,
    center: tree ? [tree.latitude, tree.longitude] : undefined,
  });

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    { name: 'code', label: 'Code', type: 'text' },
    { name: 'masterTreeId', label: 'Tree', type: 'dropdown-master-tree' },
    { name: 'kelompokKomunitasId', label: 'Kelompok Komunitas', type: 'dropdown-comunity-group' },
    { name: 'surveyorId', label: 'Surveyor', type: 'dropdown-surveyor' },
    {
      name: 'status',
      label: 'Status',
      type: 'dropdown',
      data: [
        { label: 'Aktif', value: '1' },
        { label: 'Tidak Aktif', value: '0' },
      ],
    },
    { name: 'elevation', label: 'Elevation', type: 'number' },
    { name: 'address', label: 'Address', type: 'area' },
    { name: 'landType', label: 'Land Type', type: 'dropdown', data: ListLandType },
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
          {(field) => (
            <>
              <FieldForm item={item} field={field}></FieldForm>
            </>
          )}
        </form.Field>
      ))}

      <MapsForm
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
