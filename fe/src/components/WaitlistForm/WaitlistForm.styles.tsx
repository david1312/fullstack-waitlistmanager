import styled from '@emotion/styled';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--dark-navy);
  z-index: 1000;
`;

export const FormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--light-navy);
  padding: 20px 40px;
  border-radius: var(--border-radius);
  z-index: 1001;
  min-width: 480px;

  h2 {
    text-align: center;
  }
  label {
    display: block;
    margin-bottom: 10px;
  }

  fieldset {
    border: 2px solid var(--green); /* Add green border to fieldset */
    padding: 20px;
    border-radius: var(--border-radius);
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
  }
`;

export const Button = styled.button`
  margin-top: 12px;
  color: var(--green);
  background-color: transparent;
  border: 1px solid var(--green);
  border-radius: var(--border-radius);
  padding: 0.75rem 1rem;
  font-size: var(--fz-sm);
  font-family: var(--font-mono);
  line-height: 1;
  text-decoration: none;
  transition: var(--transition);
  width: 100%;

  &:hover,
  &:focus-visible {
    outline: none;
    box-shadow: 3px 3px 0 0 var(--green);
    transform: translate(4px, -4px);
  }
`;

export const ErrorMessage = styled.p`
  color: var(--red);
  font-size: 0.9rem;
  margin-top: -10px;
  margin-bottom: 15px;
`;
