import { LoaderCircle, LoaderContainer, LoaderText } from './Loader.styles';
interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = 'Loading...' }) => {
  return (
    <LoaderContainer>
      <LoaderCircle />
      <LoaderText>{text}</LoaderText>
    </LoaderContainer>
  );
};

export default Loader;
