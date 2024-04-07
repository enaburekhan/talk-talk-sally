import { useEffect, useMemo } from 'react';
import { useDeletePostMutation, useFetchPostsQuery } from '../utils/postsApi';
import { toast } from 'react-toastify';
import ReactionButtons from '../component/ReactionButtons';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Input,
  SimpleGrid,
  Spinner,
  Link,
} from '@chakra-ui/react';
import CustomButtonLink from '../component/CustomButtonLink';
import moment from 'moment/moment';
import { useUser } from '../component/UserContext';

const PostsList = () => {
  const [searchField, setSearchField] = useState('');
  const { data: posts = [], isLoading, isError, error } = useFetchPostsQuery();
  const { user } = useUser();

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = moment(a.timestamp.toDate()).format(
        'MMMM Do YYYY, h:mm:ss a'
      );
      const dateB = moment(b.timestamp.toDate()).format(
        'MMMM Do YYYY, h:mm:ss a'
      );
      return dateB - dateA;
    });
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
    return (
      <Flex align='center' justify='center' h='50vh'>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />
      </Flex>
    );
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
    <Flex
      direction='column'
      justify='center'
      align='center'
      mt='5px'
      gap={6}
      boxShadow='lg'
    >
      <Stack spacing={3} width={{ base: '90%', md: '500px' }}>
        <Input
          type='search'
          placeholder='Search Post by title or author'
          onChange={(e) => setSearchField(e.target.value)}
          size='lg'
        />
      </Stack>
      <Box as='section'>
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={{ base: 6, sm: 6, md: 12, lg: 16 }}
        >
          {filteredPosts.length > 0
            ? filteredPosts?.map((post) => (
                <Card
                  maxW='sm'
                  key={post.id}
                  border='1px solid #b2a8a8'
                  boxShadow='md'
                >
                  <CardBody>
                    <Image
                      src={post.imgURL}
                      alt={post.title}
                      borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                      <CardHeader size='md'>{post.title}</CardHeader>
                      <Flex align='center'>
                        <Box
                          dangerouslySetInnerHTML={{
                            __html: postExcerpt(post.content, 80),
                          }}
                        />

                        <Link
                          as={RouterLink}
                          to={`/detail/${post.id}`}
                          fontSize='12px'
                          color='blue'
                          ml='2'
                        >
                          View More
                        </Link>
                      </Flex>

                      <Text fontSize='14px' color='blue.600'>
                        Author: {post.author}
                      </Text>
                      <Text color='blue.600' fontSize='10px'>
                        Created on: {post?.timestamp.toDate().toLocaleString()}
                      </Text>
                    </Stack>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <SimpleGrid
                      columns={{ base: 1, md: 2, lg: 3 }}
                      spacing={3}
                      align='center'
                      justify='center'
                    >
                      <Box fontSize='sm'>{<ReactionButtons post={post} />}</Box>

                      {user && (
                        <>
                          <CustomButtonLink
                            to={`/update/${post.id}`}
                            color='#fff'
                            fontSize='12px'
                            backgroundColor='blue.500'
                            _hover={{ backgroundColor: 'blue.400' }}
                            textAlign='center'
                            py={2}
                            borderRadius='5px'
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
                        </>
                      )}
                    </SimpleGrid>
                  </CardFooter>
                </Card>
              ))
            : // If no seacch results, display all posts
              sortedPosts?.map((post) => (
                <Card
                  maxW='sm'
                  key={post.id}
                  border='1px solid blue'
                  boxShadow='md'
                >
                  <CardBody>
                    <Image
                      src={post.imgURL}
                      alt={post.title}
                      borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                      <CardHeader size='md'>{post.title}</CardHeader>
                      <Text>{postExcerpt(post.content, 80)}</Text>&nbsp;
                      <Link as={RouterLink} to={`/detail/${post.id}`}>
                        View More
                      </Link>
                      <Text fontSize='14px' color='blue.600'>
                        Author: {post.author}
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
                    >
                      <Box fontSize='sm'>{<ReactionButtons post={post} />}</Box>

                      <CustomButtonLink
                        to={`/update/${post.id}`}
                        color='#333'
                        fontSize='12px'
                        backgroundColor='blue.500'
                        _hover={{ backgroundColor: 'blue.400' }}
                        py={2}
                        borderRadius='5px'
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
                    </SimpleGrid>
                  </CardFooter>
                </Card>
              ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default PostsList;
