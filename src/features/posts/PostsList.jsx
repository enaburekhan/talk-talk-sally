import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './postsSlice';

export const PostsList = () => {
  const posts = useSelector((state) => state.posts);
  const { loading } = posts;
  console.log('posts', posts.posts);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const renderedPost =
    posts.posts &&
    posts.posts.map((post, index) => (
      <article key={index}>
        <h3>{post.title}</h3>
        <p>{post.content.substring(0, 100)}</p>
      </article>
    ));

  return (
    <section>
      <h2>Posts</h2>
      {loading && <p>Loading...</p>}
      {renderedPost}
    </section>
  );
};
