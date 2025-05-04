import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function DashboardHome() {
  const [stats, setStats] = useState({
    documentationCount: 0,
    quizCount: 0,
    questionCount: 0
  });

  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For now, we'll use dummy data
    setStats({
      documentationCount: 3,
      quizCount: 1,
      questionCount: 7
    });
  }, []);

  return (
    <div className="dashboard-home">
      <h2>Welcome to the Admin Dashboard</h2>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon documentation-icon">📚</div>
          <div className="stat-content">
            <h3>Documentation</h3>
            <p className="stat-number">{stats.documentationCount}</p>
            <p className="stat-label">Total Documents</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon quiz-icon">🧠</div>
          <div className="stat-content">
            <h3>Quizzes</h3>
            <p className="stat-number">{stats.quizCount}</p>
            <p className="stat-label">Total Quizzes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon question-icon">❓</div>
          <div className="stat-content">
            <h3>Questions</h3>
            <p className="stat-number">{stats.questionCount}</p>
            <p className="stat-label">Total Questions</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/admin/documentation" className="action-btn">
            Add Documentation
          </Link>
          <Link to="/admin/custom-quiz" className="action-btn">
            Create Quiz
          </Link>
          <Link to="/admin/settings" className="action-btn">
            Change Password
          </Link>
        </div>
      </div>

      <div className="admin-info">
        <h3>Admin Information</h3>
        <p>
          This is the admin panel for the Python Learning Hub. Here you can manage documentation,
          create and edit quizzes, and change your admin password.
        </p>
        <p>
          <strong>Note:</strong> All changes made here will be stored in the SQLite database and
          will be immediately available to users.
        </p>
      </div>
    </div>
  );
}

export default DashboardHome;
