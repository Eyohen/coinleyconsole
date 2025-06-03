import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Unauthorized from '../components/Unauthorized';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log("ProtectedRoute isUser: ", user, isAuthenticated);

  if(loading){
    // return <div>Loading . . .</div>
    return <div><Unauthorized /></div>

    
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

  return children;
};

export default ProtectedRoute;