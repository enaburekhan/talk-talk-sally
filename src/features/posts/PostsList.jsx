import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './postsSlice';

export const PostsList = () => {
  const posts = useSelector((state) => state.posts);
  console.log('posts', posts);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return <div>home</div>;
};
