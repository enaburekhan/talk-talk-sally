import 'bootstrap/dist/css/bootstrap.css';
import { Navbar } from './app/Navbar';
import { PostsList } from './features/posts/PostsList';

function App() {
  return (
    <>
      <Navbar />
      <PostsList />
    </>
  );
}

export default App;
