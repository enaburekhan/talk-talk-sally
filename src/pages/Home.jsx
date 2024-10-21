import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  useUserSigninMutation,
  useUserSignupMutation,
} from '../utils/postsApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../component/UserContext';
import {
  Box,
  useBreakpointValue,
  Text,
  Button,
  Stack,
  Flex,
  FormControl,
  Input,
  useColorModeValue
} from '@chakra-ui/react';

const Home = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [userSignupMutation] = useUserSignupMutation();
  const [userSigninMutation] = useUserSigninMutation();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const userSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .required('No password provided.')
      .min(8, 'Password is too short - should be 8 chars minimum.'),
  });

  const handleFormSubmit = async (values, setSubmitting) => {
    try {
      let response;
      if (isSignup) {
        response = await userSignupMutation(values);
      } else {
        response = await userSigninMutation(values);
      }
      if (response.error) {
        console.error('Error', response.error);
        toast.error(response.error.message);
      } else {
        const { data } = response;
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        toast.success(
          isSignup ? 'Signed Up Successfully' : 'Signed In Successfully'
        );
        navigate('/addpost');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const textSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const headingSize = useBreakpointValue({ base: 'lg', md: 'xl' });

  // Define dynamic text colors
  const headingColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'whiteAlpha.800');

  return (
    <Flex align='center' 
    justify='center' 
    direction='column' 
    minH='100vh'
    p={6}
    >
      <Text 
       fontSize={headingSize}
       fontWeight='bold'
       textAlign='center'
       color= {headingColor}  // use dynamic color
       mb={8} 
       >
          Welcome to TalkTalkSally: Share Your Thoughts with the World
      </Text>
      <Text
        fontSize='lg'
        textAlign='center'
        color= {subTextColor} // use dynamic color
        maxW='600px'
        mb={10}
      >
        TalkTalkSally is a platform where like-minded individuals can come together to discuss, share ideas, and express their views
        on various topics. Join our community today and start sharing your Thoughts with the world.
      </Text>
      <Box
        bg='white'
        w={{ base: '90%', md: '400px' }}
        p='6'
        borderRadius='lg'
        boxShadow='xl'
      >
        
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={userSchema}
          onSubmit={async (values, { setSubmitting }) => {
            handleFormSubmit(values, setSubmitting);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Stack spacing={4}>
                <FormControl>
                  <Field
                    as={Input}
                    name='email'
                    type='email'
                    placeholder='Email Address'
                    p={4}
                    borderColor='gray.300'
                    color='#333'
                    _placeholder={{ color: useColorModeValue('gray.500', 'gray.400') }} // dynamic placeholder color
                  />

                  {errors.email && touched.email && (
                    <Text color='red.500' fontSize='sm' mt={1}>
                      {errors.email}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <Field
                    name='password'
                    type='password'
                    placeholder='Password'
                    p={4}
                    as={Input}
                    borderColor='gray.300'
                    color='#333'
                    _placeholder={{ color: useColorModeValue('gray.500', 'gray.400') }} // dynamic placeholder color
                  />
                  {errors.password && touched.password && (
                    <Text color='red.500' fontSize='sm' mt={1}>
                      {errors.password}
                    </Text>
                  )}
                </FormControl>
              </Stack>

              <Stack spacing={4} mt={6}>
                <Button
                  type='submit'
                  colorScheme='blue'
                  size={buttonSize}
                  isLoading={isSubmitting}
                >
                  {isSignup ? 'Signup' : 'Signin'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  colorScheme='blue'
                  size={buttonSize}
                  onClick={() => setIsSignup(!isSignup)}
                >
                  <Text fontSize={textSize}>
                  {isSignup
                    ? 'Already have an account? Signin'
                    : "Don't have an account? Signup"}
                  </Text>
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};

export default Home;
