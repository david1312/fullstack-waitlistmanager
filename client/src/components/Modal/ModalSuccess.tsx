import { Button } from '../Button/Button.styles';
import {
  ModalOverlay,
  ModalContainer,
  ModalContent,
} from './ModalSuccess.styles';
import eatingImg from '@/assets/gif/eating.gif';

interface ModalProps {
  onClose: () => void;
}

const Modal = ({ onClose }: ModalProps) => {
  return (
    <>
      <ModalOverlay />
      <ModalContainer>
        <ModalContent>
          <h3>You've successfully checked in! We appreciate your patience.</h3>
          <img src={eatingImg} />
          <p>We hope you have a delightful dining experience!</p>

          <Button onClick={onClose} variant="checkin">
            Close
          </Button>
        </ModalContent>
      </ModalContainer>
    </>
  );
};

export default Modal;
