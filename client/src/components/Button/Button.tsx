import React from 'react';
import { Button as StyledButton } from './Button.styles';
import { ButtonVariant } from '@/types/ui';

interface ButtonProps {
  variant: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
}: ButtonProps) => {
  return (
    <StyledButton variant={variant} onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
};

export default React.memo(Button);
