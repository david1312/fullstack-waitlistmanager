import styled from '@emotion/styled';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--white);
  padding: 20px;
  border-radius: var(--border-radius);
  z-index: 1001;
`;

export const ModalContent = styled.div`
  p {
    margin-bottom: 20px;
  }

  button {
    padding: 10px 20px;
    background-color: var(--red);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
  }
`;
