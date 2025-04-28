import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function ConfirmationDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onConfirm,
  disabled = false,
  triggerButton,
  confirmVarriant,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  disabled?: boolean;
  triggerButton?: React.ReactNode;
  confirmVarriant?: 'default' | 'destructive' | 'link' | 'outline' | 'secondary' | 'ghost' | null;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            disabled={disabled}
            onClick={onConfirm}
            className={
              confirmVarriant === 'destructive'
                ? 'bg-destructive hover:bg-destructive/90 text-white'
                : confirmVarriant === 'link'
                  ? 'bg-link hover:bg-link/90 text-link-foreground'
                  : confirmVarriant === 'outline'
                    ? 'bg-outline hover:bg-outline/90 text-outline-foreground'
                    : confirmVarriant === 'secondary'
                      ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                      : confirmVarriant === 'ghost'
                        ? 'bg-ghost hover:bg-ghost/90 text-ghost-foreground'
                        : ''
            }>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
