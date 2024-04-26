import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AddEditPosts from './pages/AddEditPosts';
import Navbar from './component/Navbar';
import PostsList from './pages/PostsList';
import PostDetail from './pages/PostDetail';
import { Box } from '@chakra-ui/react';
import Home from './pages/Home';
import { UserProvider } from './component/UserContext';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Box>
      <Router>
        <UserProvider>
          <Navbar />
          <ToastContainer position='top-center' />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/posts' element={<PostsList />} />
            <Route path='/addPost' element={<AddEditPosts />} />
            <Route path='/update/:id' element={<AddEditPosts />} />

            <Route path='/detail/:id' element={<PostDetail />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </UserProvider>
      </Router>
    </Box>
  );
}
