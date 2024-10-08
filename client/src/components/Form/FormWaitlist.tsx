import { FormContainer, Overlay, ErrorMessage } from './FormWaitlist.styles';
import Button from '@/components/Button/Button';
import { ERROR_VALIDATION, WAITLIST_CONFIG } from '@/utils/config';
import { useEffect, useRef, useState } from 'react';
import { useQueueContext } from '@/hooks/useQueueContext';
import { v4 as uuidv4 } from 'uuid';

const WaitlistForm: React.FC = () => {
  const {
    name,
    partySize,
    setName,
    setPartySize,
    setIsSubmitted,
    setSessionId,
  } = useQueueContext();
  const [nameError, setNameError] = useState<string | null>(null);
  const [partySizeError, setPartySizeError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!name.trim()) {
      setNameError(ERROR_VALIDATION.NAME);
      valid = false;
    } else {
      setNameError(null);
    }

    if (
      !partySize ||
      partySize < 1 ||
      partySize > WAITLIST_CONFIG.MAX_PARTY_SIZE
    ) {
      setPartySizeError(ERROR_VALIDATION.PARTY_SIZE);
      valid = false;
    } else {
      setPartySizeError(null);
    }
    if (!valid) return;
    setSessionId(uuidv4());
    setIsSubmitted(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setNameError(null);
    }
  };

  const handlePartySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartySize(parseInt(e.target.value));
    if (parseInt(e.target.value) >= 1) {
      setPartySizeError(null);
    }
  };

  useEffect(() => {
    // Focus the name input on component mount
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  return (
    <>
      <Overlay />
      <FormContainer>
        <h2>Secure Your Table at TableCheck</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Reservation Details</legend>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              maxLength={WAITLIST_CONFIG.MAX_LENGTH_NAME}
              ref={nameInputRef}
              data-test="input-name"
            />
            <ErrorMessage data-test="error-name">{nameError}</ErrorMessage>

            <label htmlFor="partySize">Party Size:</label>
            <input
              id="partySize"
              type="number"
              value={partySize || ''}
              onChange={handlePartySizeChange}
              data-test="input-size"
            />
            <ErrorMessage data-test="error-size">{partySizeError}</ErrorMessage>
            <Button variant="primary" dataTestId="button-join-waitlist">
              Join Waitlist
            </Button>
          </fieldset>
        </form>
      </FormContainer>
    </>
  );
};

export default WaitlistForm;
