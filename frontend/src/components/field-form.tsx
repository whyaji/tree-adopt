/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginationParamsOptional } from '@/interface/pagination.interface';

import { DropdownDataList, DropdownMasterTreeList } from './dropdown';
import { FieldInfo } from './ui/field-info';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export type FieldItemType<T> = {
  name: T;
  label: string;
  type: FieldType;
  data?: {
    label: string;
    value: string;
  }[];
  paginationParams?: PaginationParamsOptional;
};

export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'area'
  | 'dropdown'
  | 'dropdown-master-tree';

export function FieldForm<T>({
  item,
  field,
}: {
  item: FieldItemType<T>;
  field: {
    name: string;
    state: {
      value: string;
    };
    handleBlur: () => void;
    handleChange: (value: string) => void;
  };
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{item.label}</Label>
      {(() => {
        switch (item.type) {
          case 'area':
            return (
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            );

          case 'dropdown':
            return (
              <DropdownDataList
                label={item.label}
                values={item.data || []}
                value={field.state.value}
                setValue={(value) => field.handleChange(value)}
              />
            );

          case 'dropdown-master-tree':
            return (
              <DropdownMasterTreeList
                label={item.label}
                value={field.state.value}
                setValue={(value) => field.handleChange(value)}
              />
            );

          default:
            return (
              <Input
                id={field.name}
                name={field.name}
                type={item.type}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            );
        }
      })()}
      <FieldInfo field={field as any} />
    </div>
  );
}
