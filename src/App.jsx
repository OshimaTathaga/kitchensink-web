import {useState} from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AuthTabs from "./components/AuthTabs.jsx";
import AdminView from "./views/AdminView.jsx";
import ProfileView from "./views/ProfileView.jsx";
import Layout from './Layout.jsx';
import UserView from "./views/UserView.jsx";
import {jwtDecode} from "jwt-decode";
import {setAuthToken} from "./api/api.js";

export default function App() {
  const [auth, setAuth] = useState(() => {
    
    const token = localStorage.getItem("token");
    
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp > currentTime) {
        const role = decoded?.roles[0]?.toLowerCase();
        
        setAuthToken(token);
        return {isAuthenticated: true, role};
      }
    }
    
    return {isAuthenticated: false, role: null};
  });

  const handleLogin = (role) => setAuth({ isAuthenticated: true, role });
  const handleLogout = () => setAuth({ isAuthenticated: false, role: null });

  return (
    <Router>
      <Layout auth={auth} onLogout={handleLogout} >
        <Routes>
          <Route path="/" element={auth.isAuthenticated ? <Navigate to="/profile" /> : <AuthTabs onLogin={handleLogin} />} />
          <Route path="/profile" element={<ProtectedRoute auth={auth} role={["admin", "user"]}><ProfileView /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute auth={auth} role={["admin"]}><AdminView /></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute auth={auth} role={["user"]}><UserView /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const ProtectedRoute = ({ auth, role, children }) => {
  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (role && !role.includes(auth.role)) {
    return <Navigate to="/profile" />;
  }

  return children;
};
