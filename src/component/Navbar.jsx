import React from 'react';
import {
  Flex,
  Box,
  Text,
  Link,
  HStack,
  VStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex p={4} bg='blue.500' align='center' justify='space-between'>
      <Box>
        <Text fontSize='xl' fontWeight='bold' color='white'>
          TalkTalkSally
        </Text>
      </Box>

      {/* Display Hamburger Menu on Small Screens */}
      <Box display={{ base: 'block', md: 'none' }}>
        <IconButton
          icon={<HamburgerIcon />}
          size='md'
          variant='ghost'
          color='white'
          onClick={onOpen}
        />
      </Box>

      {/* Display Navigation Links on Desktop */}
      <HStack
        spacing={{ base: 2, md: 4 }}
        display={{ base: 'none', md: 'flex' }}
      >
        <Link href='/' color='white'>
          Posts
        </Link>
        <Link href='/addPost' color='white'>
          AddPost
        </Link>
      </HStack>

      {/* Drawer for Mobile Navigation */}
      <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={2} align='start'>
                <Link href='/' color='black' onClick={onClose}>
                  Posts
                </Link>
                <Link href='/addPost' color='black' onClick={onClose}>
                  AddPost
                </Link>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  );
};

export default Navbar;
