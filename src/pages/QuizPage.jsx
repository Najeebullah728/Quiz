import { useState, useEffect } from 'react';
import Quiz from '../components/Quiz';
import quizQuestions from '../data/questions';
import { fetchQuizzes } from '../services/api';
import * as storageService from '../services/storageService';

function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Loading quizzes...');

        // Try to fetch quizzes from the API (which now has localStorage fallback)
        let fetchedQuizzes = [];
        try {
          fetchedQuizzes = await fetchQuizzes();
          console.log(`Received ${fetchedQuizzes.length} quizzes from API/localStorage`);
        } catch (fetchError) {
          console.error('Error fetching quizzes:', fetchError);

          // Direct fallback to localStorage if the API service fails completely
          console.log('Direct fallback to localStorage for quizzes');
          fetchedQuizzes = storageService.getQuizzes();
          console.log(`Retrieved ${fetchedQuizzes.length} quizzes directly from localStorage`);
        }

        // If no quizzes are returned, use sample data
        if (fetchedQuizzes.length === 0) {
          console.log('No quizzes found, using sample data');
          // Fallback to sample data if no quizzes are available
          const sampleQuizzes = [
            {
              id: 1,
              title: 'Python Strings Quiz (Sample)',
              description: 'Test your understanding of Python strings with this quiz.',
              questions: quizQuestions
            }
          ];
          setQuizzes(sampleQuizzes);
        } else {
          setQuizzes(fetchedQuizzes);
        }
      } catch (err) {
        console.error('Error in quiz page component:', err);
        setError(`Failed to load quizzes: ${err.message}`);

        // Last resort fallback to hardcoded sample data
        console.log('Using hardcoded fallback sample quizzes');
        const sampleQuizzes = [
          {
            id: 1,
            title: 'Python Strings Quiz (Emergency Fallback)',
            description: 'Test your understanding of Python strings with this quiz.',
            questions: quizQuestions
          }
        ];
        setQuizzes(sampleQuizzes);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
  };

  return (
    <div className="quiz-page">
      {isLoading ? (
        <div className="loading-container">
          <p>Loading quizzes...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      ) : !selectedQuiz ? (
        <div className="quiz-selection">
          <h1>Available Quizzes</h1>
          {quizzes.length === 0 ? (
            <div className="no-quizzes">
              <p>No quizzes are currently available. Please check back later.</p>
            </div>
          ) : (
            <div className="quiz-cards">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="quiz-card">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <button
                    className="start-quiz-btn"
                    onClick={() => handleQuizSelect(quiz)}
                    disabled={!quiz.questions || quiz.questions.length === 0}
                  >
                    {quiz.questions && quiz.questions.length > 0 ? 'Start Quiz' : 'Coming Soon'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="active-quiz">
          <button className="back-btn" onClick={handleBackToQuizzes}>
            ← Back to Quizzes
          </button>
          <h1>{selectedQuiz.title}</h1>
          <p>{selectedQuiz.description}</p>

          {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
            <Quiz questions={selectedQuiz.questions} />
          ) : (
            <div className="no-questions">
              <p>This quiz is coming soon. Please check back later.</p>
              <button className="back-btn" onClick={handleBackToQuizzes}>
                Back to Quizzes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizPage;
