import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

const Spinner = () => {
  return (
    <CircularProgress value={40} color='green.400'>
      <CircularProgressLabel>40%</CircularProgressLabel>
    </CircularProgress>
  );
};

export default Spinner;
