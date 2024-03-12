import React, { useState, useEffect } from 'react';
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
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from '@chakra-ui/react';

const initialState = {
  title: '',
  content: '',
  author: '',
};

const AddEditPosts = () => {
  const [data, setData] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [addPosts] = useAddPostsMutation();
  const { id } = useParams();
  const { data: post } = useFetchPostQuery(id ? id : skipToken);
  const [updatePost] = useUpdatePostMutation();
  const navigate = useNavigate();

  const { title, content, author } = data;

  useEffect(() => {
    if (id && post) {
      setData({ ...post });
    }
  }, [id, post]);

  useEffect(() => {
    const uploadFile = () => {
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
              setData((prev) => ({ ...prev, imgURL: downloadURL }));
            })
            .catch((error) => {
              // Handle error gracefully
              console.error('Error getting download URL: ', error);
              toast.error('Error Uploading image');
            });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && content && author) {
      if (!id) {
        const result = await addPosts(data);

        if (result && result.error) {
          // Handle error appropriately (e.g. show a toast, display an error message)
          console.error('Error add post:', result.error);
        }
        // Clear the form or perform any other necessary actions upon successful submission
        setData(initialState);
        setFile(null);
        toast.success('Post Added Successfully');
        navigate('/');
      } else {
        await updatePost({ id, data });
        toast.success('Post Updated Successfully');
        navigate('/');
      }
    }
  };

  return (
    <Box maxW='600px' mx='auto' mt='6'>
      <Heading>{id ? 'Update a Post' : 'Add a New Post'}</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb='4'>
          <FormLabel htmlFor='postTitle'>Title:</FormLabel>
          <Input
            type='string'
            id='title'
            name='title'
            value={title}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mb='4'>
          <FormLabel htmlFor='postContent'>Content:</FormLabel>
          <Textarea
            type='text'
            id='content'
            name='content'
            value={content}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mb='4'>
          <FormLabel htmlFor='postAuthor'>Author:</FormLabel>
          <Input
            type='string'
            id='author'
            name='author'
            value={author}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mb='4'>
          <FormLabel htmlFor='file'>Upload Image:</FormLabel>
          <Input type='file' onChange={(e) => setFile(e.target.files[0])} />
        </FormControl>
        <Button
          type='submit'
          colorScheme='teal'
          disabled={progress !== null && progress < 100}
        >
          {id ? 'Update Post' : 'Add Post'}
        </Button>
      </form>
    </Box>
  );
};

export default AddEditPosts;
