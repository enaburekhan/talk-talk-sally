import { useParams } from 'react-router-dom';
import { useFetchCommentsQuery, useFetchPostQuery } from '../utils/postsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';
import { Flex, Text, Box, Heading, Avatar } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import CommentsForm from '../component/CommentsForm';

const PostDetail = () => {
  const { id } = useParams();
  const { data: post, error, isError } = useFetchPostQuery(id ? id : skipToken);
  console.log('post', post);

  const {
    data: comments,
    isLoading,
    isError: commentsError,
  } = useFetchCommentsQuery(id);
  console.log('comments', comments);
  const formattedComments = comments && comments.flat();

  useEffect(() => {
    isError && toast.error(error);
  }, [isError]);

  useEffect(() => {
    commentsError && toast.error(commentsError);
  }, [commentsError]);

  return (
    <Box maxW='600px' mx='auto' mt='6'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap' mb='8px'>
        {
          <Avatar
            src={post?.imgURL}
            name={post?.title}
            borderRadius='lg'
            rounded='full'
          />
        }
        <Box>
          <Text fontSize='14px' color='#333' fontWeight='800'>
            Written by {post?.author}
          </Text>
        </Box>
      </Flex>
      <Heading mb='5px'>{post?.title}</Heading>

      <div dangerouslySetInnerHTML={{ __html: post?.content }} />

      <Text color='blue.600' fontSize='12px' fontWeight='800'>
        Created on: {post?.timestamp.toDate().toLocaleString()}
      </Text>
      <CommentsForm post={post} />
      {isLoading && <Box>Loading Comments...</Box>}
      {formattedComments && formattedComments.length > 0 && (
        <Box mt={6}>
          <Heading size='md'>Comments</Heading>
          {formattedComments.map((comment) => (
            <Box key={comment.id} bg='gray.100' p={4} borderRadius='md' mt={2}>
              <Text>{comment.email}</Text>
              <Text mt={2}>{comment.comment}</Text>
            </Box>
          ))}
        </Box>
      )}
      {comments && comments.length === 0 && (
        <Box mt={6}>No Comments yet. be the first one to comment!</Box>
      )}
    </Box>
  );
};

export default PostDetail;
