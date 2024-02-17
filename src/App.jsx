import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './app/Navbar';
import PostsList from './features/posts/PostsList';
import AddPostForm from './features/posts/AddPostForm';
import SinglePost from './features/posts/SinglePost';

function App() {
  return (
    <Router>
      <Navbar />
      <div className='container'>
        <Routes>
          <Route
            path='/'
            element={
              <>
                <AddPostForm /> <PostsList />
              </>
            }
          />
          <Route exact path='/posts/:postId' element={<SinglePost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
