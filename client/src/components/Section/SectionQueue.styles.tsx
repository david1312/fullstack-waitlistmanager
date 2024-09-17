// import { breakpoints } from '@/utils/config';
import styled from '@emotion/styled';

export const QueueSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: calc(100vh - 60px);
  padding: 50px 0;
`;

export const QueueContainer = styled.div`
  width: 100%;
  padding: 20px;
  background-color: var(--light-navy);
  color: var(--white);
  border-radius: var(--border-radius);
  height: calc(100vh - 150px);
  overflow-y: auto;

  h1 {
    line-height: 0.5;
  }

  p,
  h2 {
    line-height: 1;
  }

  ul {
    list-style-type: disc;
    padding-left: 20px;
    margin-bottom: 20px;
  }
`;

export const QueueTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    border: 1px solid var(--slate);
    padding: 10px;
    text-align: left;
  }

  th {
    background-color: var(--navy);
    color: var(--white);
  }

  tr:nth-of-type(odd) {
    background-color: var(--dark-navy);
  }

  tr:nth-of-type(even) {
    background-color: var(--light-navy);
  }

  td {
    background-color: var(--lightest-navy);
  }
`;

export const StickyButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: var(--navy);
  z-index: 1000;

  button {
    width: 100%;
    max-width: 400px;
  }
`;
