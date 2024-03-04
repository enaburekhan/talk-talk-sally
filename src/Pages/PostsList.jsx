import { useEffect } from 'react';
import { useDeletePostMutation, useFetchPostsQuery } from '../utils/postsApi';
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

  const postExcerpt = (str, count) => {
    if (str.length > count) {
      str = str.substring(0, count) + ' ...';
    }
    return str;
  };

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
            <p>{postExcerpt(post.content, 80)}</p>
            <Link to={`/detail/${post.id}`}>Read More</Link>
            <button type='button' onClick={() => handleDelete(post.id)}>
              Delete Post
            </button>
            <Link to={`/update/${post.id}`}>Update Post</Link>
          </div>
        ))}
    </div>
  );
};

export default PostsList;
