import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { FC } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { FieldForm, FieldItemType } from '@/components/field-form';
import { Button } from '@/components/ui/button';
import { createMasterTreeLocal, updateMasterTreeLocalById } from '@/lib/api/masterTreeApi';
import { assertAndHandleFormErrors } from '@/lib/utils/setErrorForms';
import { MasterLocalTreeType } from '@/types/masterTree.type';

export const FormMasterLocalTree: FC<{
  masterLocalTree?: MasterLocalTreeType | null;
}> = ({ masterLocalTree }) => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      masterTreeId: masterLocalTree?.masterTreeId ? String(masterLocalTree?.masterTreeId) : '',
      localName: masterLocalTree?.localName ?? '',
    },
    onSubmit: async ({ value, formApi }) => {
      const valueInput = {
        masterTreeId: Number(value.masterTreeId),
        localName: value.localName,
      };
      try {
        if (masterLocalTree?.id) {
          const res = await updateMasterTreeLocalById(
            { id: masterLocalTree.id, ...valueInput },
            String(masterLocalTree.id)
          );
          assertAndHandleFormErrors<typeof value>(res, formApi.setFieldMeta);
          toast('Master Pohon Lokal updated successfully');
        } else {
          const res = await createMasterTreeLocal(valueInput);
          assertAndHandleFormErrors<typeof value>(res, formApi.setFieldMeta);
          toast('Master Pohon Lokal added successfully');
        }

        form.reset();
        navigate({ to: '/admin/master/pohon-lokal' });
      } catch (error) {
        console.error(error);
        toast.error(
          masterLocalTree
            ? 'Failed to update Master Pohon Lokal'
            : 'Failed to add Master Pohon Lokal'
        );
      }
    },
  });

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    {
      name: 'masterTreeId',
      label: 'Master Pohon Lokal',
      type: 'dropdown-master-tree',
      required: true,
      paginationParams: {
        withData: 'masterLocalTree',
        limit: 9999,
      },
    },
    {
      name: 'localName',
      label: 'Nama Lokal',
      type: 'text',
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
      <h2 className="text-2xl font-bold">
        {masterLocalTree ? 'Update Master Tree' : 'Add Master Tree'}
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
              masterLocalTree
                ? 'Apakah anda yakin untuk mengupdate?'
                : 'Apakah anda yakin untuk menambah?'
            }
            message={
              masterLocalTree
                ? 'Data yang sudah ada akan diupdate'
                : 'Data akan ditambahkan ke dalam database Master Pohon Lokal'
            }
            confirmText={
              isSubmitting
                ? 'Submitting...'
                : masterLocalTree
                  ? 'Update Master Pohon Lokal'
                  : 'Tambah Master Pohon Lokal'
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
                {masterLocalTree ? 'Update Master Pohon Lokal' : 'Tambah Master Pohon Lokal'}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
};
