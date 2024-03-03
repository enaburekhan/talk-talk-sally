import { useEffect } from 'react';
import {
  useDeletePostMutation,
  useFetchPostsQuery,
} from '../../services/postsApi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostsList = () => {
  // console.log('useFetchPostsQuery', useFetchPostsQuery);
  const { data, isLoading, isError, error } = useFetchPostsQuery();
  console.log('data', data);
  const [deletePost] = useDeletePostMutation();

  useEffect(() => {
    isError && toast.error(error);
  }, [isError]);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  // if (isError) {
  //   return <div>Error fetching data: {error.message}</div>;
  // }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      await deletePost(id);
      toast.success('Post deleted successfully');
    }
  };
  return (
    <div>
      {data &&
        data.map((post) => (
          <div key={post.id}>
            <img src={post.imgURL} alt={post.title} />
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button type='button' onClick={() => handleDelete(post.id)}>
              Delete Post
            </button>
            <Link to={`/update/${post.id}`}></Link>
          </div>
        ))}
    </div>
  );
};

export default PostsList;
