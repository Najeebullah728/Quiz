import { useState, useEffect } from 'react';

function Answer({ question, onAnswerSubmit }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [textAnswer, setTextAnswer] = useState('');

  // Reset form when question changes
  useEffect(() => {
    setSelectedOption('');
    setTextAnswer('');
  }, [question.id]);

  const handleSubmit = () => {
    if (question.type === 'multipleChoice') {
      if (selectedOption) {
        onAnswerSubmit(selectedOption);
      }
    } else {
      if (textAnswer.trim()) {
        onAnswerSubmit(textAnswer.trim());
      }
    }
  };

  return (
    <div className="answer-container">
      {question.type === 'multipleChoice' && (
        <div className="options">
          {question.options.map((option) => (
            <div key={option.id} className="option">
              <input
                type="radio"
                id={option.id}
                name="answer"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label htmlFor={option.id}>
                {option.id}) {option.text}
              </label>
            </div>
          ))}
        </div>
      )}

      {(question.type === 'fillInTheBlank' ||
        question.type === 'coding' ||
        question.type === 'shortAnswer') && (
        <div className="text-input">
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
        </div>
      )}

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={(question.type === 'multipleChoice' && !selectedOption) ||
                 ((question.type === 'fillInTheBlank' ||
                   question.type === 'coding' ||
                   question.type === 'shortAnswer') && !textAnswer.trim())}
      >
        Submit Answer
      </button>
    </div>
  );
}

export default Answer;
