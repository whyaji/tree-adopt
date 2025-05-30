import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { FC } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { FieldForm, FieldItemType } from '@/components/field-form';
import { Button } from '@/components/ui/button';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { createUser, saveUserRoles, updateUser } from '@/lib/api/userApi';
import { useUserStore } from '@/lib/stores/userStore';
import { RoleType } from '@/types/role.type';
import { UserType } from '@/types/user.type';

import { getRoles } from '../../../role-permission/api/rolePermissionApi';

const saveRoles = async (userId: number, rolesIds: string[]) => {
  try {
    await saveUserRoles(
      userId,
      rolesIds.filter((id) => id !== '' && id !== '0').map((id) => Number(id))
    );
  } catch (error) {
    console.error('Failed to save user roles:', error);
    toast.error('Failed to save user roles');
  }
};

export const FormUser: FC<{
  user?: UserType | null;
}> = ({ user }) => {
  const loggedInUser = useUserStore((state) => state.user);
  const paginationParams = usePaginationFilter({
    limit: 9999,
    filter: loggedInUser?.permissions?.includes('user-management.create-level-global')
      ? undefined
      : 'code:admin-global:notin',
  });

  const { data } = useQuery({
    queryKey: ['get-roles', paginationParams],
    queryFn: () => getRoles(paginationParams),
  });

  const dataRole: RoleType[] = data?.data ?? [];
  const roles = dataRole.map((role) => ({
    label: role.name,
    value: String(role.id),
  }));

  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      role: user ? String(user.role) : '',
      groupId: user?.groupId ? String(user.groupId) : '',
      rolesIds: user?.roles?.map((role) => String(role.id)) ?? [],
    },
    onSubmit: async ({ value }) => {
      try {
        const dataValue = {
          name: value.name,
          email: value.email,
          role: Number(value.role),
          groupId: value.groupId ? Number(value.groupId) : undefined,
        };
        if (user) {
          const updateData = {
            id: user.id,
            ...dataValue,
            password: value.password === '' ? user.password : value.password,
          };
          await updateUser(updateData);
          await saveRoles(user.id, value.rolesIds);
          toast('User updated successfully');
        } else {
          const createData = {
            ...dataValue,
            password: value.password,
          };
          const result = await createUser(createData);
          const userId = result.data.userId;
          await saveRoles(userId, value.rolesIds);
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
      label: 'Type',
      type: 'dropdown',
      data: [
        { label: 'Admin', value: '0' },
        { label: 'User', value: '1' },
      ],
    },
    { name: 'groupId', label: 'Kelompok Komunitas', type: 'dropdown-comunity-group' },
    {
      name: 'rolesIds',
      label: 'Roles',
      type: 'multi-select',
      data: roles,
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
