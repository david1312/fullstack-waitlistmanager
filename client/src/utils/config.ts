interface Endpoints {
  JOINWAITLIST: string;
  CHECKIN: string;
  LEAVE: string;
}

interface AppConfig {
  BASE_URL: string;
  TIMEOUT: number;
  ENDPOINTS: Endpoints;
}

export const API_CONFIG: Readonly<AppConfig> = {
  BASE_URL: import.meta.env.API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: parseInt(import.meta.env.API_TIMEOUT || '5000', 10), // 5 seconds default
  ENDPOINTS: {
    JOINWAITLIST: '/api/join-waitlist',
    CHECKIN: '/api/checkin',
    LEAVE: '/api/leave/:sessionId',
  },
};

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
  PARTY_SIZE: 'Please enter a valid party size between 1 and 10.',
};

export const WAITLIST_CONFIG = {
  MAX_LENGTH_NAME: 30,
  MAX_PARTY_SIZE: 10,
  FIRST_LATE_CHECKIN_NOTIF: 10, // seconds
  LATE_REQUEUE: 20, // seconds
  PARTY_AHEAD_NOTIF: 1,
  WS_RECONNECT_DELAY: 5000, // 5 sec
  WS_RECONNECT_MAX: 3,
};

interface NotificationMsg {
  ONE_AHEAD: string;
  YOUR_TURN: string;
  FIRST_LATE: string;
  REQUEUE: string;
  KICKED: string;
}

export const NOTIFICATION_MSG: Readonly<NotificationMsg> = {
  ONE_AHEAD: 'You are almost up! Just one party ahead of you.',
  YOUR_TURN: 'Its your turn! Please check in now to secure your spot.',
  FIRST_LATE:
    "Reminder: You havent checked in yet. Click the 'Check-in' button within 10 seconds to keep your spot.",
  REQUEUE: 'Your check-in time expired. You ve been re-added to the queue.',
  KICKED:
    'You missed your second chance to check in. You ve been removed from the queue.',
};

export const GUIDANCE_LIST: string[] = [
  `You can check in once your party's turn in the queue arrives. The 'Check-in' button will appear.`,
  `You have 20 seconds to check in. If you miss it, you'll be requeued once, and removed if it happens again.`,
  `You'll be notified when one party is ahead and when it's your turn to check in.`,
];

interface ErrCode {
  UNAUTHORIZED: string;
  INTERNAL_SERVER_ERROR: string;
}

export const ERROR_CODE: Readonly<ErrCode> = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};
