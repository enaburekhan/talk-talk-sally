import React from 'react';
import { Link as ChakraLink, Button } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

const CustomButtonLink = ({ to, children, ...rest }) => {
  return (
    <Button as={ReactRouterLink} to={to} {...rest}>
      {children}
    </Button>
  );
};

export default CustomButtonLink;
