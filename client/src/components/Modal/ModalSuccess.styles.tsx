import { breakpoints } from '@/utils/config';
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
  background-color: var(--light-navy);
  padding: 10px 20px;
  border-radius: var(--border-radius);
  z-index: 1001;
  min-width: 260px;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items horizontally */
  text-align: center; /* Align text in the center */

  span {
    display: block;
    margin-bottom: 10px; /* Adds space between text and image */
  }

  img {
    width: 100px;
    height: auto;
    margin-bottom: 10px; /* Adds space below the image */
    @media (min-width: ${breakpoints.tablet}px) {
      width: 140px;
    }
    @media (min-width: ${breakpoints.desktop}px) {
      width: 180px;
    }
  }
`;
