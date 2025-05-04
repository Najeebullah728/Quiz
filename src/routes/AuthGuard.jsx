import { Navigate, useLocation } from 'react-router-dom';

// Auth Guard for Admin Routes
export const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Save the attempted URL for redirection after login
    localStorage.setItem('adminRedirectUrl', location.pathname);
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};
