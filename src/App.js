// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile'; // You can define a Profile component later
import AuthProvider from './AuthProvider';

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Router>
      <div>
        <LoginButton />
        <LogoutButton />
        {isAuthenticated && (
          <Routes>
            <Route path="/profile" element={<Profile />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
