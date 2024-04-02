import { toast } from 'react-toastify';
import { useAddReactionMutation } from '../utils/postsApi';
import { useUser } from './UserContext';
import { useEffect, useState } from 'react';

const ReactionButtons = ({ post }) => {
  const [addReaction] = useAddReactionMutation();
  const { user } = useUser();
  const [updatedPost, setUpdatedPost] = useState(post);

  // Load reaction counts from localStorage on component mount
  useEffect(() => {
    const savedReactions = localStorage.getItem(`reactions_${post.id}`);
    if (savedReactions) {
      setUpdatedPost((prevPost) => ({
        ...prevPost,
        reactions: JSON.parse(savedReactions),
      }));
    }
  }, [post.id]);

  const handleReaction = async (reactionName) => {
    if (!user) {
      toast.error('Please sign in to add a reaction');
      return;
    }

    try {
      // Check if the user has already reacted with the selected reaction
      if (updatedPost.reactions?.[reactionName]?.includes(user.email)) {
        toast.error('You have already reacted with this reaction');
        return;
      }

      // Call the addReaction mutation
      await addReaction({
        postId: updatedPost.id,
        reaction: reactionName,
        userId: user.email,
      });

      // Update the reactions in the local state
      const updatedReactions = {
        ...updatedPost.reactions,
        [reactionName]: [
          ...(updatedPost.reactions?.[reactionName] || []),
          user.email,
        ],
      };

      setUpdatedPost((prevPost) => ({
        ...prevPost,
        reactions: updatedReactions,
      }));

      // Save updated reaction counts to localStorage
      localStorage.setItem(
        `reactions_${updatedPost.id}`,
        JSON.stringify(updatedReactions)
      );
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const reactionEmoji = {
    thumbsup: '👍',
    hooray: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀',
  };

  const reactionButtons = Object.entries(reactionEmoji).map(
    ([reactionName, emoji]) => (
      <button
        key={reactionName}
        type='button'
        onClick={() => handleReaction(reactionName)}
      >
        {emoji} {updatedPost.reactions?.[reactionName]?.length || 0}
      </button>
    )
  );

  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
