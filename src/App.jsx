import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddEditPosts from './Pages/addEditPost/AddEditPosts';
import Navbar from './component/Navbar';
import PostsList from './Pages/addEditPost/PostsList';
import PostDetail from './Pages/PostDetail';
function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path='/'
            element={
              <>
                <AddEditPosts /> <PostsList />
              </>
            }
          />
          <Route path='/detail/:id' element={<PostDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
