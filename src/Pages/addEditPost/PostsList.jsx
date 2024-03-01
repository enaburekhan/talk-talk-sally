import { useFetchPostsQuery } from '../../services/postsApi';
import { Link } from 'react-router-dom';

const PostsList = () => {
  console.log('useFetchPostsQuery', useFetchPostsQuery);
  const { data, isLoading, isError, error } = useFetchPostsQuery();
  console.log('data', data);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <div>Error fetching data: {error.message}</div>;
  }
  const handleDelete = () => {};
  return (
    <div>
      {data &&
        data.map((post) => (
          <div key={post.id}>
            <img src={post.imgURL} alt={post.title} />
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button
              type='button'
              onClick={() => handleDelete(post.id)}
            ></button>
            <Link to={`/update/${post.id}`}></Link>
          </div>
        ))}
    </div>
  );
};

export default PostsList;
