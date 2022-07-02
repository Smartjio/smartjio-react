import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocation, Navigate, Outlet } from "react-router-dom";

export default function RequireData() {
    const { currentUser, loading, userData } = useAuth();
    const location = useLocation();

    if (currentUser === undefined || loading) {
      console.log("failed auth", currentUser, loading);
        return null;
    } else {
      console.log(currentUser)
    }

    if ((userData === undefined && currentUser) || loading)  {
      console.log("failed data", userData, loading);
        return null;
    }
    
    return (userData
            ? <Outlet /> 
            : (currentUser 
              ? <Navigate to="/create" state={{ from: location }} replace />
              : <Navigate to="/login" state={{ from: location }} replace />))
    };