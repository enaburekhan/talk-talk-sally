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

const Home = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [userSignupMutation] = useUserSignupMutation();
  const [userSigninMutation] = useUserSigninMutation();
  const navigate = useNavigate();

  const userSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .required('No password provided.')
      .min(8, 'Password is too short - should be 8 chars minimum.'),
  });
  return (
    <div>
      <h2>Signup or Login to Create Posts</h2>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={userSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (isSignup) {
              const result = await userSignupMutation(values);
              if (result.error) {
                console.error('Error Signing Up:', result.error);
                toast.error(result.error.message);
              } else {
                toast.success('Signed Up Successfully');
                navigate('/addpost');
              }
            } else {
              const result = await userSigninMutation(values);
              if (result.error) {
                console.error('Error Signing In:', result.error);
                toast.error(result.error.message);
              } else {
                toast.success('Signed In Successfully');
                navigate('/addpost');
              }
            }
          } catch (error) {
            console.error('Error:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field name='email' type='email' placeholder='Email Address' />
            {errors.email && touched.email ? <div>{errors.email}</div> : null}
            <Field name='password' placeholder='Password' />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}
            <button type='submit' disabled={isSubmitting}>
              {isSignup ? 'Signup' : 'Signin'}
            </button>
            <button type='button' onClick={() => setIsSignup(!isSignup)}>
              {isSignup
                ? 'Already have an account? Signin'
                : "Don't have an account? Signup"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Home;
