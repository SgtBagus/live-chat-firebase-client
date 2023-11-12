import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';

import { LayoutDefault } from "./Layout"; 

import Home from "./pages/Home";
import ChatPage from "./pages/Chats";

import Login from "./pages/Login/";
import ForgotPassword from "./pages/Login/ForgotPassword";
import Register from "./pages/Login/Register";

import { AuthContext } from "./context/AuthContext";

import "./style.scss";

const RenderDefaultLayout = (page, pageName, currentUser) => {
  return (
    <LayoutDefault dataLogin={currentUser} pageName={pageName}>
      {page}

      <NotificationContainer />
    </LayoutDefault>
  )
}

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={RenderDefaultLayout(<Home />, "Home", currentUser)} />
        <Route path="/chat" element={
            <ProtectedRoute>
              {RenderDefaultLayout(<ChatPage dataLogin={currentUser} />, "Chat Kepada Admin", currentUser)}
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="lupa-password" element={<ForgotPassword />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
