import { ModalOverlay, ModalContainer, ModalContent } from './Modal.styles';

interface ModalProps {
  message: string;
  onClose: () => void;
}

const Modal = ({ message, onClose }: ModalProps) => {
  return (
    <>
      <ModalOverlay onClick={onClose} />
      <ModalContainer>
        <ModalContent>
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </ModalContent>
      </ModalContainer>
    </>
  );
};

export default Modal;
