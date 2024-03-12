import { useEffect, useMemo } from 'react';
import { useDeletePostMutation, useFetchPostsQuery } from '../utils/postsApi';
import { toast } from 'react-toastify';
import Spinner from '../component/Spinner';
import ReactionButtons from '../component/ReactionButtons';
import { useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Divider,
  Image,
  Text,
  Button,
  HStack,
  Input,
  SimpleGrid,
} from '@chakra-ui/react';
import CustomButtonLink from '../component/CustomButtonLink';

const PostsList = () => {
  const [searchField, setSearchField] = useState('');
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
    <Flex direction='column' justify='center' align='center' mt='5px'>
      <Stack spacing={3} width={{ base: '90%', md: '500px' }}>
        <Input
          type='search'
          placeholder='Search Post by title or author'
          onChange={(e) => setSearchField(e.target.value)}
          size='lg'
        />
      </Stack>
      <Box as='section'>
        <Grid templateColumns='repeat(4, 1fr)' gap={6}>
          {filteredPosts.length > 0
            ? filteredPosts?.map((post) => (
                <Card maxW='sm' key={post.id} className='main-card'>
                  <CardBody>
                    <Image
                      src={post.imgURL}
                      alt={post.title}
                      borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                      <CardHeader size='md'>{post.title}</CardHeader>
                      <Text>{postExcerpt(post.content, 80)}</Text>
                      <Text fontSize='14px' color='#333'>
                        Author: {post.author}
                      </Text>
                      <Text color='blue.600' fontSize='10px'>
                        Created on: {post?.timestamp.toDate().toLocaleString()}
                      </Text>
                    </Stack>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <HStack spacing={4} align='center'>
                      <Box fontSize='sm'>{<ReactionButtons post={post} />}</Box>
                      <CustomButtonLink
                        to={`/detail/${post.id}`}
                        fontSize='12px'
                        color='#333'
                        backgroundColor='navyblue.500'
                      >
                        View Post
                      </CustomButtonLink>
                      <CustomButtonLink
                        to={`/update/${post.id}`}
                        color='#333'
                        fontSize='12px'
                        backgroundColor='#5079bf.500'
                      >
                        Update Post
                      </CustomButtonLink>
                      <Button
                        type='button'
                        onClick={() => handleDelete(post.id)}
                        variant='ghost'
                        colorScheme='blue'
                        fontSize='12px'
                      >
                        Delete Post
                      </Button>
                    </HStack>
                  </CardFooter>
                </Card>
              ))
            : // If no seacch results, display all posts
              sortedPosts?.map((post) => (
                <Card maxW='sm' key={post.id}>
                  <CardBody>
                    <Image
                      src={post.imgURL}
                      alt={post.title}
                      borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                      <CardHeader size='md'>{post.title}</CardHeader>
                      <Text>{postExcerpt(post.content, 80)}</Text>
                      <Text fontSize='14px' color='#333'>
                        Author: {post.author}
                      </Text>
                      <Text color='blue.600' fontSize='10px'>
                        Created on: {post?.timestamp.toDate().toLocaleString()}
                      </Text>
                    </Stack>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <HStack spacing={4} align='center'>
                      <Box fontSize='sm'>{<ReactionButtons post={post} />}</Box>
                      <CustomButtonLink
                        to={`/detail/${post.id}`}
                        fontSize='12px'
                        color='#333'
                        backgroundColor='navyblue.500'
                      >
                        View Post
                      </CustomButtonLink>
                      <CustomButtonLink
                        to={`/update/${post.id}`}
                        color='#333'
                        fontSize='12px'
                        backgroundColor='#5079bf.500'
                      >
                        Update Post
                      </CustomButtonLink>
                      <Button
                        type='button'
                        onClick={() => handleDelete(post.id)}
                        variant='ghost'
                        colorScheme='blue'
                        fontSize='12px'
                      >
                        Delete Post
                      </Button>
                    </HStack>
                  </CardFooter>
                </Card>
              ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default PostsList;
