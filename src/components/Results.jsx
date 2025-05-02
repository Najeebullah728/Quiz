function Results({ score, totalQuestions, userAnswers, questions, onRetry }) {
  const getDisplayAnswer = (question, answer) => {
    if (question.type === 'multipleChoice') {
      const option = question.options.find(opt => opt.id === answer);
      return option ? `${answer}) ${option.text}` : answer;
    }
    return answer;
  };

  const getScoreMessage = () => {
    const percentage = Math.round((score / totalQuestions) * 100);
    if (percentage >= 90) return "Excellent! You're a Python strings expert!";
    if (percentage >= 70) return "Great job! You have a good understanding of Python strings.";
    if (percentage >= 50) return "Good effort! Keep practicing to improve your Python string knowledge.";
    return "Keep learning! Review the Python string concepts and try again.";
  };

  return (
    <div className="results-container">
      <h2>Quiz Results</h2>
      <div className="score">
        <p>Your Score: {score} out of {totalQuestions}</p>
        <p>Percentage: {Math.round((score / totalQuestions) * 100)}%</p>
        <p className="score-message">{getScoreMessage()}</p>
      </div>

      <div className="answers-review">
        <h3>Review Your Answers:</h3>
        {questions.map((question, index) => (
          <div key={question.id} className="question-review">
            <div className="question-header">
              <span className={userAnswers[index].isCorrect ? "correct-badge" : "incorrect-badge"}>
                {userAnswers[index].isCorrect ? "✓" : "✗"}
              </span>
              <h4>Question {index + 1}</h4>
            </div>

            <p className="question-text">
              {question.question}
            </p>

            {question.type === 'coding' && (
              <pre className="code-block">
                <code>{question.question.split('```python')[1]?.split('```')[0] || ''}</code>
              </pre>
            )}

            <p className="user-answer">
              Your Answer: <span className={userAnswers[index].isCorrect ? "correct" : "incorrect"}>
                {getDisplayAnswer(question, userAnswers[index].answer)}
              </span>
            </p>

            {!userAnswers[index].isCorrect && (
              <p className="correct-answer">
                Correct Answer: <span className="correct">
                  {getDisplayAnswer(question, question.correctAnswer)}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>

      <button className="retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

export default Results;
