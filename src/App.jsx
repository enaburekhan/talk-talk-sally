import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddEditPosts from './Pages/addEditPost/AddEditPosts';
import Navbar from './component/Navbar';
function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<AddEditPosts />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
