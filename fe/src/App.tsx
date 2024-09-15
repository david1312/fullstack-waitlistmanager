import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import GlobalStyles from '@/styles/GlobalStyles';
import WaitlistForm from '@/components/WaitlistForm/WaitlistForm';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(true); // Form should appear on page load

  return (
    <>
      <GlobalStyles />
      {isFormOpen ? (
        <WaitlistForm onClose={() => setIsFormOpen(false)} />
      ) : (
        <>
          <main>
            <div>
              <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Waitlist Manager</h1>
            <div className="card">
              <p>
                Edit <code>src/App.tsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>
          </main>
        </>
      )}
    </>
  );
}

export default App;
