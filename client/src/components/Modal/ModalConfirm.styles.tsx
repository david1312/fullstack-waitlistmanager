import { breakpoints } from '@/utils/config';
import styled from '@emotion/styled';

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6); /* Semi-transparent background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ModalContent = styled.div`
  background-color: var(--light-navy);
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;

  p {
    font-weight: bold;
  }

  @media (min-width: ${breakpoints.mobile}px) {
    width: 360px;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    width: 480px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 20px;
`;

export const ConfirmButton = styled.button`
  background-color: var(--green);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  width: 40%;

  &:hover {
    background-color: var(--dark-green);
  }
`;

export const CancelButton = styled.button`
  background-color: var(--red);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  width: 40%;

  &:hover {
    background-color: var(--dark-red);
  }
`;
