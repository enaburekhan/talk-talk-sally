import { Box, Heading, Stack, Alert } from '@chakra-ui/react';
import { useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

const CustomForm = ({ post }) => {
  const [formState, setFormState] = useState({
    username: '',
    comment: '',
  });

  const [comments, setComments] = useState([]);

  const submit = async () => {
    if (formState.username === '' || formState.comment === '') {
      alert('Please fill in all fields');
      return;
    }
    try {
      const newCommentRef = await addDoc(
        collection(db, `posts/${post.id}/comments`),
        {
          username: formState.username,
          comment: formState.comment,
          timestamp: serverTimestamp(),
        }
      );

      setComments((prevComments) => [
        ...prevComments,
        { id: newCommentRef.id, ...formState },
      ]);
      setFormState({ username: '', comment: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Box>
      <Stack>
        <Heading>Comment Form</Heading>
        <input
          type='text'
          value={formState.value}
          onChange={(e) =>
            setFormState({ ...formState, username: e.target.value })
          }
          placeholder='Input your name'
        />
        <MentionsInput
          placeholder="Add a comment. Use '@' for mention"
          value={formState.comment}
          onChange={(e) =>
            setFormState({ ...formState, comment: e.target.value })
          }
        >
          <Mention data={post} />
        </MentionsInput>
        <button onClick={submit}>Submit</button>
      </Stack>
      {comments.length === 0 ? null : (
        <Stack>
          {comments.map((comment, index) => {
            const current = new Date();
            const date = `${current.getDate()}/${
              current.getMonth() + 1
            }/${current.getFullYear()}`;
            return (
              <Box key={index}>
                <p>
                  {comment.username} on {date}
                </p>
                <Heading>{comment.comment}</Heading>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default CustomForm;
