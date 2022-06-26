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
import TestPage from './TestPage';
import ErrorEventNotFound from './ErrorEventNotFound';
import ProfileCreation from './ProfileCreation';
import ProfilePage from './ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateOutlet />}>
          <Route path="/" element={<Dashboard />} />
          {/* signup goes to create and login goes to slash */}
          {/* possible that user skips create by closing window */}
          <Route path="/event/:eid" element={<Event />} />
          <Route path="/court/:cid" element={<Court />} />
          <Route path="/create" element={<ProfileCreation />} />
          <Route path="/profile/:uid" element={<ProfilePage />} />
          <Route path="/jio" element={<EventCreation />} />
          <Route path="/friends" element={<MyFriends />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/testing" element={<TestPage />} />
          <Route path="/ErrorEventNotFound" element={<ErrorEventNotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )}

export default App;
