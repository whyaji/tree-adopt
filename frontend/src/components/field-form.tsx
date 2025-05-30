/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginationParamsOptional } from '@/interface/pagination.interface';

import { DatePicker } from './date-picker';
import {
  DropdownComunityGroupList,
  DropdownDataList,
  DropdownMasterTreeList,
  DropdownUserList,
} from './dropdown';
import InputSuggestion from './input-suggestion';
import { FieldInfo } from './ui/field-info';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MultiSelect } from './ui/multi-select';
import { Textarea } from './ui/textarea';

export type FieldItemType<T> = {
  name: T;
  label: string;
  type: FieldType;
  data?: {
    label: string;
    value: string;
  }[];
  suggestions?: string[];
  paginationParams?: PaginationParamsOptional;
  disabled?: boolean;
};

export type FieldType =
  | 'text'
  | 'text-suggestions'
  | 'number'
  | 'email'
  | 'password'
  | 'area'
  | 'multi-select'
  | 'dropdown'
  | 'dropdown-master-tree'
  | 'dropdown-surveyor'
  | 'dropdown-comunity-group'
  | 'date';

export function FieldForm<T>({
  item,
  field,
}: {
  item: FieldItemType<T>;
  field: {
    name: string;
    state: {
      value: string | string[];
    };
    handleBlur: () => void;
    handleChange: (value: string | string[]) => void;
  };
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{item.label}</Label>
      {(() => {
        switch (item.type) {
          case 'area':
            return (
              typeof field.state.value === 'string' && (
                <Textarea
                  disabled={item.disabled}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )
            );

          case 'text-suggestions':
            return (
              typeof field.state.value === 'string' && (
                <InputSuggestion
                  disabled={item.disabled}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  suggestions={item.suggestions}
                />
              )
            );

          case 'dropdown':
            return (
              typeof field.state.value === 'string' && (
                <DropdownDataList
                  label={item.label}
                  values={item.data || []}
                  value={field.state.value}
                  setValue={(value) => field.handleChange(value)}
                />
              )
            );

          case 'dropdown-master-tree':
            return (
              typeof field.state.value === 'string' && (
                <DropdownMasterTreeList
                  label={item.label}
                  value={field.state.value}
                  setValue={(value) => field.handleChange(value)}
                />
              )
            );

          case 'dropdown-surveyor':
            return (
              typeof field.state.value === 'string' && (
                <DropdownUserList
                  label={item.label}
                  value={field.state.value}
                  setValue={(value) => field.handleChange(value)}
                />
              )
            );

          case 'dropdown-comunity-group':
            return (
              typeof field.state.value === 'string' && (
                <DropdownComunityGroupList
                  label={item.label}
                  value={field.state.value}
                  setValue={(value) => field.handleChange(value)}
                />
              )
            );

          case 'date':
            return (
              typeof field.state.value === 'string' && (
                <DatePicker
                  label={item.label}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                />
              )
            );

          case 'multi-select':
            return (
              typeof field.state.value !== 'string' && (
                <MultiSelect
                  options={item.data || []}
                  onValueChange={(value: string[]) => field.handleChange(value)}
                  defaultValue={field.state.value}
                  placeholder="Select options"
                  variant="inverted"
                />
              )
            );

          default:
            return (
              typeof field.state.value === 'string' && (
                <Input
                  disabled={item.disabled}
                  id={field.name}
                  name={field.name}
                  type={item.type}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )
            );
        }
      })()}
      <FieldInfo field={field as any} />
    </div>
  );
}
