import { useState } from 'react';

export const AddPostForm = () => {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  const handleTitleChanged = (e) => setTitle(e.target.value);
  const handleContentChanged = (e) => setContent(e.target.value);

  return (
    <section>
      <h1>Add a New Post</h1>
      <form>
        <div className='mb-3'>
          <label for='postTitle' className='form-label'>
            Title:
          </label>
          <input
            type='text'
            className='form-control'
            id='postTitle'
            aria-describedby='postHelp'
            name='postTitle'
            value={title}
            onChange={handleTitleChanged}
          />
        </div>
        <div className='mb-3'>
          <label for='postContent' className='form-label'>
            Content:
          </label>
          <textarea
            className='form-control'
            id='postContent'
            name='postContent'
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
