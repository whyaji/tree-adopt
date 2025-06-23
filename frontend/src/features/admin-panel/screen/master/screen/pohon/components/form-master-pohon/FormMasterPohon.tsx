import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { Button } from '@/components/ui/button';
import { FieldInfo } from '@/components/ui/field-info';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createMasterTree, updateMasterTree, updateMasterTreeLocal } from '@/lib/api/masterTreeApi';
import { assertAndHandleFormErrors } from '@/lib/utils/setErrorForms';
import { MasterTreeType } from '@/types/masterTree.type';

export const FormMasterPohon: FC<{
  masterTree?: MasterTreeType | null;
}> = ({ masterTree }) => {
  const navigate = useNavigate();

  // 👇 Local tree state management
  const [localTrees, setLocalTrees] = useState<
    { id?: number; localName: string; status: 'create' | 'update' | 'delete' }[]
  >([]);

  // 👇 Populate from props
  useEffect(() => {
    if (masterTree?.masterLocalTree) {
      setLocalTrees(
        masterTree.masterLocalTree.map((lt) => ({
          id: lt.id,
          localName: lt.localName,
          status: 'update',
        }))
      );
    }
  }, [masterTree]);

  const form = useForm({
    defaultValues: {
      latinName: masterTree?.latinName ?? '',
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        let id = masterTree?.id;

        if (masterTree && id) {
          const res = await updateMasterTree({ id, ...value });
          assertAndHandleFormErrors<typeof value>(res, formApi.setFieldMeta);
          toast('Master pohon updated successfully');
        } else {
          const res = await createMasterTree(value);
          assertAndHandleFormErrors<typeof value>(res, formApi.setFieldMeta);
          if (res && 'masterTreeId' in res) {
            id = res.masterTreeId;
            toast('Master pohon added successfully');
          }
        }

        // 👇 Sync local names if update
        if (id) {
          const payload = localTrees.filter((lt) => lt.status !== 'delete' || lt.id);
          await updateMasterTreeLocal(String(id), payload);
        }

        form.reset();
        navigate({ to: '/admin/master/pohon' });
      } catch (error) {
        console.error(error);
        toast.error(masterTree ? 'Failed to update Master pohon' : 'Failed to add Master pohon');
      }
    },
  });

  // 👇 Handlers
  const addLocalName = () => {
    setLocalTrees((prev) => [...prev, { localName: '', status: 'create' }]);
  };

  const updateLocalName = (index: number, value: string) => {
    setLocalTrees((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              localName: value,
              status: item.status === 'update' ? 'update' : 'create',
            }
          : item
      )
    );
  };

  const removeLocalName = (index: number) => {
    setLocalTrees((prev) => {
      const item = prev[index];
      if (item.id) {
        // mark for deletion
        return [...prev.slice(0, index), { ...item, status: 'delete' }, ...prev.slice(index + 1)];
      } else {
        // remove unsaved
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      }
    });
  };

  return (
    <form
      className="flex flex-col gap-2 max-w-6xl m-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
      <h2 className="text-2xl font-bold">
        {masterTree ? 'Update Master Tree' : 'Add Master Tree'}
      </h2>

      <form.Field name={'latinName'}>
        {(field) => (
          <>
            <Label htmlFor={field.name}>Latin Name</Label>
            <Input
              id={field.name}
              name={field.name}
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldInfo field={field} />
          </>
        )}
      </form.Field>

      {/* 👇 Dynamic Local Name List */}
      <div className="flex flex-col gap-2 mt-4">
        <Label>Nama Lokal</Label>
        {localTrees.map((lt, index) =>
          lt.status !== 'delete' ? (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={lt.localName}
                onChange={(e) => updateLocalName(index, e.target.value)}
                placeholder={`Nama Lokal ${index + 1}`}
              />
              <Button type="button" variant="destructive" onClick={() => removeLocalName(index)}>
                Hapus
              </Button>
            </div>
          ) : null
        )}
        <Button variant="secondary" type="button" onClick={addLocalName} className="mt-2">
          + Tambah Nama Lokal
        </Button>
      </div>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <ConfirmationDialog
            title={
              masterTree
                ? 'Apakah anda yakin untuk mengupdate?'
                : 'Apakah anda yakin untuk menambah?'
            }
            message={
              masterTree
                ? 'Data yang sudah ada akan diupdate'
                : 'Data akan ditambahkan ke dalam database master pohon'
            }
            confirmText={
              isSubmitting
                ? 'Submitting...'
                : masterTree
                  ? 'Update Master Pohon'
                  : 'Tambah Master Pohon'
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
                {masterTree ? 'Update Master Pohon' : 'Tambah Master Pohon'}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
};
