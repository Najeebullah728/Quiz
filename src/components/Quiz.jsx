import { useState } from 'react';
import Answer from './Answer';
import Results from './Results';

function Quiz({ questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState({ answer: '', isCorrect: false });

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSubmit = (answer) => {
    const isCorrect = checkAnswer(answer, currentQuestion);

    const newAnswer = {
      questionId: currentQuestion.id,
      answer,
      isCorrect
    };

    setLastAnswer(newAnswer);
    setShowFeedback(true);

    if (isCorrect) {
      setScore(score + 1);
    }

    // Add the answer to our list
    setUserAnswers([...userAnswers, newAnswer]);
  };

  const moveToNextQuestion = () => {
    setShowFeedback(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const checkAnswer = (userAnswer, question) => {
    if (question.type === 'multipleChoice') {
      return userAnswer === question.correctAnswer;
    } else if (question.type === 'coding' && question.id === 6) {
      // Special case for the string joining question - accept multiple valid answers
      const validAnswers = [
        '"good" + " " + "night"',
        '"good"+" "+"night"',
        '"good" +" "+ "night"',
        '"good" + " " +"night"',
        'f"good night"',
        '"good night"',
        "\"good\" + \" \" + \"night\"",
        "\"good\"+\" \"+\"night\"",
        "\"good\" +\" \"+ \"night\"",
        "\"good\" + \" \" +\"night\"",
        "f\"good night\"",
        "\"good night\"",
        "'good' + ' ' + 'night'",
        "'good'+' '+'night'",
        "'good' +' '+ 'night'",
        "'good' + ' ' +'night'",
        "f'good night'",
        "'good night'",
        "print('Good' + ' ' + 'Night')"
      ];
      return validAnswers.some(answer =>
        userAnswer.toLowerCase().replace(/\s+/g, '') === answer.toLowerCase().replace(/\s+/g, '')
      );
    } else {
      // For text-based answers, we'll do a simple case-insensitive comparison
      // In a real app, you might want more sophisticated answer checking
      return userAnswer.toLowerCase().replace(/\(\)$/, '()') === question.correctAnswer.toLowerCase();
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
    setShowFeedback(false);
  };

  const getCorrectAnswerDisplay = () => {
    if (currentQuestion.type === 'multipleChoice') {
      const option = currentQuestion.options.find(opt => opt.id === currentQuestion.correctAnswer);
      return `${currentQuestion.correctAnswer}) ${option.text}`;
    } else {
      return currentQuestion.correctAnswer;
    }
  };

  if (showResults) {
    return (
      <Results
        score={score}
        totalQuestions={questions.length}
        userAnswers={userAnswers}
        questions={questions}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="quiz-container">
      <div className="progress">
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="question">
        <h3>
          {currentQuestion.type === 'multipleChoice' && 'Multiple Choice:'}
          {currentQuestion.type === 'fillInTheBlank' && 'Fill in the Blank:'}
          {currentQuestion.type === 'coding' && 'Coding Question:'}
          {currentQuestion.type === 'shortAnswer' && 'Short Answer:'}
        </h3>
        <p className="question-text">{currentQuestion.question}</p>

        {currentQuestion.type === 'coding' && (
          <pre className="code-block">
            <code>{currentQuestion.question.split('```python')[1]?.split('```')[0] || ''}</code>
          </pre>
        )}
      </div>

      {!showFeedback ? (
        <Answer
          question={currentQuestion}
          onAnswerSubmit={handleAnswerSubmit}
        />
      ) : (
        <div className="feedback-container">
          <div className={`feedback ${lastAnswer.isCorrect ? 'correct' : 'incorrect'}`}>
            <h3>{lastAnswer.isCorrect ? '✅ Correct!' : '❌ Wrong Answer'}</h3>
            <p>
              Your answer: <span className={lastAnswer.isCorrect ? 'correct' : 'incorrect'}>
                {lastAnswer.answer}
              </span>
            </p>
            {!lastAnswer.isCorrect && (
              <>
                <p>
                  Correct answer: <span className="correct">{getCorrectAnswerDisplay()}</span>
                </p>
                <p className="owner-message">
                  Your answer is not correct. This quiz was created by Najeebullah.
                </p>
              </>
            )}
          </div>
          <button className="next-btn" onClick={moveToNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
