interface Breakpoints {
  mobile: number;
  tablet: number;
  laptop: number;
  desktop: number;
}

export const breakpoints: Readonly<Breakpoints> = {
  mobile: 481,
  tablet: 769,
  laptop: 1025,
  desktop: 1201,
};
