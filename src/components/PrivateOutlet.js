import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocation, Navigate, Outlet } from "react-router-dom";

export default function PrivateOutlet() {
    const { currentUser } = useAuth();
    const location = useLocation();
    
    return (
        currentUser 
        ? <Outlet /> 
        : <Navigate to="/login" state={{ from: location }} replace />
    )}