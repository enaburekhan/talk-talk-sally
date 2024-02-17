import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './postsSlice';
import { Link } from 'react-router-dom';

const PostsList = () => {
  const posts = useSelector((state) => state.posts);
  const postStatus = useSelector((state) => state.posts.status);
  // const { loading } = posts;

  const dispatch = useDispatch();

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  const renderedPost =
    posts.posts &&
    posts.posts.map((post, index) => (
      <article key={index} className='card mt-2'>
        <h5 className='card-title'>{post.title}</h5>
        <div className='card-body'>
          <p>{post.content.substring(0, 100)}</p>
          <Link to={`/posts/${post.id}`} className='card-link'>
            View Post
          </Link>
        </div>
      </article>
    ));

  return (
    <section>
      <h2 className='mt-2 mb-2'>Posts</h2>
      {/* {loading && <p>Loading...</p>} */}
      {renderedPost}
    </section>
  );
};

export default PostsList;
