import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthProvider from '../contexts/AuthContext';
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
import Activities from './Activities';
import Settings from './Settings';
import ExploreVenues from './CourtExplore';
import RequireData from '../components/RequireData';
import RequireAuth from '../components/RequireAuth';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route path="/create" element={<ProfileCreation />} />
        </Route>
        
        <Route element={<RequireData />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/event/:eid" element={<Event />} />
          <Route path="/court/:cid" element={<Court />} />
          
          <Route path="/profile/:uid" element={<ProfilePage />} />
          <Route path="/jio" element={<EventCreation />} />
          <Route path="/friends" element={<MyFriends />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/testing" element={<TestPage />} />
          <Route path="/ErrorEventNotFound" element={<ErrorEventNotFound />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/activities" element={<Activities />} /> 
          <Route path="/venues" element={<ExploreVenues />} />
        </Route>

      </Routes>
    </AuthProvider>
  )}

export default App;
