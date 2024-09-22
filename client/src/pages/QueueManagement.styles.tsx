import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { breakpoints } from '@/utils/config';

const heartbeat = keyframes`
  0%, 100% {
    background-color: var(--lightest-navy);
  }
  50% {
    background-color: var(--green); /* Use your preferred color */
  }
`;

const slideRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

export const QueueSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: calc(100vh - 60px);
  padding: 30px 0;

  @media (min-width: ${breakpoints.mobile}px) {
    padding: 50px 0;
  }
`;

export const HiddenAudioButton = styled.button`
  display: none;
`;

export const QueueContainer = styled.div`
  width: 100%;
  padding: 20px;
  background-color: var(--light-navy);
  color: var(--white);
  border-radius: var(--border-radius);
  height: calc(100vh - 150px);
  overflow-y: auto;

  h1,
  p,
  h2,
  h3 {
    line-height: 1;
  }

  ul {
    list-style-type: disc;
    padding-left: 20px;
    margin-bottom: 20px;
  }

  li {
    font-size: var(--fz-xs);
  }

  span {
    display: block;
    text-align: center;
  }

  .span-title {
    color: var(--blue);
    font-weight: bold;
  }

  @media (min-width: ${breakpoints.mobile}px) {
    li {
      font-size: var(--fz-sm);
    }
  }
`;

export const QueueTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: var(--fz-sm);

  th,
  td {
    border: 1px solid var(--slate);
    padding: 5px;
    text-align: left;
  }

  th {
    background-color: var(--dark-navy);
    color: var(--white);
  }

  tr:nth-of-type(odd) {
    background-color: var(--navy);
  }

  tr:nth-of-type(even) {
    background-color: var(--light-navy);
  }

  .is-my-row {
    color: var(--green);
    font-weight: bold;
  }

  .animate-row {
    animation:
      ${heartbeat} 1s ease-in-out infinite,
      ${slideRight} 1s ease-in-out forwards;
  }
`;

export const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 10px 30px;
  background-color: transparent;
  z-index: 1000;

  button {
    width: 100%;
    max-width: 400px;
  }
`;
