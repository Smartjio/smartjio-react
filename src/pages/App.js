import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthProvider from '../contexts/AuthContext';
import PrivateOutlet from'../components/PrivateOutlet';
import Dashboard from './Dashboard';
import Signup from "./Signup"
import Login from "./Login"
import ProfileCreation from './ProfileCreation';
import ProfilePage from './ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateOutlet />}>
          {/* signup goes to create and login goes to slash */}
          {/* possible that user skips create by closing window */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<ProfileCreation />} />
          <Route path="/profile/:uid" element={<ProfilePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )}

export default App;
