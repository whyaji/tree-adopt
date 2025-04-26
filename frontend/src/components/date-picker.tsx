'use client';

import { CalendarIcon } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { dateTimeFormat, toDbDate } from '@/lib/utils/dateTimeFormat';

export function DatePicker(props: {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !props.value && 'text-muted-foreground'
            )}>
            <CalendarIcon />
            {props.value ? (
              dateTimeFormat(props.value, { dateOnly: true })
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={moment(props.value).toDate()}
            onSelect={(day) => {
              if (day) {
                props.onChange?.(toDbDate(moment(day).toString()));
              }
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
