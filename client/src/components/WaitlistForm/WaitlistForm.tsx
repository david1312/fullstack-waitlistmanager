import { FormContainer, Overlay, ErrorMessage } from './WaitlistForm.styles';
import Button from '@/components/Button/Button';
import { ERROR_VALIDATION, WAITLIST_CONFIG } from '@/utils/config';
import { useState } from 'react';
import { useQueueContext } from '@/hooks/useQueueContext';

interface WaitlistFormProps {
  onClose: () => void;
}

const WaitlistForm = ({ onClose }: WaitlistFormProps) => {
  const { name, partySize, setName, setPartySize, setIsSubmitted } =
    useQueueContext();
  const [nameError, setNameError] = useState<string | null>(null);
  const [partySizeError, setPartySizeError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!name.trim()) {
      setNameError(ERROR_VALIDATION.NAME);
      valid = false;
    } else {
      setNameError(null);
    }

    if (!partySize || partySize < 1) {
      setPartySizeError(ERROR_VALIDATION.PARTY_SIZE);
      valid = false;
    } else {
      setPartySizeError(null);
    }
    if (!valid) return;
    setIsSubmitted(true);
    onClose(); // Close form after submission
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
            />
            <ErrorMessage>{nameError}</ErrorMessage>

            <label htmlFor="partySize">Party Size:</label>
            <input
              id="partySize"
              type="number"
              value={partySize || ''}
              onChange={handlePartySizeChange}
              min={1}
              max={WAITLIST_CONFIG.MAX_PARTY_SIZE}
            />
            <ErrorMessage>{partySizeError}</ErrorMessage>
            <Button variant="join">Join Waitlist</Button>
          </fieldset>
        </form>
      </FormContainer>
    </>
  );
};

export default WaitlistForm;
