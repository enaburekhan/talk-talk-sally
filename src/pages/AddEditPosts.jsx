import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useAddPostsMutation,
  useFetchPostQuery,
  useUpdatePostMutation,
} from '../utils/postsApi';
import { useNavigate, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import TinyMCEForm from '../component/TinyMceForm';

const AddEditPosts = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [addPosts] = useAddPostsMutation();
  const { id } = useParams();
  const { data: post } = useFetchPostQuery(id ? id : skipToken);
  const [updatePost] = useUpdatePostMutation();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    title: '',
    content: '',
    author: '',
    file: null,
  });

  useEffect(() => {
    if (id && post) {
      // Update form values when the component mount
      setFormValues({
        title: post.title || '',
        content: post.content || '',
        author: post.author || '',
        file: null,
      });
    }
  }, [id, post]);

  const SignupSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    content: Yup.string().required('Required'),
    author: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
  });

  const addNewPost = async (values) => {
    try {
      const result = await addPosts(values);

      if (result.error) {
        console.error('Error adding post:', result.error);
        return;
      }
      toast.success('Post Added Successfully');
      navigate('/posts');
    } catch (error) {
      console.error('Error Adding post:', error);
    }
  };

  const updateExistingPost = async (values) => {
    try {
      await updatePost({ id, data: values });
      toast.success('Post Updated Successfully');
      navigate('/posts');
    } catch (error) {
      console.error('Error Updating Post:', error);
    }
  };

  const handleSubmit = async (values) => {
    if (file) {
      // File upload logic
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setProgress(progress);
          switch (snapshot.state) {
            case 'paused':
              console.log('upload is paused');
              break;
            case 'running':
              console.log('upload is running');
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              toast.info('Image uploaded successfully');
              values.imgURL = downloadURL;
              if (!id) {
                addNewPost(values);
              } else {
                updateExistingPost(values);
              }
            })
            .catch((error) => {
              console.error('Error getting download URL: ', error);
              toast.error('Error Uploading image');
            });
        }
      );
    } else {
      if (!id) {
        addNewPost(values);
      } else {
        updateExistingPost(values);
      }
    }
  };

  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  return (
    <Box maxW='600px' mx='auto' mt='6'>
      <Heading>{id ? 'Update a Post' : 'Add a New Post'}</Heading>
      <Stack spacing={4} mb='40px'>
        <Formik
          initialValues={formValues}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ errors, touched }) => (
            <Form>
              <FormControl>
                <Field
                  name='title'
                  placeholder='Enter Title Here'
                  as={Input}
                  mb='10px'
                  p='20px'
                />
                {errors.title && touched.title ? (
                  <Alert status='error'>{errors.title}</Alert>
                ) : null}
              </FormControl>

              <TinyMCEForm name='content' />
              {errors.content && touched.content ? (
                <Alert status='error'>{errors.content}</Alert>
              ) : null}
              <FormControl mb='10px'>
                <Field
                  name='author'
                  type='string'
                  placeholder='Enter Author Here'
                  as={Input}
                />
                {errors.author && touched.author ? (
                  <Alert status='error'>{errors.author}</Alert>
                ) : null}
              </FormControl>
              <FormControl mb='10px'>
                <input
                  type='file'
                  onChange={(e) => setFile(e.target.files[0])}
                  p='20px'
                />
              </FormControl>

              <Button type='submit' colorScheme='blue' size={buttonSize}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Stack>
    </Box>
  );
};

export default AddEditPosts;
