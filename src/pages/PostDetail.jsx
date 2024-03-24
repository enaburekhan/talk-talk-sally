import { useParams } from 'react-router-dom';
import { useFetchPostQuery } from '../utils/postsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import { Flex, Text, Box, Heading, Avatar } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import CustomForm from '../component/CustomForm';
import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import { db } from '../utils/firebase';

const PostDetail = () => {
  const { id } = useParams();
  const { data: post, error, isError } = useFetchPostQuery(id ? id : skipToken);

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsSnapshot = await getDocs(
          collection(db, `posts/${id}/comments`)
        );
        const commentsData = commentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('commentsData', commentsData);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const unsubscribe = onSnapshot(
      query(collection(db, `posts/${id}/comments`)),
      (snapshot) => {
        const commentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
      }
    );
    fetchComments();
    return unsubscribe;
  }, [id]);

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
      <CustomForm post={post} />
      {comments.length > 0 && (
        <Box mt={6}>
          <Heading size='md'>Comments</Heading>
          {comments.map((comment) => (
            <Box key={comment.id} bg='gray.100' p={4} borderRadius='md' mt={2}>
              <Text>{comment.username}</Text>
              <Text mt={2}>{comment.comment}</Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PostDetail;
