import { useEffect, useState } from 'react';
import { ToastContainer } from './Toast.styles';

interface ToastProps {
  message: string;
  duration?: number;
}

const Toast = ({ message, duration = 3000 }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return <ToastContainer>{message}</ToastContainer>;
};

export default Toast;
