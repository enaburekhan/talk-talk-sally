import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Flex,
  Box,
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
  Link,
  Button,
  useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useUserSignoutMutation } from '../utils/postsApi';
import { useUser } from './UserContext';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';
  const [userSignout] = useUserSignoutMutation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleSignout = async () => {
    try {
      localStorage.removeItem('user');
      await userSignout();
      setUser(null); // Clear user state
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Flex p={4} bg='blue.500' align='center' justify='space-between'>
      <Box>
        <Link
          as={RouterLink}
          to='/'
          fontSize='xl'
          fontWeight='bold'
          color='white'
        >
          TalkTalkSally
        </Link>
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
        <Link as={RouterLink} to='/posts' color='white'>
          Posts
        </Link>
        <Button onClick={toggleColorMode} aria-label='Toggle Dark Mode'>
          {isDarkMode ? <MoonIcon /> : <SunIcon />}
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Button>

        {user && (
          <>
            <Link as={RouterLink} to='/addPost' color='white'>
              AddPost
            </Link>
            <Link as={RouterLink} to='/' color='white' onClick={handleSignout}>
              SignOut
            </Link>
          </>
        )}
      </HStack>

      {/* Drawer for Mobile Navigation */}
      <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={2} align='start'>
                <Link
                  as={RouterLink}
                  to='/posts'
                  color='blue'
                  onClick={onClose}
                >
                  Posts
                </Link>
                <Button onClick={toggleColorMode} aria-label='Toggle Dark Mode'>
                  {isDarkMode ? <MoonIcon /> : <SunIcon />}
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </Button>
                {user && (
                  <>
                    <Link
                      as={RouterLink}
                      to='/addPost'
                      color='blue'
                      onClick={onClose}
                    >
                      AddPost
                    </Link>

                    <Link
                      as={RouterLink}
                      to='/'
                      color='blue'
                      onClick={() => {
                        handleSignout();
                        onClose();
                      }}
                    >
                      SignOut
                    </Link>
                  </>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  );
};

export default Navbar;
