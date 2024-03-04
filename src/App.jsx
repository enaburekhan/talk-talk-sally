import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AddEditPosts from './Pages/AddEditPosts';
import Navbar from './component/Navbar';
import PostsList from './Pages/PostsList';
import PostDetail from './Pages/PostDetail';
function App() {
  return (
    <div>
      <Router>
        <div>
          <Navbar />
          <ToastContainer position='top-center' />
          <Routes>
            <Route path='/' element={<PostsList />} />
            <Route path='/addPost' element={<AddEditPosts />} />
            <Route path='/update/:id' element={<AddEditPosts />} />

            <Route path='/detail/:id' element={<PostDetail />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
