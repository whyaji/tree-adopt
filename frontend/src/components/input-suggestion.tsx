'use client';

import { ComponentProps, FC, useMemo, useRef } from 'react';

import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const InputSuggestion: FC<
  ComponentProps<typeof Input> & {
    suggestions?: string[];
    value?: string;
  }
> = ({ suggestions = [], ...props }) => {
  const newRef: React.Ref<HTMLInputElement> = useRef(null);
  const ref = props.ref ?? newRef;

  const isFocused = ref && 'current' in ref ? ref.current === document.activeElement : false;

  const filteredSuggestions = useMemo(() => {
    const filteredSuggestion = suggestions.filter(
      (suggestion) =>
        (props.value && suggestion.toLowerCase().includes(String(props.value).toLowerCase())) ||
        (props.value === '' && isFocused)
    );
    if (props.value && filteredSuggestion.length === 1 && filteredSuggestion[0] === props.value) {
      return [];
    }
    return filteredSuggestion;
  }, [props.value, suggestions]);
  const onSelectSuggestion = (suggestion: string) => {
    props.onChange?.({
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="relative">
      <Input ref={ref} {...props} />
      {filteredSuggestions.length > 0 && (
        <div className="absolute left-0 z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <ScrollArea className="max-h-[200px]">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => onSelectSuggestion(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default InputSuggestion;
