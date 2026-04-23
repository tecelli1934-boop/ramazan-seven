import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa veya rolü admin değilse yönlendir
  if (!user || user.role !== 'admin') {
    return <Navigate to="/giris" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
