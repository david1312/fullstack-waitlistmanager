import styled from '@emotion/styled';

export const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

export const LoaderCircle = styled.div`
  border: 8px solid var(--navy);
  border-top: 8px solid var(--green);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoaderText = styled.p`
  margin-top: 10px;
  font-family: var(--font-mono);
  color: var(--green);
  font-weight: bold;
`;
