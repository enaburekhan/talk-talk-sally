import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './postsSlice';

export const PostsList = () => {
  const posts = useSelector((state) => state.posts);
  const { loading } = posts;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const renderedPost =
    posts.posts &&
    posts.posts.map((post, index) => (
      <article key={index} className='card mt-2'>
        <h5 className='card-title'>{post.title}</h5>
        <div className='card-body'>
          <p>{post.content.substring(0, 100)}</p>
        </div>
      </article>
    ));

  return (
    <section>
      <h2 className='mt-2 mb-2'>Posts</h2>
      {loading && <p>Loading...</p>}
      {renderedPost}
    </section>
  );
};
