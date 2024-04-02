import { Box, Heading, Stack, Alert } from '@chakra-ui/react';
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
  console.log('addComment', addComment);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to comment');
      return;
    }
    if (formState.comment === '') {
      alert('Please fill in the comment fields');
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

  return (
    <Box>
      <Stack>
        <Heading>Comment Form</Heading>
        <MentionsInput
          placeholder="Add a comment. Use '@' for mention"
          value={formState.comment}
          onChange={(e) =>
            setFormState({ ...formState, comment: e.target.value })
          }
        >
          <Mention trigger='@' data={[{ id: 1, display: post?.author }]} />
        </MentionsInput>
        <button onClick={submit}>Submit</button>
      </Stack>
    </Box>
  );
};

export default CommentsForm;
