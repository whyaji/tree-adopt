import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { FC } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { FieldForm, FieldItemType } from '@/components/field-form';
import { Button } from '@/components/ui/button';
import { createUser, updateUser } from '@/lib/api/userApi';
import { UserType } from '@/types/user.type';

export const FormUser: FC<{
  user?: UserType | null;
}> = ({ user }) => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      role: user ? String(user.role) : '',
      groupId: user?.groupId ? String(user.groupId) : '',
    },
    onSubmit: async ({ value }) => {
      try {
        if (user) {
          const dataValue = {
            name: value.name,
            email: value.email,
            password: value.password === '' ? user.password : value.password,
            role: Number(value.role),
            groupId: value.groupId ? Number(value.groupId) : undefined,
          };
          await updateUser({ id: user.id, ...dataValue });
          toast('User updated successfully');
        } else {
          const dataValue = {
            name: value.name,
            email: value.email,
            password: value.password,
          };
          await createUser(dataValue);
          toast('User added successfully');
        }
        form.reset();
        navigate({ to: '/admin/config/user' });
      } catch {
        if (user) {
          toast.error('Failed to update user');
        } else {
          toast.error('Failed to add user');
        }
      }
    },
  });

  const formItem: FieldItemType<keyof (typeof form)['state']['values']>[] = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'password', label: 'Password', type: 'password' },
    {
      name: 'role',
      label: 'Role',
      type: 'dropdown',
      data: [
        { label: 'Admin', value: '0' },
        { label: 'User', value: '1' },
      ],
    },
    { name: 'groupId', label: 'Kelompok Komunitas', type: 'dropdown-comunity-group' },
  ];

  return (
    <form
      className="flex flex-col gap-2 max-w-6xl m-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
      <h2 className="text-2xl font-bold">{user ? 'Update User' : 'Tambah User'}</h2>
      {formItem.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => <FieldForm item={item} field={field}></FieldForm>}
        </form.Field>
      ))}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <ConfirmationDialog
            title={
              user ? 'Apakah anda yakin untuk mengupdate?' : 'Apakah anda yakin untuk menambah?'
            }
            message={
              user
                ? 'Data yang sudah ada akan diupdate'
                : 'Data akan ditambahkan ke dalam database master user'
            }
            confirmText={isSubmitting ? 'Submitting...' : user ? 'Update User' : 'Tambah User'}
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
                {user ? 'Update User' : 'Tambah User'}
              </Button>
            }
          />
        )}
      </form.Subscribe>
    </form>
  );
};
