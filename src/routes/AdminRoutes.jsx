import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Admin Components
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import DashboardHome from '../pages/DashboardHome';
import AdminPanel from '../pages/AdminPanel';
import AdminSettings from '../pages/AdminSettings';

// Auth Guard for Admin Routes
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted URL for redirection after login
    localStorage.setItem('adminRedirectUrl', location.pathname);
    return <Navigate to="/admin" replace />;
  }

  return children;
};

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }>
        <Route index element={<DashboardHome />} />
        <Route path="documentation" element={<AdminPanel activeTab="documentation" />} />
        <Route path="quizzes" element={<AdminPanel activeTab="quiz" />} />
        <Route path="custom-quiz" element={<AdminPanel activeTab="custom-quiz" />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      {/* Catch any other admin routes and redirect to login */}
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default AdminRoutes;
