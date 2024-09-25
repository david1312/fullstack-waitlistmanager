import { useQueueContext } from '@/hooks/useQueueContext';
import {
  QueueContainer,
  QueueSection,
  QueueTable,
  ButtonContainer,
} from './QueueManagement.styles';
import Button from '@/components/Button/Button';
import Toast from '@/components/Toast/Toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import WaitlistForm from '@/components/Form/FormWaitlist';
import ModalSuccess from '@/components/Modal/ModalSuccess';
import ModalConfirm from '@/components/Modal/ModalConfirm';
import {
  DinerNotificationPayload,
  DinerUpdateQueueListPayload,
  QueueDiner,
} from '@/types/ws';
import {
  JoinWaitlistPayload,
  APIResponse,
  SessionIdPayload,
} from '@/types/api';
import useApi from '@/hooks/useApi';
import Loader from '@/components/Loader/Loader';
import { ToastVariant } from '@/types/ui';

import {
  API_CONFIG,
  ERROR_CODE,
  GUIDANCE_LIST,
  NOTIFICATION_MSG,
  WAITLIST_CONFIG,
} from '@/utils/config';
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
    JoinWaitlistPayload | SessionIdPayload
  >();
  const [queueDiner, setQueueDiner] = useState<QueueDiner[]>([]);
  const [animateFirstRow, setAnimateFirstRow] = useState<boolean>(false);
  const [showModalSuccess, setShowModalSuccess] = useState<boolean>(false);
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
  const [availableSeat, setAvailableSeat] = useState<number>(0);
  const [checkinTimer, setCheckinTimer] = useState<number>(
    WAITLIST_CONFIG.LATE_REQUEUE,
  );
  const reconnectAttempts = useRef(0);

  const [toastState, setToastState] = useState<ToastState>({
    message: '',
    variant: 'info',
    isShow: false,
    trigger: Date.now(),
  });

  const handleCloseSuccessModal = useCallback(() => {
    clearSession();
    setShowModalSuccess(false);
  }, [clearSession]);

  const handleConfirmLeaveModal = useCallback(async () => {
    await fetchData(
      API_CONFIG.ENDPOINTS.LEAVE.replace(':sessionId', sessionId),
      'DELETE',
    );
    setShowModalConfirm(false);
  }, [fetchData, sessionId]);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    // reset state if user already checkin but join queue again without refresh
    setDisabledCheckin(false);
    setCheckinTurn(false);
    setToastState({
      message: '',
      variant: 'info',
      isShow: false,
      trigger: Date.now(),
    });

    if (!socketRef.current) {
      socketRef.current = io(API_CONFIG.BASE_URL, {
        reconnectionAttempts: WAITLIST_CONFIG.WS_RECONNECT_MAX,
        reconnectionDelay: WAITLIST_CONFIG.WS_RECONNECT_DELAY,
        query: {
          sessionId: sessionId,
        },
      });
    }
    const socket = socketRef.current;

    socket.on('connect', () => {
      reconnectAttempts.current = 0;
      // After connect hit rest api to update queue data
      const payload: JoinWaitlistPayload = {
        name: name,
        partySize: partySize,
        sessionId: sessionId,
      };

      (async () => {
        await fetchData(API_CONFIG.ENDPOINTS.JOINWAITLIST, 'POST', payload);
      })();
    });

    socket.on('dinerUpdateQueueList', (data: DinerUpdateQueueListPayload) => {
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
    });

    socket.on('dinerYourTurn', () => {
      setDisabledCheckin(false);
      setCheckinTimer(WAITLIST_CONFIG.LATE_REQUEUE);
      setCheckinTurn(true);
    });

    socket.on('dinerCheckinExpired', () => {
      setDisabledCheckin(true);
      setCheckinTurn(false);
    });

    socket.on('dinerCheckinSuccess', () => {
      setShowModalSuccess(true);
      clearSession();
    });

    socket.on('dinerTimer', (timer: number) => {
      setCheckinTimer(timer);
    });

    socket.on('dinerNotification', (data: DinerNotificationPayload) => {
      // prevent notif checkin spam everytime new diner join waitlist
      setToastState((prev) => {
        const isYourTurnRepeated =
          (prev.message === NOTIFICATION_MSG.YOUR_TURN &&
            data.message === NOTIFICATION_MSG.YOUR_TURN) ||
          (prev.message === NOTIFICATION_MSG.ONE_AHEAD &&
            data.message === NOTIFICATION_MSG.ONE_AHEAD);

        return {
          ...prev,
          message: data.message,
          variant: data.isWarning ? 'warning' : 'info',
          isShow: !isYourTurnRepeated || prev.isShow,
          trigger: isYourTurnRepeated ? prev.trigger : Date.now(),
        };
      });

      if (data.isRemoved) {
        setShowModalConfirm(false);
        clearSession();
      }
    });

    socket.on('dinerLeaveSuccess', () => {
      socket.disconnect();
      clearSession();
    });

    socket.on('connect_error', () => {
      reconnectAttempts.current += 1;
      setToastState({
        variant: 'warning',
        message: `Failed to reconnect to the server. Reconnection attempt: ${reconnectAttempts.current}`,
        isShow: true,
        trigger: Date.now(),
      });
      if (reconnectAttempts.current >= WAITLIST_CONFIG.WS_RECONNECT_MAX) {
        reconnectAttempts.current = 0;
        clearSession();
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      clearSession();
    };
  }, [clearSession, fetchData, name, partySize, sessionId]);

  useEffect(() => {
    if (response) {
      setDisabledCheckin(false);
      if (!response.isSuccess) {
        setToastState({
          variant: 'warning',
          message: response?.error || 'something when wrong',
          isShow: true,
          trigger: Date.now(),
        });
        console.error('Error joining waitlist:', response?.error);
      }

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

      {showModalSuccess && <ModalSuccess onClose={handleCloseSuccessModal} />}
      {showModalConfirm && (
        <ModalConfirm
          onConfirm={handleConfirmLeaveModal}
          onCancel={() => setShowModalConfirm(false)}
          message="Are you sure you want to leave the waiting list? You’ll lose your spot and need to rejoin later if you change your mind."
        />
      )}
      <QueueSection>
        <QueueContainer>
          <h1 data-test="text-welcome">Welcome, {name}!</h1>
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
            variant="secondary"
            onClick={async () => {
              setDisabledCheckin(true);
              await fetchData(API_CONFIG.ENDPOINTS.CHECKIN, 'PUT', {
                sessionId: sessionId,
              });
            }}
            disabled={disabledCheckin || !checkinTurn}
            dataTestId="button-checkin"
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
              <Button
                variant="danger"
                onClick={() => setShowModalConfirm(true)}
                dataTestId="button-leave-waitlist"
              >
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
