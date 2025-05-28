import { useForm } from '@tanstack/react-form';
import { toSnakeCase } from 'drizzle-orm/casing';
import { FC, useRef } from 'react';
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
import { PermissionType } from '@/types/permission.type';

import { createPermission, updatePermission } from '../../api/rolePermissionApi';

export const DialogFormPermissionContent: FC<{
  type: 'create' | 'edit' | 'view';
  permission?: PermissionType;
  groupSuggestions?: string[];
  onSave?: () => void;
}> = ({ type, permission, onSave, groupSuggestions = [] }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm({
    defaultValues: {
      name: permission?.name ?? '',
      code: permission?.code ?? '',
      groupName: permission?.groupName ?? '',
      groupCode: permission?.groupCode ?? '',
      description: permission?.description ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        // code is kebab-case from name
        const dataValue = {
          name: value.name,
          code: toSnakeCase(value.name).replace(/_/g, '-'),
          groupName: value.groupName,
          groupCode: toSnakeCase(value.groupName).replace(/_/g, '-'),
          description: value.description !== '' ? value.description : undefined,
        };
        if (!dataValue.description) {
          delete dataValue.description;
        }
        if (permission) {
          await updatePermission({ id: permission.id, ...dataValue });
          toast('Permission updated successfully');
        } else {
          await createPermission(dataValue);
          toast('Permission added successfully');
        }
        form.reset();
        // Close the dialog after success
        onSave?.();
        closeRef.current?.click();
      } catch {
        if (permission) {
          toast.error('Failed to update permission ');
        } else {
          toast.error('Failed to add permission ');
        }
      }
    },
  });

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    { name: 'name', label: 'Name', type: 'text', disabled: type === 'view' },
    {
      name: 'groupName',
      label: 'Group Name',
      type: 'text-suggestions',
      disabled: type === 'view',
      suggestions: groupSuggestions,
    },
    { name: 'description', label: 'Description', type: 'area', disabled: type === 'view' },
  ];

  if (type === 'view') {
    formItem.push({ name: 'code', label: 'Code', type: 'text', disabled: true });
  }

  const getTextDisplay = (type: 'create' | 'edit' | 'view') => {
    switch (type) {
      case 'create':
        return {
          title: 'Tambah Permission ',
          description: 'Buat permission baru untuk mengelola izin akses.',
        };
      case 'edit':
        return {
          title: 'Edit Permission ',
          description: 'Ubah detail permission yang ada.',
        };
      case 'view':
        return {
          title: 'Lihat Permission ',
          description: 'Lihat detail permission tanpa mengubahnya.',
        };
      default:
        return {
          title: 'Role',
          description: 'Kelola permission dan izin akses.',
        };
    }
  };

  const { title, description } = getTextDisplay(type);

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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
};
