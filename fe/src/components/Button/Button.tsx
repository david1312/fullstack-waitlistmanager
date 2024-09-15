import React from 'react';
import { Button as StyledButton } from './Button.styles';

interface ButtonProps {
  variant: 'join' | 'leave' | 'checkin';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick }) => {
  return (
    <StyledButton variant={variant} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;
