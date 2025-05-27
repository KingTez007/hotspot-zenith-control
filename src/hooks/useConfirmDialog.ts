
import { useState } from 'react';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  variant: 'default' | 'destructive';
}

export const useConfirmDialog = () => {
  const [dialog, setDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    variant: 'default'
  });

  const showConfirmDialog = (options: Partial<ConfirmDialogState> & { onConfirm: () => void }) => {
    setDialog({
      isOpen: true,
      title: options.title || 'Confirm Action',
      message: options.message || 'Are you sure you want to proceed?',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      variant: options.variant || 'default',
      onConfirm: options.onConfirm
    });
  };

  const hideConfirmDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    dialog.onConfirm();
    hideConfirmDialog();
  };

  return {
    dialog,
    showConfirmDialog,
    hideConfirmDialog,
    handleConfirm
  };
};
