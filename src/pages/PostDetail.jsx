import { useParams } from 'react-router-dom';
import { useFetchPostQuery } from '../utils/postsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';
import { Flex, Text, Box, Heading, Avatar } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

const PostDetail = () => {
  const { id } = useParams();
  const { data: post, error, isError } = useFetchPostQuery(id ? id : skipToken);

  useEffect(() => {
    isError && toast.error(error);
  }, [isError]);

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
    </Box>
  );
};

export default PostDetail;
