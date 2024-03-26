import { Box, Heading, Stack, Alert } from '@chakra-ui/react';
import { useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import { useUser } from './UserContext';
import { useAddCommentMutation } from '../utils/postsApi';

const CustomForm = ({ post }) => {
  console.log('post.content', post?.content);
  const [formState, setFormState] = useState({
    email: '',
    comment: '',
  });

  const { user } = useUser();
  const [addComment] = useAddCommentMutation();

  const submit = async () => {
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
        postId: post.id,
        email: user.email,
        comment: formState.comment,
      });

      setFormState({ ...formState, comment: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
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
          <Mention
            trigger='@'
            data={post?.content}
            renderSuggestion={(suggestion, search, highlightedDisplay) => (
              <div className='user'>{highlightedDisplay}</div>
            )}
          />
        </MentionsInput>
        <button onClick={submit}>Submit</button>
      </Stack>
    </Box>
  );
};

export default CustomForm;
