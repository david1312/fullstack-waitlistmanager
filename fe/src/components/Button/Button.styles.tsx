import styled from '@emotion/styled';

interface ButtonProps {
  variant: 'join' | 'leave' | 'checkin';
}

const buttonStyles = {
  join: {
    color: 'var(--green)',
    backgroundColor: 'transparent',
    borderColor: 'var(--green)',
    hoverColor: 'var(--green)',
  },
  leave: {
    color: 'white',
    backgroundColor: 'var(--red)',
    borderColor: 'var(--red)',
    hoverColor: 'var(--red)',
  },
  checkin: {
    color: 'var(--blue)',
    backgroundColor: 'transparent',
    borderColor: 'var(--blue)',
    hoverColor: 'var(--blue)',
  },
};

export const Button = styled.button<ButtonProps>`
  margin-top: 12px;
  color: ${({ variant }) => buttonStyles[variant].color};
  background-color: ${({ variant }) => buttonStyles[variant].backgroundColor};
  border: 1px solid ${({ variant }) => buttonStyles[variant].borderColor};
  margin-top: 12px;
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
