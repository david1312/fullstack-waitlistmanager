import Button from '../Button/Button';
import {
  ModalOverlay,
  ModalContainer,
  ModalContent,
} from './ModalSuccess.styles';
import eatingImg from '@/assets/gif/eating.gif';

interface ModalSuccessProps {
  onClose: () => void;
}

const ModalSuccess: React.FC<ModalSuccessProps> = ({ onClose }) => {
  return (
    <>
      <ModalOverlay />
      <ModalContainer>
        <ModalContent data-test="modal-success-checkin">
          <h3 data-test="text-success-checkin">
            You've successfully checked in! We appreciate your patience.
          </h3>
          <img src={eatingImg} data-test="gif-success" />
          <p>We hope you have a delightful dining experience!</p>

          <Button
            onClick={onClose}
            variant="primary"
            dataTestId="button-close-modal"
          >
            Close
          </Button>
        </ModalContent>
      </ModalContainer>
    </>
  );
};

export default ModalSuccess;
