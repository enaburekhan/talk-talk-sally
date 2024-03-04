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
    <>
      <img src={post?.imgURL} alt={post?.title} />
      <h2>{post?.title}</h2>
      <div>
        <span>Created at - &nbsp;</span>
        <small>{post?.timestamp.toDate().toLocaleString()}</small>
      </div>
      <p>{post?.content}</p>
    </>
  );
};

export default PostDetail;
