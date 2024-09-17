import { createContext, useEffect, useState } from 'react';

interface QueueItem {
  position: number;
  partyName: string;
  partySize: number;
  isYours: boolean;
}

interface QueueContextProps {
  name: string;
  partySize: number;
  queue: QueueItem[];
  isSubmitted: boolean;
  setName: (name: string) => void;
  setPartySize: (size: number) => void;
  setIsSubmitted: (value: boolean) => void;
  setQueue: (queue: QueueItem[]) => void;
  clearSession: () => void;
}

const QueueContext = createContext<QueueContextProps | undefined>(undefined);

const QueueProvider = ({ children }: { children: React.ReactNode }) => {
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
      JSON.stringify({ name, partySize, queue, isSubmitted }),
    );
  }, [name, partySize, queue, isSubmitted]);

  const clearSession = () => {
    sessionStorage.removeItem('queueSession');
    setName('');
    setPartySize(0);
    setQueue([]);
    setIsSubmitted(false);
  };

  return (
    <QueueContext.Provider
      value={{
        name,
        partySize,
        queue,
        isSubmitted,
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
