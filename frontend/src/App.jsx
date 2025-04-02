import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import UserPage from './pages/UserPage/UserPage';
import ChatPage from './pages/ChatPage/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/user/:id' element={<UserPage />} />
        <Route path='/chat/:id' element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
