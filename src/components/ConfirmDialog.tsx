
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

interface ConfirmDialogProps {
  dialog: ReturnType<typeof useConfirmDialog>['dialog'];
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({ dialog, onConfirm, onCancel }: ConfirmDialogProps) => {
  return (
    <AlertDialog open={dialog.isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialog.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {dialog.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={dialog.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {dialog.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
