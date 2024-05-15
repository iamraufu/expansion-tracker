import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateOutlet = () => {

      const { user } = useAuth();
      const location = useLocation();

      // console.log({user});

      return user.email ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateOutlet;