import { css, keyframes } from '@emotion/react';

// Define the keyframes for different animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Create a map of animations
const animationsMap = {
  up: fadeInUp,
  down: fadeInDown,
  left: fadeInLeft,
  right: fadeInRight,
};

// Create a function to apply the animation with a delay
export const fadeAnimation = (
  direction: 'up' | 'down' | 'left' | 'right',
  delay = 0,
) => css`
  opacity: 0;
  animation: ${animationsMap[direction]} 0.5s ease forwards;
  animation-delay: ${delay}s;
`;
