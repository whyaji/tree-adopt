/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyFieldApi } from '@tanstack/react-form';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { ACTIONS_CONDTIONS_BOUNDARY_MARKER_LABELS } from '@/enum/actions-conditions.enum';
import { PaginationParamsOptional } from '@/interface/pagination.interface';

import { DatePicker } from './date-picker';
import {
  DropdownBoundaryMarkerList,
  DropdownComunityGroupList,
  DropdownDataList,
  DropdownMasterTreeList,
  DropdownUserList,
} from './dropdown';
import InputSuggestion from './input-suggestion';
import { Checkbox } from './ui/checkbox';
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
  required?: boolean;
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
  | 'dropdown-boundary-marker'
  | 'checkbox-json-actions-conditions-bm'
  | 'date';

export function FieldForm<T>({ item, field }: { item: FieldItemType<T>; field: AnyFieldApi }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col">
      <Label htmlFor={field.name} className="mb-2">
        {item.label}
        {item.required ? <Label className="text-red-500">*</Label> : ''}
      </Label>
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
                  defaultParams={item.paginationParams}
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
                  defaultParams={item.paginationParams}
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
                  defaultParams={item.paginationParams}
                />
              )
            );

          case 'dropdown-boundary-marker':
            return (
              typeof field.state.value === 'string' && (
                <DropdownBoundaryMarkerList
                  label={item.label}
                  value={field.state.value}
                  setValue={(value) => field.handleChange(value)}
                  defaultParams={item.paginationParams}
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

          case 'checkbox-json-actions-conditions-bm':
            return (
              typeof field.state.value === 'object' && (
                <ul className="flex flex-col gap-2">
                  {Object.entries(field.state.value).map(([key, value]) => (
                    <li key={key} className="flex items-center gap-2">
                      <Checkbox
                        checked={Boolean(value)}
                        onCheckedChange={(checked) =>
                          field.handleChange({
                            ...field.state.value,
                            [key]: checked,
                          })
                        }
                        id={`${field.name}-${key}`}
                      />
                      <Label htmlFor={`${field.name}-${key}`}>
                        {ACTIONS_CONDTIONS_BOUNDARY_MARKER_LABELS[key]}
                      </Label>
                    </li>
                  ))}
                </ul>
              )
            );

          default:
            if (typeof field.state.value === 'string' && item.type === 'password') {
              return (
                <div className="relative">
                  <Input
                    disabled={item.disabled}
                    id={field.name}
                    name={field.name}
                    type={showPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? (
                      <Eye
                        className="h-5 w-5"
                        strokeWidth={1.5}
                        onClick={() => setShowPassword(true)}
                      />
                    ) : (
                      <EyeOff
                        className="h-5 w-5"
                        strokeWidth={1.5}
                        onClick={() => setShowPassword(false)}
                      />
                    )}
                  </button>
                </div>
              );
            }
            if (typeof field.state.value === 'string') {
              return (
                <Input
                  disabled={item.disabled}
                  id={field.name}
                  name={field.name}
                  type={item.type}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              );
            }
        }
      })()}
      <FieldInfo field={field as any} />
    </div>
  );
}
