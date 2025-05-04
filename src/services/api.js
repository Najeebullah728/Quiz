/**
 * API Service for making requests to the backend
 *
 * This service provides a fallback to localStorage when the server API fails.
 */

import * as storageService from './storageService';

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  return storageService.isAuthenticated();
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

    try {
      // Try to call the logout API
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (apiError) {
      console.warn('API logout failed, using local logout:', apiError);
    }

    // Always use the storage service to logout
    storageService.logout();
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    // Still logout locally even if there's an error
    storageService.logout();
  }
};

// Documentation API
export const fetchDocumentation = async () => {
  try {
    console.log('Fetching documentation...');

    try {
      // Try to fetch from the server first
      console.log('Trying to fetch from server API...');
      const response = await fetch('/api/documentation', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Fetched ${data.length} documentation items from server`);
        return data;
      }

      console.warn('Server API failed, falling back to localStorage');
    } catch (apiError) {
      console.warn('API fetch failed, using localStorage:', apiError);
    }

    // Fallback to localStorage
    const localData = storageService.getDocumentation();
    console.log(`Fetched ${localData.length} documentation items from localStorage`);
    return localData;
  } catch (error) {
    console.error('Error fetching documentation:', error);
    // Last resort fallback
    return [];
  }
};

export const uploadDocumentation = async (title, content) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Unauthorized');
    }

    console.log(`Uploading documentation: "${title}"`);

    try {
      // Try to upload to the server first
      console.log('Trying to upload to server API...');
      const response = await fetch('/api/documentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Documentation uploaded successfully to server:', result);
        return result;
      }

      console.warn('Server API failed, falling back to localStorage');
    } catch (apiError) {
      console.warn('API upload failed, using localStorage:', apiError);
    }

    // Fallback to localStorage
    const localResult = storageService.addDocumentation(title, content);
    console.log('Documentation saved to localStorage:', localResult);
    return localResult;
  } catch (error) {
    console.error('Error uploading documentation:', error);
    handleAuthError(error);
    throw error;
  }
};

export const deleteDocumentation = async (id) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Unauthorized');
    }

    console.log(`Deleting documentation with ID: ${id}`);

    try {
      // Try to delete from the server first
      console.log('Trying to delete from server API...');
      const response = await fetch(`/api/documentation/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Documentation deleted successfully from server:', result);
        return result;
      }

      console.warn('Server API failed, falling back to localStorage');
    } catch (apiError) {
      console.warn('API delete failed, using localStorage:', apiError);
    }

    // Fallback to localStorage
    // For localStorage, we need to get all docs, filter out the one to delete, and save back
    const docs = storageService.getDocumentation();
    const updatedDocs = docs.filter(doc => doc.id !== id);
    localStorage.setItem('quiz_app_documentation', JSON.stringify(updatedDocs));
    console.log(`Documentation with ID ${id} deleted from localStorage`);

    return { success: true, id };
  } catch (error) {
    console.error('Error deleting documentation:', error);
    handleAuthError(error);
    throw error;
  }
};

// Quiz API
export const fetchQuizzes = async () => {
  try {
    console.log('Fetching quizzes...');

    try {
      // Try to fetch from the server first
      console.log('Trying to fetch quizzes from server API...');
      const response = await fetch('/api/quizzes', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Fetched ${data.length} quizzes from server`);
        return data;
      }

      console.warn('Server API failed, falling back to localStorage for quizzes');
    } catch (apiError) {
      console.warn('API fetch failed for quizzes, using localStorage:', apiError);
    }

    // Fallback to localStorage
    const localData = storageService.getQuizzes();
    console.log(`Fetched ${localData.length} quizzes from localStorage`);
    return localData;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    // Last resort fallback
    return [];
  }
};

export const createQuiz = async (title, description) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Unauthorized');
    }

    console.log(`Creating quiz: "${title}"`);

    try {
      // Try to create on the server first
      console.log('Trying to create quiz on server API...');
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Quiz created successfully on server:', result);
        return result;
      }

      console.warn('Server API failed, falling back to localStorage for quiz creation');
    } catch (apiError) {
      console.warn('API quiz creation failed, using localStorage:', apiError);
    }

    // Fallback to localStorage
    const localResult = storageService.addQuiz(title, description);
    console.log('Quiz saved to localStorage:', localResult);
    return localResult;
  } catch (error) {
    console.error('Error creating quiz:', error);
    handleAuthError(error);
    throw error;
  }
};

export const deleteQuiz = async (id) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Unauthorized');
    }

    console.log(`Deleting quiz with ID: ${id}`);

    try {
      // Try to delete from the server first
      console.log('Trying to delete from server API...');
      const response = await fetch(`/api/quizzes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Quiz deleted successfully from server:', result);
        return result;
      }

      console.warn('Server API failed, falling back to localStorage');
    } catch (apiError) {
      console.warn('API delete failed, using localStorage:', apiError);
    }

    // Fallback to localStorage
    // For localStorage, we need to get all quizzes, filter out the one to delete, and save back
    const quizzes = storageService.getQuizzes();
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
    localStorage.setItem('quiz_app_quizzes', JSON.stringify(updatedQuizzes));
    console.log(`Quiz with ID ${id} deleted from localStorage`);

    return { success: true, id };
  } catch (error) {
    console.error('Error deleting quiz:', error);
    handleAuthError(error);
    throw error;
  }
};

