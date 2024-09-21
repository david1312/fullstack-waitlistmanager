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
  MAX_LENGTH_NAME: 30,
  MAX_PARTY_SIZE: 10,
  FIRST_LATE_CHECKIN_NOTIF: 10, // seconds
  LATE_REQUEUE: 20, // seconds
  PARTY_AHEAD_NOTIF: 1,
};

interface NotificationMsg {
  ONE_AHEAD: string;
  YOUR_TURN: string;
  FIRST_LATE: string;
  REQUEUE: string;
  KICKED: string;
}

export const NOTIFICATION_MSG: Readonly<NotificationMsg> = {
  ONE_AHEAD: 'You’re almost up! Just one party ahead of you.',
  YOUR_TURN: 'It’s your turn! Please check in now to secure your spot.',
  FIRST_LATE:
    'Reminder: You haven’t checked in yet. Click the "Check-in" button within 10 seconds to keep your spot.',
  REQUEUE: 'Your check-in time expired. You’ve been re-added to the queue.',
  KICKED:
    'You missed your second chance to check in. You’ve been removed from the queue.',
};
