import { QueueContext } from '@/context/QueueContext';
import { useContext } from 'react';

export const useQueueContext = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error('useQueue must be used within a QueueProvider');
  return context;
};
