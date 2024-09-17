import { Global, css } from '@emotion/react';
import variables from './variable';
import { breakpoints } from '@/utils/config';

const GlobalStyles = () => (
  <Global
    styles={css`
      /* Mobile first approach */

      ${variables}
      scroll-behavior: smooth;
      body {
        margin: 0;
        font-family: var(--font-sans);
        color: var(--slate);
        background-color: var(--navy);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      main {
        padding: 0 30px;
        @media (min-width: ${breakpoints.tablet}px) {
          padding: 0 150px;
        }

        @media (min-width: ${breakpoints.desktop}px) {
          padding: 0 200px;
        }
      }

      h1 {
        font-size: var(--fz-heading-small);
        @media (min-width: ${breakpoints.mobile}px) {
          font-size: var(--fz-heading);
        }
      }

      h2 {
        font-size: var(--fz-xl);
        @media (min-width: ${breakpoints.mobile}px) {
          font-size: var(--fz-heading-small);
        }
      }
    `}
  />
);

export default GlobalStyles;
