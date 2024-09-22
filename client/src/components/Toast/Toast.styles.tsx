import { ToastVariant } from '@/types/ui';
import styled from '@emotion/styled';

const toastStyle = {
  info: {
    color: 'var(--green)',
    backgroundColor: ' var(--light-navy)',
  },
  warning: {
    color: 'var(--white)',
    backgroundColor: 'var(--red)',
  },
};
interface ToastContainerProps {
  variant: ToastVariant;
}

export const ToastContainer = styled.div<ToastContainerProps>`
  position: absolute; /* Keeps it positioned within the parent container */
  left: 50%;
  transform: translateX(-50%); /* Centers the toast horizontally */
  background-color: ${({ variant }) => toastStyle[variant].backgroundColor};
  font-size: var(--fz-sm);
  font-weight: bold;
  color: ${({ variant }) => toastStyle[variant].color};
  padding: 10px 20px;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  text-align: center; /* Optionally center the text */
  min-width: 260px;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, 0);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 15px);
    }
  }
`;
