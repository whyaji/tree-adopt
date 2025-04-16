import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { FC } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FieldInfo } from '@/components/ui/field-info';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createMasterTree, updateMasterTree } from '@/lib/api/masterTreeApi';
import { MasterTreeType } from '@/types/masterTree.type';

export const FormMasterPohon: FC<{
  masterTree?: MasterTreeType | null;
}> = ({ masterTree }) => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      latinName: masterTree?.latinName ?? '',
      localName: masterTree?.localName ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        if (masterTree) {
          await updateMasterTree({ id: masterTree.id, ...value });
          toast('Master pohon updated successfully');
        } else {
          await createMasterTree(value);
          toast('Master pohon added successfully');
        }
        form.reset();
        navigate({ to: '/admin/master/pohon' });
      } catch {
        if (masterTree) {
          alert('Failed to update Master pohon');
        } else {
          alert('Failed to add Master pohon');
        }
      }
    },
  });

  const formItem: {
    name: keyof (typeof form)['state']['values'];
    label: string;
    type: string;
  }[] = [
    { name: 'latinName', label: 'Latin Name', type: 'text' },
    { name: 'localName', label: 'Local Name', type: 'text' },
  ];

  return (
    <form
      className="flex flex-col gap-2 max-w-6xl m-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
      <h2 className="text-2xl font-bold">Add Komunitas</h2>
      {formItem.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => (
            <>
              <Label htmlFor={field.name}>{item.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={item.type}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        </form.Field>
      ))}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit} className="mt-4">
            {isSubmitting
              ? 'Submitting...'
              : masterTree
                ? 'Update Master Pohon'
                : 'Tambah Master Pohon'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
};
