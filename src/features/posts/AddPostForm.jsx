import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewPost } from './postsSlice';
import { nanoid } from '@reduxjs/toolkit';

export const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const dispatch = useDispatch();

  console.log('title', title);
  console.log('content', content);

  const handleTitleChanged = (e) => setTitle(e.target.value);
  const handleContentChanged = (e) => setContent(e.target.value);

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    if (title && content) {
      try {
        await dispatch(
          addNewPost({
            id: nanoid(),
            title,
            content,
          })
        );
        // optionally show success message
        console.log('Post added successfully!');
      } catch (error) {
        // handle error
        console.error('Error adding post: ', error);
      }
      setTitle('');
      setContent('');
    }
  };

  return (
    <section>
      <h1>Add a New Post</h1>
      <form onSubmit={handleSubmitButton}>
        <div className='mb-3'>
          <label for='title' className='form-label'>
            Title:
          </label>
          <input
            type='text'
            className='form-control'
            id='title'
            aria-describedby='postHelp'
            name='title'
            value={title}
            onChange={handleTitleChanged}
          />
        </div>
        <div className='mb-3'>
          <label for='content' className='form-label'>
            Content:
          </label>
          <textarea
            className='form-control'
            id='content'
            name='content'
            value={content}
            onChange={handleContentChanged}
          />
          <div id='postHelp' className='form-text'>
            What's on your mind buddy!
          </div>
        </div>
        <button type='submit' className='btn btn-primary'>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
