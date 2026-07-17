import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import React from 'react';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();

  const { isAuthChecked, user } = useSelector((store) => store.user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
