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
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react';
import { Editor } from '@tinymce/tinymce-react';

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
  const editorRef = useRef(null);

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

  const handleEditorChange = (content) => {
    setData((prevData) => ({ ...prevData, content }));
  };

  function validateForm() {
    if (!title.trim() || !content.trim() || !author.trim()) {
      toast.error('Please fill in all fields');
      return false;
    } else if (!/^[a-zA-Z\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/.test(title)) {
      toast.error(
        'Only letters, spaces, and special characters are allowed in title'
      );
      return false;
    } else if (!/^[a-zA-Z]+$/.test(author)) {
      toast.error('Only letters are allowed in author');
      return false;
    }

    return true;
  }

  const clearForm = () => {
    setData(initialState);
    setFile(null);
  };

  const addNewPost = async () => {
    try {
      const result = await addPosts(data);

      if (result.error) {
        console.error('Error adding post:', result.error);
        return;
      }

      clearForm();
      toast.success('Post Added Successfully');
      navigate('/');
    } catch (error) {
      console.error('Error Adding post:', error);
    }
  };

  const updateExistingPost = async () => {
    try {
      await updatePost({ id, data });
      toast.success('Post Updated Successfully');
      navigate('/');
    } catch (error) {
      console.error('Error Updating Post:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!id) {
      await addNewPost();
    } else {
      await updateExistingPost();
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
          <Editor
            apiKey='qzdns6jmf0qi7om95ppnxngk06o19tuuzdx3zdde6ub7v7cb'
            value={content}
            init={{
              height: 500,
              menubar: false,
              plugins:
                'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help',
              content_style:
                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
            onInit={(evt, editor) => (editorRef.current = editor)}
            onEditorChange={handleEditorChange}
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
