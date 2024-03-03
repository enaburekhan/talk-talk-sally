import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <Link to={'/'}>Posts</Link>
      <Link to={'/addPost'}>AddPost</Link>
    </div>
  );
};

export default Navbar;
