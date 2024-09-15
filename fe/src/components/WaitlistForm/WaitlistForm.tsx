import { useState } from 'react';
import { FormContainer, Overlay, ErrorMessage } from './WaitlistForm.styles';
import { Button } from '../Button/Button.styles';

interface WaitlistFormProps {
  onClose: () => void;
}

const WaitlistForm = ({ onClose }: WaitlistFormProps) => {
  const [name, setName] = useState('');
  const [partySize, setPartySize] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [partySizeError, setPartySizeError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (!name.trim()) {
      setNameError('Please enter a name.');
      valid = false;
    } else {
      setNameError(null);
    }

    if (!partySize || parseInt(partySize) < 1) {
      setPartySizeError('Please enter a valid party size of at least 1.');
      valid = false;
    } else {
      setPartySizeError(null);
    }

    if (!valid) return;

    console.log({ name, partySize });
    onClose(); // Close form after submission
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
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <ErrorMessage>{nameError}</ErrorMessage>}

            <label htmlFor="partySize">Party Size:</label>
            <input
              id="partySize"
              type="number"
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              min={1}
            />
            {partySizeError && <ErrorMessage>{partySizeError}</ErrorMessage>}

            <Button
              type="submit"
              variant="join"
              onClick={() => {
                console.log('hello');
              }}
            >
              Join Waitlist
            </Button>
          </fieldset>
        </form>
      </FormContainer>
    </>
  );
};

export default WaitlistForm;
