import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

import './App.css';

// Gatekeeper for the Dashboard 
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      {}
      <div className="main-layout">
        <div className="background-decor">
          <div className="wave-bg"></div>
          <div className="geo-circle"></div>
          <div className="geo-square"></div>
        </div>

        {/* Content Layer  */}
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Login />} />

            {/* Admin Login  */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Dashboard*/}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Redirect unknown paths */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;