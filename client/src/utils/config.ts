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

interface ErrorValidation {
  NAME: string;
  PARTY_SIZE: string;
}

export const ERROR_VALIDATION: Readonly<ErrorValidation> = {
  NAME: 'Please enter a name.',
  PARTY_SIZE: 'Please enter a valid party size of at least 1.',
};

export const WAITLIST_CONFIG = {
  MAX_LENGTH_NAME: 100,
  MAX_PARTY_SIZE: 10,
  FIRST_LATE_CHECKIN_NOTIF: 10, // seconds
  LATE_REQUEUE: 20, // seconds
  PARTY_AHEAD_NOTIF: 1,
};
