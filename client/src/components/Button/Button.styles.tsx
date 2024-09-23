import { ButtonVariant } from '@/types/ui';
import styled from '@emotion/styled';

interface ButtonProps {
  variant: ButtonVariant;
}

const buttonStyles = {
  primary: {
    color: 'var(--green)',
    borderColor: 'var(--green)',
    hoverColor: 'var(--green)',
  },
  secondary: {
    color: 'var(--blue)',
    borderColor: 'var(--blue)',
    hoverColor: 'var(--blue)',
  },
  danger: {
    color: 'var(--dark-red)',
    borderColor: 'var(--dark-red)',
    hoverColor: 'var(--dark-red)',
  },
};

export const Button = styled.button<ButtonProps>`
  margin-top: 12px;
  color: ${({ variant }) => buttonStyles[variant].color};
  background-color: transparent;
  border: 1px solid ${({ variant }) => buttonStyles[variant].borderColor};
  margin-top: 12px;
  border-radius: var(--border-radius);
  padding: 0.75rem 1rem;
  font-size: var(--fz-sm);
  font-weight: bold;
  font-family: var(--font-mono);
  line-height: 1;
  text-decoration: none;
  transition: var(--transition);
  width: 100%;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    outline: none;
    box-shadow: 3px 3px 0 0 ${({ variant }) => buttonStyles[variant].hoverColor};
    transform: translate(4px, -4px);
  }

  :disabled {
    color: var(--slate);
    border-color: var(--lightest-navy);
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
