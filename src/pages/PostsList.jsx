import { useEffect, useMemo } from 'react';
import { useDeletePostMutation, useFetchPostsQuery } from '../utils/postsApi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../component/Spinner';
import ReactionButtons from '../component/ReactionButtons';
import { useState } from 'react';

const PostsList = () => {
  const [searchField, setSearchField] = useState('');
  const { data: posts = [], isLoading, isError, error } = useFetchPostsQuery();
  const sortedPosts = useMemo(() => {
    let postSorted = posts.slice();
    // Sort post in descending chronological order
    postSorted?.sort((a, b) =>
      a.timestamp
        .toDate()
        .toLocaleString()
        .localeCompare(b.timestamp.toDate().toLocaleString())
    );
    return postSorted;
  }, [posts]);

  // Filter post based on the search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      return (
        (post.title &&
          post.title.toLowerCase().includes(searchField.toLowerCase())) ||
        (post.author &&
          post.author.toLowerCase().includes(searchField.toLowerCase()))
      );
    });
  }, [posts, searchField]);

  const [deletePost] = useDeletePostMutation();

  useEffect(() => {
    isError && toast.error(error);
  }, [isError]);

  if (isLoading) {
    return <Spinner />;
  }

  const postExcerpt = (str, count) => {
    if (str && str.length > count) {
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
      <section>
        <input
          type='search'
          placeholder='Search Post by title or author'
          onChange={(e) => setSearchField(e.target.value)}
        />
      </section>
      <section>
        {filteredPosts.length > 0
          ? filteredPosts?.map((post) => (
              <div key={post.id}>
                <img src={post.imgURL} alt={post.title} />
                <h3>{post.title}</h3>
                <p>{post.author}</p>
                <p>{postExcerpt(post.content, 80)}</p>
                <div>
                  <span>Created at - &nbsp;</span>
                  <small>{post?.timestamp.toDate().toLocaleString()}</small>
                </div>
                <div>{<ReactionButtons post={post} />}</div>
                <Link to={`/detail/${post.id}`}>View Post</Link>
                <button type='button' onClick={() => handleDelete(post.id)}>
                  Delete Post
                </button>
                <Link to={`/update/${post.id}`}>Update Post</Link>
              </div>
            ))
          : // If no seacch results, display all posts
            sortedPosts?.map((post) => (
              <div key={post.id}>
                <img src={post.imgURL} alt={post.title} />
                <h3>{post.title}</h3>
                <p>{post.author}</p>
                <p>{postExcerpt(post.content, 80)}</p>
                <div>
                  <span>Created at - &nbsp;</span>
                  <small>{post?.timestamp.toDate().toLocaleString()}</small>
                </div>
                <div>{<ReactionButtons post={post} />}</div>
                <Link to={`/detail/${post.id}`}>View Post</Link>
                <button type='button' onClick={() => handleDelete(post.id)}>
                  Delete Post
                </button>
                <Link to={`/update/${post.id}`}>Update Post</Link>
              </div>
            ))}
      </section>
    </div>
  );
};

export default PostsList;
