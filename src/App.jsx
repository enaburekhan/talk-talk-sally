import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AddEditPosts from './pages/AddEditPosts';
import Navbar from './component/Navbar';
import PostsList from './pages/PostsList';
import PostDetail from './pages/PostDetail';
import './index.css';
import { Box } from '@chakra-ui/react';

export default function App() {
  return (
    <Box>
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
      
    
    </Box>
  
  );
}
