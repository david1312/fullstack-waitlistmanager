import { useQueueContext } from '@/hooks/useQueueContext';
import {
  QueueContainer,
  QueueSection,
  QueueTable,
  ButtonContainer,
} from './QueueManagement.styles';
import Button from '@/components/Button/Button';
import Toast from '@/components/Toast/Toast';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import WaitlistForm from '@/components/Form/FormWaitlist';
import {
  DinerNotificationPayload,
  DinerUpdateQueueListPayload,
  QueueDiner,
} from '@/types/ws';
import { JoinWaitlistPayload, APIResponse, CheckinPayload } from '@/types/api';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader/Loader';
import { ToastVariant } from '@/types/ui';
import Modal from '@/components/Modal/ModalSuccess';
import { API_CONFIG, ERROR_CODE, GUIDANCE_LIST } from '@/utils/config';
interface ToastState {
  variant: ToastVariant;
  message: string;
  isShow: boolean;
  trigger: number;
}

const QueueManagement = () => {
  const { isSubmitted, clearSession, sessionId, name, partySize } =
    useQueueContext();
  const [disabledCheckin, setDisabledCheckin] = useState<boolean>(true); // for button click disabled
  const [checkinTurn, setCheckinTurn] = useState<boolean>(false);

  const { loading, response, fetchData } = useApi<
    APIResponse,
    JoinWaitlistPayload | CheckinPayload
  >();

  const [queueDiner, setQueueDiner] = useState<QueueDiner[]>([]);
  const [animateFirstRow, setAnimateFirstRow] = useState<boolean>(false);
  const [showModalSuccess, setShowModalSuccess] = useState<boolean>(false);
  const [availableSeat, setAvailableSeat] = useState<number>(0);
  const [checkinTimer, setCheckinTimer] = useState<number>(0);

  const [toastState, setToastState] = useState<ToastState>({
    message: '',
    variant: 'info',
    isShow: false,
    trigger: Date.now(),
  });

  const handleCloseSuccessModal = () => {
    clearSession();
    setShowModalSuccess(false);
  };
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    if (!socketRef.current) {
      socketRef.current = io(API_CONFIG.BASE_URL, {
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        query: {
          sessionId: sessionId,
        },
      });
    }
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('connected');
      // after connect hit rest api to update queue data
      const payload: JoinWaitlistPayload = {
        name: name,
        partySize: partySize,
        sessionId: sessionId,
      };

      (async () => {
        await fetchData('/api/join-waitlist', 'POST', payload);
      })();
    });

    socket.on('dinerUpdateQueueList', (data: DinerUpdateQueueListPayload) => {
      console.log(`something happening: `, data);
      setAvailableSeat(data.availableSeats);

      if (data.isFirstRowRemoved) {
        // Trigger animation for the first row
        setAnimateFirstRow(true);
        // Wait for animation to finish before updating the queue
        setTimeout(() => {
          setQueueDiner(data.queueDiners);
          setAnimateFirstRow(false);
        }, 1000); // Animation duration
      } else {
        setQueueDiner(data.queueDiners);
      }

      console.log(data);
    });

    socket.on('dinerYourTurn', () => {
      setDisabledCheckin(false);
      setCheckinTurn(true);
      socket.emit('dinnerCheckinAvailable');
    });

    socket.on('dinerCheckinExpired', () => {
      setDisabledCheckin(true);
      setCheckinTurn(false);
    });

    socket.on('dinerCheckinSuccess', (serviceTime: number) => {
      setShowModalSuccess(true);
      socket.emit('dinerStartService', serviceTime);
      console.log(serviceTime);
    });

    socket.on('dinerTimer', (timer: number) => {
      console.log('dinertimer', timer);
      setCheckinTimer(timer);
    });

    socket.on('dinerNotification', (data: DinerNotificationPayload) => {
      console.log('diner notif', data);
      if (data.isRemoved) {
        setToastState({
          message: data.message,
          variant: 'warning',
          isShow: true,
          trigger: Date.now(),
        });
        clearSession();
      } else {
        setToastState({
          message: data.message,
          variant: 'info',
          isShow: true,
          trigger: Date.now(),
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    setDisabledCheckin(false);
    if (response && !response.isSuccess) {
      setToastState({
        variant: 'warning',
        message: response?.error || 'something when wrong',
        isShow: true,
        trigger: Date.now(),
      });
      console.error('Error joining waitlist:', response?.error);
      if (response.errorCode === ERROR_CODE.UNAUTHORIZED) {
        clearSession();
      }
    }
  }, [clearSession, response]);

  // handler toast state
  useEffect(() => {
    if (toastState.isShow) {
      const timeoutId = setTimeout(() => {
        setToastState((prev) => ({
          ...prev,
          isShow: false,
        }));
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [toastState.isShow, toastState.trigger]);

  return (
    <>
      {toastState.isShow && (
        <Toast message={toastState.message} variant={toastState.variant} />
      )}
      {loading && <Loader />}
      {!isSubmitted && <WaitlistForm />}

      {showModalSuccess && <Modal onClose={handleCloseSuccessModal} />}
      <QueueSection>
        <QueueContainer>
          <h1>Welcome, {name}!</h1>
          <p>Thank you for joining the waitlist.</p>
          <h2>Guidance:</h2>
          <p>Please click "Check-in" to secure your seat.</p>
          <p>You'll be notified when:</p>
          <ul>
            {GUIDANCE_LIST.map((val, index) => (
              <li key={index}>{val}</li>
            ))}
          </ul>

          {checkinTurn && (
            <>
              <span className="span-title">
                It's your turn now! Click the button below to check in.
              </span>
              <span>Time left to check in: {checkinTimer} seconds</span>
            </>
          )}
          <Button
            variant="checkin"
            onClick={async () => {
              setDisabledCheckin(true);
              const payload: CheckinPayload = {
                sessionId: sessionId,
              };

              await fetchData('/api/checkin', 'PUT', payload);
            }}
            disabled={disabledCheckin}
          >
            {checkinTurn ? 'Check-in' : 'Waiting Queue...'}
          </Button>
          <h3>Available Seats: {availableSeat}</h3>
          <QueueTable>
            <thead>
              <tr>
                <th>Position</th>
                <th>Party Name</th>
                <th>Party Size</th>
              </tr>
            </thead>

            <tbody>
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
