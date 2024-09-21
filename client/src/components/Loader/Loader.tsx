import { LoaderCircle, LoaderContainer, LoaderText } from './Loader.styles';

const Loader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <LoaderContainer>
      <LoaderCircle />
      <LoaderText>{text}</LoaderText>
    </LoaderContainer>
  );
};

export default Loader;
