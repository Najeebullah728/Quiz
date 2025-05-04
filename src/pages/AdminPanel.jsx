import { useState, useEffect } from 'react';
import AddQuestion from '../components/AddQuestion';
import { uploadDocumentation, createQuiz, addQuestion, uploadQuizFile } from '../services/api';

function AdminPanel({ activeTab: initialTab = 'documentation' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizFile, setQuizFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
  const [customQuestions, setCustomQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update active tab when prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleDocumentationSubmit = async (e) => {
    e.preventDefault();

    if (!docTitle.trim() || !docContent.trim()) {
      setUploadStatus({
        type: 'error',
        message: 'Please fill in all fields.'
      });
      return;
    }

    setIsLoading(true);
    setUploadStatus({ type: '', message: '' });

    try {
      // Make the API call to upload documentation
      await uploadDocumentation(docTitle.trim(), docContent.trim());

      // Show success message
      setUploadStatus({
        type: 'success',
        message: `Documentation "${docTitle}" uploaded successfully!`
      });

      // Reset form
      setDocTitle('');
      setDocContent('');
    } catch (error) {
      console.error('Error uploading documentation:', error);
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to upload documentation. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    if (!quizTitle.trim() || !quizFile) {
      setUploadStatus({
        type: 'error',
        message: 'Please fill in all fields and select a file.'
      });
      return;
    }

    setIsLoading(true);
    setUploadStatus({ type: '', message: '' });

    try {
      // Read the JSON file
      const fileReader = new FileReader();

      fileReader.onload = async (event) => {
        try {
          const questionsData = JSON.parse(event.target.result);

          if (!Array.isArray(questionsData)) {
            throw new Error('Invalid quiz format. The file should contain an array of questions.');
          }

          // Create a default description if none is provided
          const description = quizDescription.trim() || `Quiz about ${quizTitle}`;

          // Upload the quiz with questions
          await uploadQuizFile(quizTitle.trim(), description, questionsData);

          // Show success message
          setUploadStatus({
            type: 'success',
            message: `Quiz "${quizTitle}" uploaded successfully!`
          });

          // Reset form
          setQuizTitle('');
          setQuizDescription('');
          setQuizFile(null);

        } catch (parseError) {
          console.error('Error parsing quiz file:', parseError);
          setUploadStatus({
            type: 'error',
            message: 'Invalid JSON format. Please check your file and try again.'
          });
        } finally {
          setIsLoading(false);
        }
      };

      fileReader.onerror = () => {
        setUploadStatus({
          type: 'error',
          message: 'Error reading file. Please try again.'
        });
        setIsLoading(false);
      };

      fileReader.readAsText(quizFile);

    } catch (error) {
      console.error('Error uploading quiz:', error);
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to upload quiz. Please try again.'
      });
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setQuizFile(e.target.files[0]);
    }
  };

  const handleQuestionAdded = (newQuestion) => {
    setCustomQuestions([...customQuestions, newQuestion]);
    setUploadStatus({
      type: 'success',
      message: 'Question added successfully!'
    });

    // Clear the status message after 3 seconds
    setTimeout(() => {
      setUploadStatus({ type: '', message: '' });
    }, 3000);
  };

  const handleSaveCustomQuiz = async () => {
    if (customQuestions.length === 0) {
      setUploadStatus({
        type: 'error',
        message: 'Please add at least one question to the quiz.'
      });
      return;
    }

    if (!quizTitle.trim()) {
      setUploadStatus({
        type: 'error',
        message: 'Please enter a title for the quiz.'
      });
      return;
    }

    setIsLoading(true);
    setUploadStatus({ type: '', message: '' });

    try {
      // Create a new quiz
      const description = quizDescription.trim() || `Custom quiz about ${quizTitle}`;
      const quiz = await createQuiz(quizTitle.trim(), description);

      // Add each question to the quiz
      for (const question of customQuestions) {
        await addQuestion(
          quiz.id,
          question.type,
          question.question,
          question.type === 'multipleChoice' ? question.options : null,
          question.correctAnswer
        );
      }

      // Show success message
      setUploadStatus({
        type: 'success',
        message: `Custom quiz "${quizTitle}" saved successfully!`
      });

      // Reset form
      setQuizTitle('');
      setQuizDescription('');
      setCustomQuestions([]);
    } catch (error) {
      console.error('Error saving custom quiz:', error);
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to save custom quiz. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === 'documentation' ? 'active' : ''}
          onClick={() => setActiveTab('documentation')}
        >
          Documentation Upload
        </button>
        <button
          className={activeTab === 'quiz' ? 'active' : ''}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz Upload
        </button>
        <button
          className={activeTab === 'custom-quiz' ? 'active' : ''}
          onClick={() => setActiveTab('custom-quiz')}
        >
          Custom Quiz
        </button>
      </div>

      {uploadStatus.message && (
        <div className={`upload-status ${uploadStatus.type}`}>
          {uploadStatus.message}
        </div>
      )}

      {activeTab === 'documentation' && (
        <div className="upload-section">
          <h2>Upload Documentation</h2>
          <form onSubmit={handleDocumentationSubmit}>
            <div className="form-group">
              <label htmlFor="docTitle">Title:</label>
              <input
                type="text"
                id="docTitle"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Enter documentation title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="docContent">Content (Markdown):</label>
              <textarea
                id="docContent"
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                placeholder="Enter documentation content in Markdown format"
                rows="15"
              />
            </div>

            <button type="submit" className="upload-btn">Upload Documentation</button>
          </form>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="upload-section">
          <h2>Upload Quiz</h2>
          <form onSubmit={handleQuizSubmit}>
            <div className="form-group">
              <label htmlFor="quizTitle">Quiz Title:</label>
              <input
                type="text"
                id="quizTitle"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quizDescription">Quiz Description:</label>
              <textarea
                id="quizDescription"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Enter a brief description of the quiz"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quizFile">Quiz File (JSON):</label>
              <input
                type="file"
                id="quizFile"
                accept=".json"
                onChange={handleFileChange}
                required
              />
              <small>Upload a JSON file containing quiz questions and answers.</small>
            </div>

            <button
              type="submit"
              className="upload-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload Quiz'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'custom-quiz' && (
        <div className="upload-section">
          <h2>Create Custom Quiz</h2>

          <div className="quiz-details">
            <div className="form-group">
              <label htmlFor="customQuizTitle">Quiz Title:</label>
              <input
                type="text"
                id="customQuizTitle"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="customQuizDescription">Quiz Description:</label>
              <textarea
                id="customQuizDescription"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Enter a brief description of the quiz"
                rows="3"
              />
            </div>
          </div>

          <div className="custom-quiz-info">
            <p>Add questions to create a custom quiz. These questions will be available to users.</p>
            <p className="question-count">Current questions: {customQuestions.length}</p>
          </div>

          <div className="add-question-wrapper">
            <AddQuestion onQuestionAdded={handleQuestionAdded} />
          </div>

          {customQuestions.length > 0 && (
            <div className="questions-preview">
              <h3>Added Questions:</h3>
              <ul className="questions-list">
                {customQuestions.map((question, index) => (
                  <li key={question.id} className="question-item">
                    <div className="question-number">Q{index + 1}</div>
                    <div className="question-content">
                      <p><strong>{question.type === 'multipleChoice' ? 'Multiple Choice' :
                                  question.type === 'fillInTheBlank' ? 'Fill in the Blank' :
                                  question.type === 'coding' ? 'Coding' : 'Short Answer'}</strong></p>
                      <p>{question.question}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="save-quiz-container">
                <button
                  onClick={handleSaveCustomQuiz}
                  className="save-quiz-btn"
                  disabled={isLoading || !quizTitle.trim()}
                >
                  {isLoading ? 'Saving...' : 'Save Quiz'}
                </button>
                {!quizTitle.trim() && (
                  <p className="save-quiz-hint">Please enter a title for your quiz before saving.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
