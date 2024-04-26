// import { Text } from '@chakra-ui/react';

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
  Heading,
  useBreakpointValue,
  Text,
  Button,
  Stack,
  Flex,
  FormControl,
  Input,
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
  const headingSize = useBreakpointValue({ base: 'lg', md: 'xl' });
  return (
    <Flex align='center' justify='center' mt='20px'>
      <Box
        bg='#3333'
        w={{ base: '90%', md: '450px' }}
        p='20px'
        borderRadius='md'
      >
        <Heading as='h1' size={headingSize} mb={4}>
          Signup to Create Posts
        </Heading>
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
              <Stack spacing={4} mb='40px'>
                <FormControl>
                  <Field
                    as={Input}
                    name='email'
                    type='email'
                    placeholder='Email Address'
                    mb='10px'
                    p='20px'
                  />

                  {errors.email && touched.email && (
                    <Text color='red'>{errors.email}</Text>
                  )}
                </FormControl>
                <FormControl>
                  <Field
                    name='password'
                    type='password'
                    placeholder='Password'
                    p='20px'
                    as={Input}
                  />
                  {errors.password && touched.password && (
                    <Text color='red'>{errors.password}</Text>
                  )}
                </FormControl>
              </Stack>
              <Stack>
                <Button
                  type='submit'
                  colorScheme='blue'
                  size={buttonSize}
                  mb={4}
                  isLoading={isSubmitting}
                >
                  {isSignup ? 'Signup' : 'Signin'}
                </Button>
                <Button
                  type='button'
                  colorScheme='gray'
                  size={buttonSize}
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup
                    ? 'Already have an account? Signin'
                    : "Don't have an account? Signup"}
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
