import {
  Flex,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';

const Spinner = () => {
  return (
    <Flex align='center' justify='center' h='50vh'>
      <CircularProgress value={40} color='green.400'>
        <CircularProgressLabel>40%</CircularProgressLabel>
      </CircularProgress>
    </Flex>
  );
};

export default Spinner;
