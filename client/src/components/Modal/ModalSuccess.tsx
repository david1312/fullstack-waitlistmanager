import { Button } from '../Button/Button.styles';
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
        <ModalContent>
          <h3>You've successfully checked in! We appreciate your patience.</h3>
          <img src={eatingImg} />
          <p>We hope you have a delightful dining experience!</p>

          <Button onClick={onClose} variant="primary">
            Close
          </Button>
        </ModalContent>
      </ModalContainer>
    </>
  );
};

export default ModalSuccess;
