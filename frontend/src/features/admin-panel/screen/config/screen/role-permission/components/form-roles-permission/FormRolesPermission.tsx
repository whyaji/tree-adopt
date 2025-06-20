import { ChevronUp, Pencil } from 'lucide-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { getCurrentUser } from '@/lib/api/authApi';
import { useUserStore } from '@/lib/stores/userStore';
import { GroupedPermissionType } from '@/types/permission.type';
import { RoleType } from '@/types/role.type';

import { saveRolePermissions } from '../../api/rolePermissionApi';
import { DialogFormPermissionContent } from '../dialog-form-permission/DialogFormPermission';

const FormRolesPermission: FC<{
  role?: RoleType;
  groupPermissions: GroupedPermissionType[];
  onSaved?: () => void;
  groupSuggestions?: string[];
  onSavedPermission?: () => void;
}> = ({ groupPermissions, role, onSaved, groupSuggestions, onSavedPermission }) => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [permissionsIds, setPermissionsIds] = useState<number[]>([]);
  const [defaultPermissionsIds, setDefaultPermissionsIds] = useState<number[]>([]);

  useEffect(() => {
    if (role) {
      const permissions = role.permissions?.map((p) => p.id) ?? [];
      setDefaultPermissionsIds(permissions);
      setPermissionsIds(permissions);
    }
  }, [role]);

  const refreshUser = async () => {
    try {
      const refreshedUser = await getCurrentUser();
      if (refreshedUser.data) {
        setUser(refreshedUser.data);
      } else {
        throw new Error('User data is empty');
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      toast.error('Failed to refresh user');
    }
  };

  const handleSavePermissions = async () => {
    if (!role) {
      console.error('No role provided to save permissions');
      toast.error('No role provided to save permissions');
      return;
    }

    try {
      await saveRolePermissions(role.id, permissionsIds);
      onSaved?.();
      setDefaultPermissionsIds(permissionsIds);
      toast.success('Permissions saved successfully');
      if (user?.roles?.some((r) => r.code === role.code)) {
        await refreshUser();
      }
    } catch (error) {
      console.error('Failed to save permissions:', error);
      toast.error('Failed to save permissions');
    }
  };

  // variable permissionsIds is same as defaultPermissionsIds
  const isPermissionsChanged = useMemo(() => {
    return (
      permissionsIds.length !== defaultPermissionsIds.length ||
      permissionsIds.some((id) => !defaultPermissionsIds.includes(id)) ||
      defaultPermissionsIds.some((id) => !permissionsIds.includes(id))
    );
  }, [permissionsIds, defaultPermissionsIds]);

  const [groupedCodesCollapsed, setGroupedCodesCollapsed] = useState<string[]>(
    groupPermissions.map((group) => group.groupCode)
  );

  const setGroupedCollapsed = (groupCode: string) => {
    setGroupedCodesCollapsed((prev) =>
      prev.includes(groupCode) ? prev.filter((code) => code !== groupCode) : [...prev, groupCode]
    );
  };

  const isGroupCollapsed = (groupCode: string) => {
    return groupedCodesCollapsed.includes(groupCode);
  };

  return (
    <div className="flex flex-col gap-4">
      {groupPermissions.map((group) => {
        const isOpen = isGroupCollapsed(group.groupCode);
        const onOpenChange = () => setGroupedCollapsed(group.groupCode);
        const permissions = (group.permissions ?? [])
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name));

        return (
          <Collapsible
            key={group.groupCode}
            open={isOpen}
            onOpenChange={onOpenChange}
            className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="space-y-2">
              <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center gap-2">
                  {role && (
                    <Checkbox
                      className="mr-2"
                      iconType={
                        group.permissions.every((p) => permissionsIds.includes(p.id))
                          ? 'check'
                          : 'minus'
                      }
                      checked={group.permissions.some((p) => permissionsIds.includes(p.id))}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPermissionsIds((prev) => [
                            ...prev,
                            ...group.permissions.map((p) => p.id),
                          ]);
                        } else {
                          setPermissionsIds((prev) =>
                            prev.filter((id) => !group.permissions.some((p) => p.id === id))
                          );
                        }
                      }}
                    />
                  )}
                  <h3 className="text-lg font-semibold">{group.groupName}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={onOpenChange}>
                  <ChevronUp
                    size={20}
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
                  />
                </Button>
              </div>
              <CollapsibleContent>
                {role ? (
                  <ul className="list-disc pl-5">
                    {permissions.map((permission) => (
                      <li key={permission.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={permissionsIds.includes(permission.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPermissionsIds((prev) => [...prev, permission.id]);
                            } else {
                              setPermissionsIds((prev) =>
                                prev.filter((id) => id !== permission.id)
                              );
                            }
                          }}
                        />
                        {permission.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="list-disc pl-5">
                    {permissions.map((permission) => (
                      <li key={permission.id} className="text-sm">
                        <div className="flex items-center justify-between">
                          {permission.name}
                          <Dialog>
                            <DialogTrigger asChild>
                              <button>
                                <Pencil size={12} />
                              </button>
                            </DialogTrigger>
                            <DialogFormPermissionContent
                              type="edit"
                              permission={permission}
                              onSave={onSavedPermission}
                              groupSuggestions={groupSuggestions}
                            />
                          </Dialog>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
      {role && isPermissionsChanged && (
        // Button cancel and save permissions
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="px-4 py-2"
            onClick={() => setPermissionsIds(defaultPermissionsIds)}>
            Cancel
          </Button>
          <Button
            className="px-4 py-2"
            onClick={(e) => {
              e.preventDefault();
              // Handle save permissions logic here
              handleSavePermissions();
            }}>
            Save Permissions
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormRolesPermission;
