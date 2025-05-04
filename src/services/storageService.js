/**
 * Storage Service
 *
 * This service provides a simple interface for storing and retrieving data
 * using localStorage in the browser and memory in Node.js.
 */

import { sampleDocumentation, sampleQuizzes } from '../data/sampleData.js';

// Keys for storage
const STORAGE_KEYS = {
  DOCUMENTATION: 'quiz_app_documentation',
  QUIZZES: 'quiz_app_quizzes',
  ADMIN_AUTHENTICATED: 'adminAuthenticated',
  ADMIN_USERNAME: 'adminUsername'
};

// In-memory storage for server-side
const memoryStorage = {
  [STORAGE_KEYS.DOCUMENTATION]: JSON.stringify(sampleDocumentation),
  [STORAGE_KEYS.QUIZZES]: JSON.stringify(sampleQuizzes),
  [STORAGE_KEYS.ADMIN_AUTHENTICATED]: 'false',
  [STORAGE_KEYS.ADMIN_USERNAME]: ''
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// Get item from storage
const getItem = (key) => {
  if (isBrowser) {
    return localStorage.getItem(key);
  } else {
    return memoryStorage[key] || null;
  }
};

// Set item in storage
const setItem = (key, value) => {
  if (isBrowser) {
    localStorage.setItem(key, value);
  } else {
    memoryStorage[key] = value;
  }
};

// Remove item from storage
const removeItem = (key) => {
  if (isBrowser) {
    localStorage.removeItem(key);
  } else {
    delete memoryStorage[key];
  }
};

// Initialize storage with sample data if it doesn't exist
const initializeStorage = () => {
  if (!getItem(STORAGE_KEYS.DOCUMENTATION)) {
    setItem(STORAGE_KEYS.DOCUMENTATION, JSON.stringify(sampleDocumentation));
  }

  if (!getItem(STORAGE_KEYS.QUIZZES)) {
    setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(sampleQuizzes));
  }
};

// Documentation methods
export const getDocumentation = () => {
  try {
    initializeStorage();
    const docs = JSON.parse(getItem(STORAGE_KEYS.DOCUMENTATION) || '[]');
    console.log(`Retrieved ${docs.length} documentation items from storage`);
    return docs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error getting documentation from storage:', error);
    return [];
  }
};

export const addDocumentation = (title, content) => {
  try {
    const docs = getDocumentation();
    const newDoc = {
      id: docs.length > 0 ? Math.max(...docs.map(d => d.id)) + 1 : 1,
      title,
      content,
      created_at: new Date().toISOString()
    };

    docs.push(newDoc);
    setItem(STORAGE_KEYS.DOCUMENTATION, JSON.stringify(docs));

    console.log(`Added documentation "${title}" to storage. New count: ${docs.length}`);
    return newDoc;
  } catch (error) {
    console.error('Error adding documentation to storage:', error);
    throw new Error('Failed to save documentation. Please try again.');
  }
};

// Quiz methods
export const getQuizzes = () => {
  try {
    initializeStorage();
    const quizzes = JSON.parse(getItem(STORAGE_KEYS.QUIZZES) || '[]');
    console.log(`Retrieved ${quizzes.length} quizzes from storage`);
    return quizzes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error getting quizzes from storage:', error);
    return [];
  }
};

export const addQuiz = (title, description, questions = []) => {
  try {
    const quizzes = getQuizzes();
    const newQuiz = {
      id: quizzes.length > 0 ? Math.max(...quizzes.map(q => q.id)) + 1 : 1,
      title,
      description,
      created_at: new Date().toISOString(),
      questions
    };

    quizzes.push(newQuiz);
    setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));

    console.log(`Added quiz "${title}" to storage. New count: ${quizzes.length}`);
    return newQuiz;
  } catch (error) {
    console.error('Error adding quiz to storage:', error);
    throw new Error('Failed to save quiz. Please try again.');
  }
};

// Authentication methods
export const isAuthenticated = () => {
  return getItem(STORAGE_KEYS.ADMIN_AUTHENTICATED) === 'true';
};

export const getUsername = () => {
  return getItem(STORAGE_KEYS.ADMIN_USERNAME);
};

export const login = (username) => {
  setItem(STORAGE_KEYS.ADMIN_AUTHENTICATED, 'true');
  setItem(STORAGE_KEYS.ADMIN_USERNAME, username);
};

export const logout = () => {
  if (isBrowser) {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTHENTICATED);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USERNAME);
  } else {
    delete memoryStorage[STORAGE_KEYS.ADMIN_AUTHENTICATED];
    delete memoryStorage[STORAGE_KEYS.ADMIN_USERNAME];
  }
};

// Initialize storage when the module is imported
initializeStorage();
