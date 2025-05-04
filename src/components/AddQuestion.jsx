import { useState } from 'react';

function AddQuestion({ onQuestionAdded }) {
  const [questionType, setQuestionType] = useState('multipleChoice');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' }
  ]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOptionChange = (id, value) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text: value } : option
    ));
  };

  const validateForm = () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return false;
    }

    if (questionType === 'multipleChoice') {
      // Check if all options have text
      const emptyOptions = options.filter(option => !option.text.trim());
      if (emptyOptions.length > 0) {
        setError('Please fill in all options');
        return false;
      }

      // Check if correct answer is selected
      if (!correctAnswer) {
        setError('Please select the correct answer');
        return false;
      }
    } else {
      // For other question types, check if correct answer is provided
      if (!correctAnswer.trim()) {
        setError('Please provide the correct answer');
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Create new question object
    const newQuestion = {
      id: Date.now(), // Use timestamp as a simple unique ID
      type: questionType,
      question: question.trim()
    };

    if (questionType === 'multipleChoice') {
      newQuestion.options = [...options];
      newQuestion.correctAnswer = correctAnswer;
    } else {
      newQuestion.correctAnswer = correctAnswer.trim();
    }

    // Pass the new question to parent component
    onQuestionAdded(newQuestion);

    // Show success message
    setSuccess('Question added successfully!');

    // Reset form after 2 seconds
    setTimeout(() => {
      setQuestion('');
      setOptions([
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' }
      ]);
      setCorrectAnswer('');
      setSuccess('');
    }, 2000);
  };

  return (
    <div className="add-question-container">
      <h2>Add New Question</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="questionType">Question Type:</label>
          <select 
            id="questionType" 
            value={questionType} 
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="multipleChoice">Multiple Choice</option>
            <option value="fillInTheBlank">Fill in the Blank</option>
            <option value="shortAnswer">Short Answer</option>
            <option value="coding">Coding Question</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <textarea 
            id="question" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            placeholder="Enter your question here..."
            rows="3"
          />
        </div>
        
        {questionType === 'multipleChoice' && (
          <div className="form-group">
            <label>Options:</label>
            {options.map(option => (
              <div key={option.id} className="option-input">
                <span className="option-label">{option.id})</span>
                <input 
                  type="text" 
                  value={option.text} 
                  onChange={(e) => handleOptionChange(option.id, e.target.value)} 
                  placeholder={`Option ${option.id}`}
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="correctAnswer">
            {questionType === 'multipleChoice' 
              ? 'Correct Answer (A, B, C, or D):' 
              : 'Correct Answer:'}
          </label>
          
          {questionType === 'multipleChoice' ? (
            <select 
              id="correctAnswer" 
              value={correctAnswer} 
              onChange={(e) => setCorrectAnswer(e.target.value)}
            >
              <option value="">Select correct answer</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          ) : (
            <input 
              type="text" 
              id="correctAnswer" 
              value={correctAnswer} 
              onChange={(e) => setCorrectAnswer(e.target.value)} 
              placeholder="Enter the correct answer"
            />
          )}
        </div>
        
        <button type="submit" className="add-question-btn">Add Question</button>
      </form>
    </div>
  );
}

export default AddQuestion;
