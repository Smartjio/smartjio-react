import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthProvider from '../contexts/AuthContext';
import PrivateOutlet from'../components/PrivateOutlet';
import Dashboard from './Dashboard';
import Signup from "./Signup";
import Login from "./Login";
import ProfilePage from './ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateOutlet />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile/:uid" element={<ProfilePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )}

export default App;
