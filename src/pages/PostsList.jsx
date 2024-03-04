import { useEffect, useMemo } from 'react';
import { useDeletePostMutation, useFetchPostsQuery } from '../utils/postsApi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../component/Spinner';

const PostsList = () => {
  // console.log('useFetchPostsQuery', useFetchPostsQuery);
  const { data: posts = [], isLoading, isError, error } = useFetchPostsQuery();
  const sortedPosts = useMemo(() => {
    let postSorted = posts.slice();
    // Sort post in descending chronological order
    postSorted?.sort((a, b) =>
      b.timestamp
        .toDate()
        .toLocaleString()
        .localeCompare(a.timestamp.toDate().toLocaleString())
    );
    return postSorted;
  }, [posts]);

  const [deletePost] = useDeletePostMutation();

  useEffect(() => {
    isError && toast.error(error);
  }, [isError]);

  if (isLoading) {
    return <Spinner />;
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
      {sortedPosts?.map((post) => (
        <div key={post.id}>
          <img src={post.imgURL} alt={post.title} />
          <h3>{post.title}</h3>
          <p>{postExcerpt(post.content, 80)}</p>
          <div>
            <span>Created at - &nbsp;</span>
            <small>{post?.timestamp.toDate().toLocaleString()}</small>
          </div>
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
