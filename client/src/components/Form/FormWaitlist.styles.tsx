import { breakpoints } from '@/utils/config';
import styled from '@emotion/styled';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  backdrop-filter: blur(8px); /* Apply blur effect */
  z-index: 1000;
`;

export const FormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--light-navy);
  padding: 10px 20px;
  border-radius: var(--border-radius);
  z-index: 1001;
  min-width: 260px;
  @media (min-width: ${breakpoints.mobile}px) {
    min-width: 360px;
    padding: 20px 40px;
  }

  @media (min-width: ${breakpoints.tablet}px) {
    min-width: 480px;
  }

  h2 {
    text-align: center;
  }
  label {
    display: block;
    margin-bottom: 10px;
  }

  fieldset {
    border: 2px solid var(--green);
    padding: 20px;
    border-radius: var(--border-radius);
    min-width: 260px;
  }
  legend {
    color: var(--green);
  }

  input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 15px;
    box-sizing: border-box;
    font-size: var(--fz-md);

    &:hover,
    &:focus {
      border-color: var(--green); /* Green border on hover and focus */
      outline-color: var(--green); /* Remove default outline */
    }
  }
`;

export const ErrorMessage = styled.p`
  color: var(--red);
  font-size: 0.9rem;
  margin-top: -10px;
  margin-bottom: 15px;
  height: 30px;
`;
