import { useParams } from 'react-router-dom';
import { useFetchPostQuery } from '../utils/postsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Divider,
  Image,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
const PostDetail = () => {
  const { id } = useParams();
  const { data: post, error, isError } = useFetchPostQuery(id ? id : skipToken);

  useEffect(() => {
    isError && toast.error(error);
  }, [isError]);
  return (
    <Card maxW='sm' key={post?.id}>
      <CardBody>
        <Image src={post?.imgURL} alt={post?.title} borderRadius='lg' />
        <Stack mt='6' spacing='3'>
          <CardHeader size='md'>{post?.title}</CardHeader>
          <Text>{post?.content}</Text>
          <Text fontSize='14px' color='#333'>
            Author: {post?.author}
          </Text>
          <Text color='blue.600' fontSize='10px'>
            Created on: {post?.timestamp.toDate().toLocaleString()}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={4}
          align='center'
        ></SimpleGrid>
      </CardFooter>
    </Card>
  );
};

export default PostDetail;
