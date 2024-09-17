import { useState } from 'react';
import GlobalStyles from '@/styles/GlobalStyles';
import WaitlistForm from '@/components/WaitlistForm/WaitlistForm';
import SectionQueue from '@/components/Section/SectionQueue';
import { useQueueContext } from './hooks/useQueueContext';

function App() {
  const { isSubmitted } = useQueueContext();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);

  return (
    <>
      <GlobalStyles />
      {isFormOpen && !isSubmitted && (
        <WaitlistForm onClose={() => setIsFormOpen(false)} />
      )}
      <main>
        <SectionQueue />
      </main>
    </>
  );
}

export default App;
