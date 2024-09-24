import React from 'react';
import { Button as StyledButton } from './Button.styles';
import { ButtonVariant } from '@/types/ui';

interface ButtonProps {
  variant: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  dataTestId?: string; // For testing purposes
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  dataTestId = 'button-default',
}: ButtonProps) => {
  return (
    <StyledButton
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      data-test={dataTestId}
    >
      {children}
    </StyledButton>
  );
};

export default React.memo(Button);
