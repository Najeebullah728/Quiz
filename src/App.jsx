import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Layout from './components/Layout';

// User Pages
import Home from './pages/Home';
import Documentation from './pages/Documentation';
import QuizPage from './pages/QuizPage';

// Admin Components
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import DashboardHome from './pages/DashboardHome';
import AdminPanel from './pages/AdminPanel';
import AdminSettings from './pages/AdminSettings';

// Auth Guard
import { AdminRoute } from './routes/AuthGuard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="documentation" element={<Documentation />} />
          <Route path="quiz" element={<QuizPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }>
          <Route path="/admin/dashboard" element={<DashboardHome />} />
          <Route path="/admin/documentation" element={<AdminPanel activeTab="documentation" />} />
          <Route path="/admin/quizzes" element={<AdminPanel activeTab="quiz" />} />
          <Route path="/admin/custom-quiz" element={<AdminPanel activeTab="custom-quiz" />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
