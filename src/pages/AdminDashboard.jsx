import { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { logout } from '../services/api';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const adminAuth = localStorage.getItem('adminAuthenticated');
    const adminUsername = localStorage.getItem('adminUsername');

    if (adminAuth !== 'true') {
      navigate('/admin');
    } else {
      setIsAuthenticated(true);
      setUsername(adminUsername || 'Admin');
    }
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call the logout API function
      await logout();
      // Navigate to login page
      navigate('/admin');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate to login page even if there's an error
      navigate('/admin');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Checking authentication...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>

        <nav className="admin-nav">
          <ul>
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/documentation" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                Documentation
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/quizzes" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                Quizzes
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/custom-quiz" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                Custom Quiz
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                Settings
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="admin-logout">
          <button
            onClick={handleLogout}
            className="logout-btn"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <div className="admin-user">
            <span>Logged in as {username}</span>
          </div>
        </div>

        <div className="admin-main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
