import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Configure session middleware
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
  secret: process.env.SESSION_SECRET || 'najeebullah-quiz-app-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: isProduction, // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isProduction ? 'none' : 'lax' // Required for cross-site cookies in production
  }
}));

// Default admin credentials
const defaultUsername = process.env.ADMIN_USERNAME || 'Najeebullah@12';
const defaultPassword = process.env.ADMIN_PASSWORD || 'path="Najeebullah@123"';

// Database setup - use different approaches for development and production
let db;

// Import memory database for production
import('./src/data/memoryDb.js').then(module => {
  if (isProduction) {
    // In production (Vercel), use in-memory database
    console.log('Using in-memory database for production');
    db = module.default;
    console.log('Memory database loaded successfully');
  } else {
    // In development, try to use SQLite first
    try {
      console.log('Using SQLite database for development');
      
      // Ensure data directory exists
      const dataDir = path.join(__dirname, 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Initialize SQLite database
      const Database = require('better-sqlite3');
      const dbPath = path.join(dataDir, 'quiz_app.db');
      db = new Database(dbPath);
      
      // Create tables
      db.exec(`
        CREATE TABLE IF NOT EXISTS admin_settings (
          id INTEGER PRIMARY KEY,
          username TEXT NOT NULL,
          password_hash TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS documentation (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS quizzes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          quiz_id INTEGER,
          type TEXT NOT NULL,
          question TEXT NOT NULL,
          options TEXT,
          correct_answer TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
        );
      `);
      
      // Check if default admin credentials exist, if not create them
      const checkAdmin = db.prepare('SELECT * FROM admin_settings WHERE id = 1').get();
      if (!checkAdmin) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(defaultPassword, salt);
        db.prepare('INSERT INTO admin_settings (id, username, password_hash) VALUES (?, ?, ?)').run(1, defaultUsername, hash);
        console.log(`Default admin credentials created: username: ${defaultUsername}`);
      } else if (process.env.UPDATE_ADMIN_CREDENTIALS === 'true') {
        // Only update credentials if explicitly set to update
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(defaultPassword, salt);
        db.prepare('UPDATE admin_settings SET username = ?, password_hash = ? WHERE id = 1').run(defaultUsername, hash);
        console.log(`Admin credentials updated to: username: ${defaultUsername}`);
      }
      
      console.log('SQLite database initialized successfully');
    } catch (err) {
      console.error('Failed to initialize SQLite database:', err);
      // Fallback to memory database if SQLite fails
      db = module.default;
      console.log('Fallback to memory database');
    }
  }
  
  // Set up API routes once database is ready
  setupApiRoutes();
}).catch(err => {
  console.error('Failed to load database:', err);
});

// Function to set up API routes
function setupApiRoutes() {
  // Authentication middleware
  const requireAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  // Admin login
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    let admin;
    if (isProduction) {
      admin = db.getAdminByUsername(username);
    } else {
      admin = db.prepare('SELECT * FROM admin_settings WHERE username = ?').get(username);
    }

    if (admin && bcrypt.compareSync(password, admin.password_hash)) {
      req.session.isAuthenticated = true;
      req.session.username = username;
      res.json({ success: true, username });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });

  // Admin logout
  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
  });

  // Change admin password
  app.post('/api/admin/change-password', requireAuth, (req, res) => {
    const { currentPassword, newPassword, newUsername } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    let admin;
    if (isProduction) {
      admin = db.getAdminByUsername(req.session.username);
    } else {
      admin = db.prepare('SELECT * FROM admin_settings WHERE username = ?').get(req.session.username);
    }

    if (admin && bcrypt.compareSync(currentPassword, admin.password_hash)) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);

      // If username is being changed too
      if (newUsername && newUsername !== req.session.username) {
        if (isProduction) {
          db.updateAdminCredentials(1, newUsername, hash);
        } else {
          db.prepare('UPDATE admin_settings SET username = ?, password_hash = ? WHERE id = 1').run(newUsername, hash);
        }
        req.session.username = newUsername;
      } else {
        if (isProduction) {
          db.updateAdminCredentials(1, req.session.username, hash);
        } else {
          db.prepare('UPDATE admin_settings SET password_hash = ? WHERE id = 1').run(hash);
        }
      }

      res.json({ success: true, username: newUsername || req.session.username });
    } else {
      res.status(401).json({ error: 'Current password is incorrect' });
    }
  });

  // Documentation routes
  app.get('/api/documentation', (_, res) => {
    let docs;
    if (isProduction) {
      docs = db.getAllDocumentation();
    } else {
      docs = db.prepare('SELECT * FROM documentation ORDER BY created_at DESC').all();
    }
    res.json(docs);
  });

  app.post('/api/documentation', requireAuth, (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    let result;
    if (isProduction) {
      result = db.addDocumentation(title, content);
    } else {
      result = db.prepare('INSERT INTO documentation (title, content) VALUES (?, ?)').run(title, content);
      result = { id: result.lastInsertRowid, title, content };
    }
    res.json(result);
  });

  // Quiz routes
  app.get('/api/quizzes', (_, res) => {
    let quizzes;
    if (isProduction) {
      quizzes = db.getAllQuizzes();
    } else {
      quizzes = db.prepare('SELECT * FROM quizzes ORDER BY created_at DESC').all();
      
      // Get questions for each quiz
      quizzes = quizzes.map(quiz => {
        const questions = db.prepare('SELECT * FROM questions WHERE quiz_id = ?').all(quiz.id);

        // Parse options for multiple choice questions
        const parsedQuestions = questions.map(q => {
          if (q.type === 'multipleChoice' && q.options) {
            return { ...q, options: JSON.parse(q.options) };
          }
          return q;
        });

        return { ...quiz, questions: parsedQuestions };
      });
    }
    res.json(quizzes);
  });

  app.post('/api/quizzes', requireAuth, (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    let result;
    if (isProduction) {
      result = db.addQuiz(title, description);
    } else {
      result = db.prepare('INSERT INTO quizzes (title, description) VALUES (?, ?)').run(title, description);
      result = { id: result.lastInsertRowid, title, description, questions: [] };
    }
    res.json(result);
  });

  // Question routes
  app.post('/api/questions', requireAuth, (req, res) => {
    const { quiz_id, type, question, options, correct_answer } = req.body;

    if (!type || !question || !correct_answer) {
      return res.status(400).json({ error: 'Type, question, and correct answer are required' });
    }

    let result;
    if (isProduction) {
      result = db.addQuestion(quiz_id, type, question, options, correct_answer);
    } else {
      // Convert options to JSON string if it's an array
      const optionsStr = options ? JSON.stringify(options) : null;

      result = db.prepare(
        'INSERT INTO questions (quiz_id, type, question, options, correct_answer) VALUES (?, ?, ?, ?, ?)'
      ).run(quiz_id, type, question, optionsStr, correct_answer);

      result = {
        id: result.lastInsertRowid,
        quiz_id,
        type,
        question,
        options,
        correct_answer
      };
    }
    res.json(result);
  });

  // Simple route to check if server is running
  app.get('/api/health', (_, res) => {
    res.json({ status: 'ok', production: isProduction });
  });

  // Catch-all route for client-side routing
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
