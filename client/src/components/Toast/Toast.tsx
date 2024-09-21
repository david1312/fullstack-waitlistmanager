import { useEffect, useState } from 'react';
import { ToastContainer } from './Toast.styles';
import { ToastVariant } from '@/types/ui';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

const Toast = ({ message, variant = 'info', duration = 3000 }: ToastProps) => {
  const [visible, setVisible] = useState(true);
  const [isRendering, setIsRendering] = useState(true); // Keeps component in the DOM during fade-out

  useEffect(() => {
    // Reset visibility when message changes
    setVisible(true);

    const fadeOutTimer = setTimeout(() => setVisible(false), duration);

    // After fade-out, remove from DOM
    const removeToastTimer = setTimeout(
      () => setIsRendering(false),
      duration + 500,
    );

    // Cleanup the timer when the component unmounts or message changes
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeToastTimer);
    };
  }, [message, duration]);

  if (!isRendering) return null;

  return (
    <ToastContainer variant={variant} isVisible={visible}>
      {message}
    </ToastContainer>
  );
};

export default Toast;
