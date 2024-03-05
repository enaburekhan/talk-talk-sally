import { useAddReactionMutation } from '../utils/postsApi';

const ReactionButtons = ({ post }) => {
  const [addReaction] = useAddReactionMutation();
  const reactionEmoji = {
    thumbsUp: '👍',
    hooray: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀',
  };
  const reactionButtons = Object.entries(reactionEmoji).map(
    ([reactionName, emoji]) => {
      return (
        <button
          key={reactionName}
          type='button'
          onClick={() => {
            addReaction({ postId: post.id, reaction: reactionName });
          }}
        >
          {emoji} {post.reactions?.[reactionName] || 0}
        </button>
      );
    }
  );
  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
