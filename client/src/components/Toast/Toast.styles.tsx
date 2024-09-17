import { fadeAnimation } from '@/styles/animation';
import styled from '@emotion/styled';

export const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--pink);
  font-size: var(--fz-sm);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  ${() => fadeAnimation('down')};
`;
