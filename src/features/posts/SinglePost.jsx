import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPosts } from './postsSlice';

const SinglePost = () => {
  const dispatch = useDispatch();
  const { postId } = useParams();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const post = useSelector((state) =>
    state.posts.posts.find((post) => post.id === postId)
  );

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <article className='card mt-2'>
        <h5 className='card-title'>{post.title}</h5>
        <div className='card-body'>
          <p>{post.content}</p>
        </div>
      </article>
    </section>
  );
};

export default SinglePost;
