import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthProvider from '../contexts/AuthContext';
import PrivateOutlet from'../components/PrivateOutlet';
import Dashboard from './Dashboard';
import Signup from "./Signup"
import Login from "./Login"
import Event from './Event'
import Court from './Court'
import EventCreation from './EventCreation';
import MyFriends from './MyFriends';
import Notification from './Notifications';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event" element={<Event />} />
        <Route path="/court" element={<Court />} />
        <Route path="/jio" element={<EventCreation />} />
        <Route path="/friends" element={<MyFriends />} />
        <Route path="/notification" element={<Notification />} />

        <Route path="/" element={<Dashboard />} />

        <Route element={<PrivateOutlet />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  )}

export default App;
