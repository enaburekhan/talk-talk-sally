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
      <Editor
        apiKey='qzdns6jmf0qi7om95ppnxngk06o19tuuzdx3zdde6ub7v7cb'
        initialValue={post?.content}
        init={{
          plugins:
            'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tableofcontents footnotes mergetags autocorrect typography inlinecss',
          toolbar:
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        }}
      />

      <Text color='blue.600' fontSize='12px' fontWeight='800'>
        Created on: {post?.timestamp.toDate().toLocaleString()}
      </Text>
    </Box>
  );
};

export default PostDetail;
