import { Heading, Text, Box } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box textAlign='center' mt={20}>
      <Heading as='h1' size='xl' mb={4}>
        404 - Page Not Found
      </Heading>
      <Text fontSize='lg' color='gray.600'>
        Oops! The page you are looking for does not exist.
      </Text>
      <Text fontSize='lg' color='gray.600'>
        Return to{' '}
        <RouterLink to='/' color='blue.500'>
          homepage
        </RouterLink>
      </Text>
    </Box>
  );
};

export default NotFound;
