import { useQueueContext } from '@/hooks/useQueueContext';
import {
  QueueContainer,
  QueueSection,
  QueueTable,
  StickyButtonContainer,
} from './SectionQueue.styles';
import Button from '@/components/Button/Button';
import Toast from '@/components/Toast/Toast';

const SectionQueue = () => {
  const { isSubmitted } = useQueueContext();
  return (
    <QueueSection>
      <Toast message="hello" />
      <QueueContainer>
        <h1>Welcome, test!</h1>
        <p>Thank you for joining the waitlist.</p>
        <h2>Guidance:</h2>
        <p>Please click "Check-in" to secure your seat.</p>
        <p>You'll be notified when:</p>
        <ul>
          <li>There’s only one party ahead of you.</li>
          <li>It's your turn to check in.</li>
          <li>Reminder after 10 seconds if not checked in.</li>
          <li>Re-added to the queue after 20 seconds (one-time only).</li>
        </ul>

        {/* {queue.length === 0 ? ( */}
        <p>Currently, no queue! Be the first to secure a table!</p>
        {/* ) : ( */}
        <QueueTable>
          <thead>
            <tr>
              <th>Position</th>
              <th>Party Name</th>
              <th>Party Size</th>
            </tr>
          </thead>
          <tbody>
            {/* {queue.map((party, index) => ( */}
            <tr style={{ backgroundColor: 'yellow' }}>
              <td>1</td>
              <td>bela</td>
              <td>2</td>
            </tr>
            <tr style={{ backgroundColor: 'yellow' }}>
              <td>1</td>
              <td>bela</td>
              <td>2</td>
            </tr>
            <tr style={{ backgroundColor: 'yellow' }}>
              <td>1</td>
              <td>bela</td>
              <td>2</td>
            </tr>
            <tr style={{ backgroundColor: 'yellow' }}>
              <td>1</td>
              <td>bela</td>
              <td>2</td>
            </tr>
            <tr style={{ backgroundColor: 'yellow' }}>
              <td>1</td>
              <td>bela</td>
              <td>2</td>
            </tr>
            {/* ))} */}
          </tbody>
        </QueueTable>
        {/* )} */}
      </QueueContainer>
      {isSubmitted && (
        <StickyButtonContainer>
          <Button
            variant="checkin"
            onClick={() => {
              console.log('bro');
            }}
          >
            Check-in
          </Button>
        </StickyButtonContainer>
      )}
    </QueueSection>
  );
};

export default SectionQueue;
