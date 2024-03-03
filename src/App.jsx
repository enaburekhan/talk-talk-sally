import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddEditPosts from './Pages/AddEditPosts';
import Navbar from './component/Navbar';
import PostsList from './Pages/PostsList';
import PostDetail from './Pages/PostDetail';
function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<PostsList />} />
          <Route path='/addPost' element={<AddEditPosts />} />
          <Route path='/update/:id' element={<AddEditPosts />} />

          <Route path='/detail/:id' element={<PostDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
