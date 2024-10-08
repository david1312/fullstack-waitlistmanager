import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { QueueProvider } from '@/context/QueueContext.tsx';

createRoot(document.getElementById('root')!).render(
  <QueueProvider>
    <App />
  </QueueProvider>,
);
