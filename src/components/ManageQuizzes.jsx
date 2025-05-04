import { useState, useEffect } from 'react';
import { fetchQuizzes, deleteQuiz } from '../services/api';

function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedQuizzes = await fetchQuizzes();
      setQuizzes(fetchedQuizzes);
      
      console.log(`Loaded ${fetchedQuizzes.length} quizzes`);
    } catch (err) {
      console.error('Error loading quizzes:', err);
      setError('Failed to load quizzes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      setDeleteStatus({ type: '', message: '' });
      
      await deleteQuiz(id);
      
      // Remove the deleted quiz from the state
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
      
      setDeleteStatus({
        type: 'success',
        message: `Quiz "${title}" deleted successfully!`
      });
      
      // Clear the status message after 3 seconds
      setTimeout(() => {
        setDeleteStatus({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      setDeleteStatus({
        type: 'error',
        message: error.message || 'Failed to delete quiz. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && quizzes.length === 0) {
    return <div className="loading">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (quizzes.length === 0) {
    return <div className="no-quizzes">No quizzes available.</div>;
  }

  return (
    <div className="manage-quizzes">
      <h2>Manage Quizzes</h2>
      
      {deleteStatus.message && (
        <div className={`status-message ${deleteStatus.type}`}>
          {deleteStatus.message}
        </div>
      )}
      
      <div className="quizzes-list">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="quiz-item">
            <div className="quiz-info">
              <h3>{quiz.title}</h3>
              <p className="quiz-description">{quiz.description}</p>
              <p className="quiz-date">Created: {new Date(quiz.created_at).toLocaleString()}</p>
              <p className="quiz-questions">Questions: {quiz.questions ? quiz.questions.length : 0}</p>
            </div>
            <div className="quiz-actions">
              <button 
                className="delete-btn"
                onClick={() => handleDelete(quiz.id, quiz.title)}
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageQuizzes;
