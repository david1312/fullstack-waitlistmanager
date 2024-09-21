import { useQueueContext } from '@/hooks/useQueueContext';
import {
  QueueContainer,
  QueueSection,
  QueueTable,
  ButtonContainer,
} from './QueueManagement.styles';
import Button from '@/components/Button/Button';
import Toast from '@/components/Toast/Toast';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import WaitlistForm from '@/components/Form/FormWaitlist';
import {
  DinerJoinWaitlistPayload,
  DinerNotificationPayload,
  QueueDiner,
} from '@/types/ws';
import { JoinWaitlistPayload, APIResponse } from '@/types/api';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader/Loader';
import { ToastVariant } from '@/types/ui';
import Modal from '@/components/Modal/Modal';

const QueueManagement = () => {
  const { isSubmitted, clearSession, sessionId, name, partySize } =
    useQueueContext();
  const [disabledCheckin, setDisabledCheckin] = useState<boolean>(true);
  const { loading, response, fetchData } = useApi<
    APIResponse,
    JoinWaitlistPayload
  >();
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [toastVariant, setToastVariant] = useState<ToastVariant>('info');
  const [queueDiner, setQueueDiner] = useState<QueueDiner[]>([]);
  const [animateFirstRow, setAnimateFirstRow] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMsg, setModalMsg] = useState<string>('');

  useEffect(() => {
    if (!sessionId) return;

    const socket = io('http://localhost:8080', {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      query: {
        sessionId: sessionId,
      },
    });

    socket.on('connect', () => {
      console.log('connected');
      const payload: JoinWaitlistPayload = {
        name: name,
        partySize: partySize,
        sessionId: sessionId,
      };

      (async () => {
        await fetchData('/api/join-waitlist', 'POST', payload);
      })();
    });

    socket.on('dinerJoinWaitlist', (data: DinerJoinWaitlistPayload) => {
      console.log(`something happening: ${data}`);
      setQueueDiner(data.queueDiners);
      console.log(data.queueDiners);
    });

    socket.on('dinerYourTurn', () => {
      setDisabledCheckin(false);
      socket.emit('dinerYourTurn');
    });

    socket.on('dinerCheckinExpired', () => {
      setDisabledCheckin(true);
    });

    socket.on('dinerUpdateQueueList', (data: QueueDiner[]) => {
      console.log({ data });
      // Trigger animation for the first row
      setAnimateFirstRow(true);

      // Wait for animation to finish before updating the queue
      setTimeout(() => {
        setQueueDiner(data);
        setAnimateFirstRow(false);
      }, 1000); // Animation duration
    });

    socket.on('dinerTimer', (data) => {
      console.log(data);
    });

    socket.on('dinerNotification', (data: DinerNotificationPayload) => {
      console.log('notif recieved', data);
      if (data.isRemoved) {
        setToastVariant('warning');
        clearSession();
      } else {
        setToastVariant('info');
        // setModalMsg(data.message);
        // setShowModal(true);
        // clearSession();
      }
      setNotificationMessage(data.message);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    if (response) {
      if (response.isSuccess) {
        console.log('API call successful, joined waitlist');
      } else {
        setToastVariant('warning');
        setNotificationMessage('Error joining waitlist');
        console.error('Error joining waitlist:', response.error);
      }
    }
  }, [response]);

  return (
    <>
      {notificationMessage && (
        <Toast message={notificationMessage} variant={toastVariant} />
      )}
      {loading && <Loader />}
      {!isSubmitted && <WaitlistForm />}

      {showModal && (
        <Modal message={modalMsg} onClose={() => setShowModal(false)} />
      )}
      <QueueSection>
        <QueueContainer>
          <h1>Welcome, {name}!</h1>
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

          <p>Currently, no queue! Secure your table now!</p>
          <Button
            variant="checkin"
            onClick={clearSession}
            disabled={disabledCheckin}
          >
            Check-in
            {disabledCheckin ? ' (waiting queue)' : ' available!'}
          </Button>
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
              {queueDiner.length > 0 &&
                queueDiner.map((val, index) => {
                  const myRow = val.session_id === sessionId;
                  const isMyRow = myRow ? 'is-my-row' : '';
                  const animateRow =
                    animateFirstRow && index === 0 ? 'animate-row' : '';
                  return (
                    <tr className={`${isMyRow} ${animateRow}`} key={index}>
                      <td>{index + 1}</td>
                      <td>{myRow ? `${val.name} (yours)` : val.name}</td>
                      <td>{val.party_size}</td>
                    </tr>
                  );
                })}
            </tbody>
          </QueueTable>
        </QueueContainer>
        {isSubmitted && (
          <>
            <ButtonContainer>
              <Button variant="leave" onClick={clearSession}>
                Leave WaitList
              </Button>
            </ButtonContainer>
          </>
        )}
      </QueueSection>
    </>
  );
};

export default QueueManagement;
