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
import { RoleType } from '@/types/role.type';

import { createRole, updateRole } from '../../api/rolePermissionApi';

export const DialogFormRoleContent: FC<{
  type: 'create' | 'edit' | 'view';
  role?: RoleType;
  onSave?: () => void;
}> = ({ type, role, onSave }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm({
    defaultValues: {
      name: role?.name ?? '',
      code: role?.code ?? '',
      description: role?.description ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        // code is kebab-case from name
        const dataValue = {
          name: value.name,
          code: toSnakeCase(value.name).replace(/_/g, '-'),
          description: value.description !== '' ? value.description : undefined,
        };
        if (!dataValue.description) {
          delete dataValue.description;
        }
        if (role) {
          await updateRole({ id: role.id, ...dataValue });
          toast('Role updated successfully');
        } else {
          await createRole(dataValue);
          toast('Role added successfully');
        }
        form.reset();
        // Close the dialog after success
        onSave?.();
        closeRef.current?.click();
      } catch {
        if (role) {
          toast.error('Failed to update role');
        } else {
          toast.error('Failed to add role');
        }
      }
    },
  });

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    { name: 'name', label: 'Name', type: 'text', disabled: type === 'view' },
    { name: 'description', label: 'Description', type: 'area', disabled: type === 'view' },
  ];

  if (type === 'view') {
    formItem.push({ name: 'code', label: 'Code', type: 'text', disabled: true });
  }

  const getTextDisplay = (type: 'create' | 'edit' | 'view') => {
    switch (type) {
      case 'create':
        return {
          title: 'Tambah Role',
          description: 'Buat role baru untuk mengelola izin akses.',
        };
      case 'edit':
        return {
          title: 'Edit Role',
          description: 'Ubah detail role yang ada.',
        };
      case 'view':
        return {
          title: 'Lihat Role',
          description: 'Lihat detail role tanpa mengubahnya.',
        };
      default:
        return {
          title: 'Role',
          description: 'Kelola role dan izin akses.',
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
