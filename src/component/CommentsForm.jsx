import {
  Box,
  useBreakpointValue,
  Button,
  FormControl,
  Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import { useUser } from './UserContext';
import { useAddCommentMutation } from '../utils/postsApi';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const CommentsForm = ({ post }) => {
  const { id: postId } = useParams();
  const [formState, setFormState] = useState({
    email: '',
    comment: '',
  });

  const { user } = useUser();
  const [addComment] = useAddCommentMutation();

  const submit = async () => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }
    if (formState.comment === '') {
      toast.error('Please fill in the comment fields');
      return;
    }
    try {
      await addComment({
        postId,
        email: user.email,
        comment: formState.comment,
      });

      setFormState({ ...formState, comment: '' });
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  return (
    <Box width={{ base: '90%', md: '50%' }} mt='10px'>
      <FormControl borderColor='#fff'>
        <MentionsInput
          as={Textarea}
          size={{ base: 'sm', md: 'md' }}
          placeholder='Add a comment here'
          value={formState.comment}
          onChange={(e) =>
            setFormState({ ...formState, comment: e.target.value })
          }
        >
          <Mention trigger='@' data={[{ id: 1, display: post?.author }]} />
        </MentionsInput>
      </FormControl>
      <Button
        type='submit'
        colorScheme='blue'
        size={buttonSize}
        mt={4}
        onClick={submit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default CommentsForm;
