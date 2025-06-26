import { useForm } from '@tanstack/react-form';
import { useRef } from 'react';
import { toast } from 'sonner';

import { FieldForm, FieldItemType } from '@/components/field-form';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { updateTreeLocalName } from '@/lib/api/treeApi';
import { assertAndHandleFormErrors } from '@/lib/utils/setErrorForms';
import { TreeType } from '@/types/tree.type';

export function DialogFormLocalTreeName({
  tree,
  refetch,
}: {
  tree: TreeType;
  refetch?: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const form = useForm({
    defaultValues: {
      localTreeName: tree?.localTreeName ?? '',
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await updateTreeLocalName(String(tree.id), value.localTreeName);
        assertAndHandleFormErrors<typeof value>(result, formApi.setFieldMeta);
        toast('Pohon updated successfully');
        refetch?.();
        form.reset();
        closeRef.current?.click();
      } catch {
        if (tree) {
          toast.error('Failed to update pohon');
        } else {
          toast.error('Failed to add pohon');
        }
      }
    },
  });

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    { name: 'localTreeName', label: 'Name Lokal Pohon', type: 'text' },
  ];

  return (
    <DialogContent className="sm:max-w-[600px]">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}>
        <DialogHeader>
          <DialogTitle>Edit Nama Lokal</DialogTitle>
          <DialogDescription>Pohon {tree.code}</DialogDescription>
        </DialogHeader>

        {formItem.map((item) => (
          <form.Field key={item.name} name={item.name}>
            {(field) => <FieldForm item={item} field={field}></FieldForm>}
          </form.Field>
        ))}

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" ref={closeRef}>
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                Simpan
              </Button>
            </DialogFooter>
          )}
        </form.Subscribe>
      </form>
    </DialogContent>
  );
}
