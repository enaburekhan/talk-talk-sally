import { useParams } from 'react-router-dom';
import { useFetchCommentsQuery, useFetchPostQuery } from '../utils/postsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';
import {
  Flex,
  Text,
  Box,
  Heading,
  Avatar,
  Spinner,
  useColorMode,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import CommentsForm from '../component/CommentsForm';

const PostDetail = () => {
  const { id } = useParams();
  const { data: post, error, isError } = useFetchPostQuery(id ? id : skipToken);
  const {
    data: comments,
    isLoading,
    isError: commentsError,
  } = useFetchCommentsQuery(id);

  const { colorMode } = useColorMode(); // Get the current color mode

  useEffect(() => {
    isError && toast.error(error);
  }, [isError]);

  useEffect(() => {
    commentsError && toast.error(commentsError);
  }, [commentsError]);

  return (
    <Flex
      direction='column'
      align='center'
      p={4}
      bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'}
      color={colorMode === 'dark' ? 'white' : 'black'}
    >
      <Box maxW='800px' w='100%' px={[4, 6, 8]}>
        <Flex align='center' mb='4'>
          <Avatar
            src={post?.imgURL}
            name={post?.title}
            borderRadius='full'
            mr='2'
          />

          <Text fontSize='sm' fontWeight='bold'>
            Written by {post?.author}
          </Text>
        </Flex>

        <Heading mb='4' fontSize={['xl', '2xl', '3xl']}>
          {post?.title}
        </Heading>

        <Box
          dangerouslySetInnerHTML={{ __html: post?.content }}
          mb='4'
          fontSize={['sm', 'md', 'lg']}
        />

        <Text fontSize='sm' fontWeight='bold' mb='4'>
          Created on: {post?.timestamp.toDate().toLocaleString()}
        </Text>
        <CommentsForm post={post} />
        {isLoading && <Spinner />}
        {comments && comments.length > 0 && (
          <Box mt={6}>
            <Heading size='md' mb='2'>
              Comments
            </Heading>
            {comments.map((comment) => (
              <Box
                key={comment.id}
                bg='gray.100'
                p={4}
                borderRadius='md'
                mb='2'
              >
                <Text fontWeight='bold' mb='2' color='#333'>
                  {comment.email}
                </Text>
                <Text color='#333'>${comment.comment}</Text>
              </Box>
            ))}
          </Box>
        )}
        {comments && comments.length === 0 && (
          <Box mt={6}>No Comments yet. be the first one to comment!</Box>
        )}
      </Box>
    </Flex>
  );
};

export default PostDetail;
