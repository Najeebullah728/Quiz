/**
 * API Service for making requests to the backend
 */

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('adminAuthenticated') === 'true';
};

// Helper function to handle authentication errors
const handleAuthError = (error) => {
  // If unauthorized, redirect to login
  if (error.message === 'Unauthorized') {
    // Save current URL for redirect after login
    localStorage.setItem('adminRedirectUrl', window.location.pathname);
    // Redirect to login page
    window.location.href = '/admin';
  }
  throw error;
};

// Admin logout
export const logout = async () => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      return;
    }

    // Call the logout API
    const response = await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include'
    });

    // Clear local storage regardless of API response
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUsername');

    return response.ok;
  } catch (error) {
    console.error('Error logging out:', error);
    // Clear local storage even if API call fails
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUsername');
  }
};

// Documentation API
export const fetchDocumentation = async () => {
  try {
    const response = await fetch('/api/documentation');
    if (!response.ok) {
      throw new Error('Failed to fetch documentation');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching documentation:', error);
    throw error;
  }
};

export const uploadDocumentation = async (title, content) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Unauthorized');
    }

    const response = await fetch('/api/documentation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
      // Include credentials to send cookies
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload documentation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading documentation:', error);
    handleAuthError(error);
  }
};

// Quiz API
export const fetchQuizzes = async () => {
  try {
    const response = await fetch('/api/quizzes');
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

export const createQuiz = async (title, description) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Unauthorized');
    }

    const response = await fetch('/api/quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
      // Include credentials to send cookies
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create quiz');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating quiz:', error);
    handleAuthError(error);
  }
};

export const addQuestion = async (quizId, type, question, options, correctAnswer) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Unauthorized');
    }

    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quiz_id: quizId,
        type,
        question,
        options,
        correct_answer: correctAnswer
      }),
      // Include credentials to send cookies
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add question');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding question:', error);
    handleAuthError(error);
  }
};

// Upload a quiz from a JSON file
export const uploadQuizFile = async (title, description, questionsData) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Unauthorized');
    }

    // First create the quiz
    const quiz = await createQuiz(title, description);

    // Then add each question
    const addedQuestions = [];
    for (const q of questionsData) {
      const question = await addQuestion(
        quiz.id,
        q.type,
        q.question,
        q.options,
        q.correctAnswer || q.correct_answer
      );
      addedQuestions.push(question);
    }

    return {
      ...quiz,
      questions: addedQuestions
    };
  } catch (error) {
    console.error('Error uploading quiz file:', error);
    handleAuthError(error);
  }
};
