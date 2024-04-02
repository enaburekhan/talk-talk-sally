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
  FormControl,
  Heading,
  useBreakpointValue,
  Text,
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
  return (
    <Box p={20}>
      <Heading as='h6' mb={4}>
        Signup or Signin to Create Posts
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
            <FormControl mb={4}>
              <Field name='email' type='email' placeholder='Email Address' />
              {errors.email && touched.email ? (
                <Text color='red'>{errors.email}</Text>
              ) : null}
            </FormControl>
            <FormControl mb={4}>
              <Field name='password' placeholder='Password' />
              {errors.password && touched.password ? (
                <Text>{errors.password}</Text>
              ) : null}
            </FormControl>

            <button
              type='submit'
              colorScheme='blue'
              size={buttonSize}
              mb={4}
              isLoading={isSubmitting}
            >
              {isSignup ? 'Signup' : 'Signin'}
            </button>
            <button
              type='button'
              colorScheme='blue'
              size={buttonSize}
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup
                ? 'Already have an account? Signin'
                : "Don't have an account? Signup"}
            </button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Home;
