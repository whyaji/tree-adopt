import { JSX } from 'react';

import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export function InfoDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmText = 'Okay',
  triggerButton,
  confirmVarriant,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  message?: string;
  confirmText?: string;
  triggerButton?: React.ReactNode;
  confirmVarriant?: 'default' | 'destructive' | 'link' | 'outline' | 'secondary' | 'ghost' | null;
  children?: JSX.Element | JSX.Element[] | string | string[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {message && <DialogDescription>{message}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={confirmVarriant ?? 'default'}>{confirmText}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
