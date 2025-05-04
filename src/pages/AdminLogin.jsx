import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try to make an API call to the backend for authentication
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
          // Include credentials to send and receive cookies
          credentials: 'include',
          // Add a timeout to prevent hanging if server is not responding
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });

        // Check if the response is valid JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();

          if (response.ok && data.success) {
            // Authentication successful
            localStorage.setItem('adminAuthenticated', 'true');
            localStorage.setItem('adminUsername', username);

            // Check if there's a redirect URL saved
            const redirectUrl = localStorage.getItem('adminRedirectUrl');
            if (redirectUrl) {
              localStorage.removeItem('adminRedirectUrl');
              navigate(redirectUrl);
            } else {
              navigate('/admin/dashboard');
            }
            return;
          } else {
            // Authentication failed
            setError(data.error || 'Invalid username or password');
            return;
          }
        } else {
          // Response is not JSON, likely a server error
          throw new Error('Server returned an invalid response');
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        // Server is not available or returned an error, use fallback authentication
        console.log('Using fallback authentication');
      }

      // Fallback authentication when server is not available
      if (username === 'Njeebullah@12' && password === 'Najeebullah@123') {
        // Authentication successful
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminUsername', username);

        // Check if there's a redirect URL saved
        const redirectUrl = localStorage.getItem('adminRedirectUrl');
        if (redirectUrl) {
          localStorage.removeItem('adminRedirectUrl');
          navigate(redirectUrl);
        } else {
          navigate('/admin/dashboard');
        }

        console.log('Logged in using fallback authentication');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1>Admin Login</h1>
        <p>Enter your username and password to access the admin panel</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="back-to-site">
          <a href="/">← Back to site</a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
