import React from 'react';
import { ToastContainer } from './Toast.styles';
import { ToastVariant } from '@/types/ui';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
}

const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
}: ToastProps) => {
  return (
    <>
      <ToastContainer variant={variant} data-test="toast">
        {message}
      </ToastContainer>
    </>
  );
};

export default React.memo(Toast);
