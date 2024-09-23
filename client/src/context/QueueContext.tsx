import { createContext, useCallback, useEffect, useState } from 'react';

interface QueueItem {
  position: number;
  partyName: string;
  partySize: number;
  isYours: boolean;
}

interface QueueContextProps {
  sessionId: string;
  name: string;
  partySize: number;
  queue: QueueItem[];
  isSubmitted: boolean;
  setSessionId: (sessionId: string) => void;
  setName: (name: string) => void;
  setPartySize: (size: number) => void;
  setIsSubmitted: (value: boolean) => void;
  setQueue: (queue: QueueItem[]) => void;
  clearSession: () => void;
}

const QueueContext = createContext<QueueContextProps | undefined>(undefined);
const SESSION_STORAGE_KEY = 'queueSession'; // Using session storage to persist data accross tab

const QueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionId, setSessionId] = useState<string>(() => {
    const sessionData = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_KEY) || '{}',
    );
    return sessionData.sessionId || '';
  });

  const [name, setName] = useState<string>(() => {
    const sessionData = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_KEY) || '{}',
    );
    return sessionData.name || '';
  });

  const [partySize, setPartySize] = useState<number>(() => {
    const sessionData = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_KEY) || '{}',
    );
    return sessionData.partySize || 0;
  });

  const [queue, setQueue] = useState<QueueItem[]>(() => {
    const sessionData = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_KEY) || '{}',
    );
    return sessionData.queue || [];
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    return (
      JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY) || '{}')
        .isSubmitted || false
    );
  });

  useEffect(() => {
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        sessionId,
        name,
        partySize,
        queue,
        isSubmitted,
      }),
    );
  }, [sessionId, name, partySize, queue, isSubmitted]);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setSessionId('');
    setName('');
    setPartySize(0);
    setQueue([]);
    setIsSubmitted(false);
  }, []);

  return (
    <QueueContext.Provider
      value={{
        sessionId,
        name,
        partySize,
        queue,
        isSubmitted,
        setSessionId,
        setName,
        setPartySize,
        setQueue,
        setIsSubmitted,
        clearSession,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export { QueueContext, QueueProvider };
