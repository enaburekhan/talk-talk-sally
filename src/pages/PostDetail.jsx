import { useParams } from 'react-router-dom';
import { useFetchPostQuery } from '../utils/postsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';

const PostDetail = () => {
  const { id } = useParams();
  const { data: post, error, isError } = useFetchPostQuery(id ? id : skipToken);

  useEffect(() => {
    isError && toast.error(error);
  }, [isError]);
  return (
    <div key={post?.id}>
      <img src={post?.imgURL} alt={post?.title} />
      <h3>{post?.title}</h3>
      <p>{post?.author}</p>
      <p>{post?.content}</p>
      <div>
        <span>Created at - &nbsp;</span>
        <small>{post?.timestamp.toDate().toLocaleString()}</small>
      </div>
    </div>
  );
};

export default PostDetail;