export const addQuestion = async (quizId, type, question, options, correctAnswer) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Unauthorized');
    }

    console.log(`Adding question to quiz ${quizId}`);

    try {
      // Try to add on the server first
      console.log('Trying to add question on server API...');
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
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Question added successfully on server:', result);
        return result;
      }

      console.warn('Server API failed, falling back to localStorage for adding question');
    } catch (apiError) {
      console.warn('API add question failed, using localStorage:', apiError);
    }

    // Fallback to localStorage
    // For localStorage, we need to update the quiz directly
    const quizzes = storageService.getQuizzes();
    const quiz = quizzes.find(q => q.id === quizId);

    if (!quiz) {
      throw new Error(`Quiz with ID ${quizId} not found`);
    }

    // Create a new question
    const newQuestion = {
      id: Date.now(), // Use timestamp as ID
      quiz_id: quizId,
      type,
      question,
      options,
      correct_answer: correctAnswer,
      created_at: new Date().toISOString()
    };

    // Add the question to the quiz
    if (!quiz.questions) {
      quiz.questions = [];
    }

    quiz.questions.push(newQuestion);

    // Save the updated quizzes
    localStorage.setItem('quiz_app_quizzes', JSON.stringify(quizzes));

    console.log('Question saved to localStorage:', newQuestion);
    return newQuestion;
  } catch (error) {
    console.error('Error adding question:', error);
    handleAuthError(error);
    throw error;
  }
};

// Upload a quiz from a JSON file
export const uploadQuizFile = async (title, description, questionsData) => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Unauthorized');
    }

    console.log(`Uploading quiz file: "${title}" with ${questionsData.length} questions`);

    try {
      // Try server API first
      // First create the quiz
      const quiz = await createQuiz(title, description);

      // Then add each question
      const addedQuestions = [];
      for (const q of questionsData) {
        try {
          const question = await addQuestion(
            quiz.id,
            q.type,
            q.question,
            q.options,
            q.correctAnswer || q.correct_answer
          );
          addedQuestions.push(question);
        } catch (questionError) {
          console.error(`Error adding question to quiz ${quiz.id}:`, questionError);
        }
      }

      console.log(`Quiz file uploaded with ${addedQuestions.length} questions`);
      return {
        ...quiz,
        questions: addedQuestions
      };
    } catch (apiError) {
      console.warn('API quiz file upload failed, using direct localStorage method:', apiError);

      // Fallback to direct localStorage method
      const newQuiz = storageService.addQuiz(title, description, questionsData.map(q => ({
        id: Date.now() + Math.floor(Math.random() * 1000), // Generate unique IDs
        quiz_id: null, // Will be updated after quiz creation
        type: q.type,
        question: q.question,
        options: q.options,
        correct_answer: q.correctAnswer || q.correct_answer,
        created_at: new Date().toISOString()
      })));

      console.log('Quiz file saved directly to localStorage:', newQuiz);
      return newQuiz;
    }
  } catch (error) {
    console.error('Error uploading quiz file:', error);
    handleAuthError(error);
    throw error;
  }
};
