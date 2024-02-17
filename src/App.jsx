import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './app/Navbar';
import { PostsList } from './features/posts/PostsList';
import AddPostForm from './features/posts/AddPostForm';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
