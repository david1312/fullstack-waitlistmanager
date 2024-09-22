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

const QueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionId, setSessionId] = useState<string>(() => {
    const sessionData = JSON.parse(
      sessionStorage.getItem('queueSession') || '{}',
    );
    return sessionData.sessionId || '';
  });

  const [name, setName] = useState<string>(() => {
    const sessionData = JSON.parse(
      sessionStorage.getItem('queueSession') || '{}',
    );
    return sessionData.name || '';
  });

  const [partySize, setPartySize] = useState<number>(() => {
    const sessionData = JSON.parse(
      sessionStorage.getItem('queueSession') || '{}',
    );
    return sessionData.partySize || 0;
  });

  const [queue, setQueue] = useState<QueueItem[]>(() => {
    const sessionData = JSON.parse(
      sessionStorage.getItem('queueSession') || '{}',
    );
    return sessionData.queue || [];
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    return (
      JSON.parse(sessionStorage.getItem('queueSession') || '{}').isSubmitted ||
      false
    );
  });

  // Save all data to session storage whenever any value changes
  useEffect(() => {
    sessionStorage.setItem(
      'queueSession',
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
    sessionStorage.removeItem('queueSession');
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
