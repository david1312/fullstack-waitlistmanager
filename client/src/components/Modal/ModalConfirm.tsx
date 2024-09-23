import React from 'react';
import {
  ModalContainer,
  ModalContent,
  ButtonContainer,
} from './ModalConfirm.styles';
import Button from '../Button/Button';

interface ModalConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
  message?: string; // Optional message to display in the modal
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  onConfirm,
  onCancel,
  message = 'Are you sure you want to proceed?', // Default message
}) => {
  return (
    <ModalContainer>
      <ModalContent>
        <p>{message}</p>
        <ButtonContainer>
          <Button onClick={onCancel} variant="danger">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="primary">
            Confirm
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalContainer>
  );
};

export default React.memo(ModalConfirm);
