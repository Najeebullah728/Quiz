import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
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

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const dbPath = path.join(dataDir, 'quiz_app.db');
const db = new Database(dbPath);

// Create tables if they don't exist
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
const defaultUsername = process.env.ADMIN_USERNAME || 'Njeebullah@12';
const defaultPassword = process.env.ADMIN_PASSWORD || 'Najeebullah@123';
const checkAdmin = db.prepare('SELECT * FROM admin_settings WHERE id = 1').get();

if (!checkAdmin) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(defaultPassword, salt);
  db.prepare('INSERT INTO admin_settings (id, username, password_hash) VALUES (?, ?, ?)').run(1, defaultUsername, hash);
  console.log(`Default admin credentials created: username: ${defaultUsername}`);
} else {
  // Only update credentials if in development mode or if explicitly set to update
  if (process.env.NODE_ENV === 'development' || process.env.UPDATE_ADMIN_CREDENTIALS === 'true') {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(defaultPassword, salt);
    db.prepare('UPDATE admin_settings SET username = ?, password_hash = ? WHERE id = 1').run(defaultUsername, hash);
    console.log(`Admin credentials updated to: username: ${defaultUsername}`);
  }
}

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// API Routes

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const admin = db.prepare('SELECT * FROM admin_settings WHERE username = ?').get(username);

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

  const admin = db.prepare('SELECT * FROM admin_settings WHERE username = ?').get(req.session.username);

  if (admin && bcrypt.compareSync(currentPassword, admin.password_hash)) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    // If username is being changed too
    if (newUsername && newUsername !== req.session.username) {
      db.prepare('UPDATE admin_settings SET username = ?, password_hash = ? WHERE id = 1').run(newUsername, hash);
      req.session.username = newUsername;
    } else {
      db.prepare('UPDATE admin_settings SET password_hash = ? WHERE id = 1').run(hash);
    }

    res.json({ success: true, username: newUsername || req.session.username });
  } else {
    res.status(401).json({ error: 'Current password is incorrect' });
  }
});

// Documentation routes
app.get('/api/documentation', (_, res) => {
  const docs = db.prepare('SELECT * FROM documentation ORDER BY created_at DESC').all();
  res.json(docs);
});

app.post('/api/documentation', requireAuth, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const result = db.prepare('INSERT INTO documentation (title, content) VALUES (?, ?)').run(title, content);
  res.json({ id: result.lastInsertRowid, title, content });
});

// Quiz routes
app.get('/api/quizzes', (_, res) => {
  const quizzes = db.prepare('SELECT * FROM quizzes ORDER BY created_at DESC').all();

  // Get questions for each quiz
  const quizzesWithQuestions = quizzes.map(quiz => {
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

  res.json(quizzesWithQuestions);
});

app.post('/api/quizzes', requireAuth, (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const result = db.prepare('INSERT INTO quizzes (title, description) VALUES (?, ?)').run(title, description);
  res.json({ id: result.lastInsertRowid, title, description, questions: [] });
});

// Question routes
app.post('/api/questions', requireAuth, (req, res) => {
  const { quiz_id, type, question, options, correct_answer } = req.body;

  if (!type || !question || !correct_answer) {
    return res.status(400).json({ error: 'Type, question, and correct answer are required' });
  }

  // Convert options to JSON string if it's an array
  const optionsStr = options ? JSON.stringify(options) : null;

  const result = db.prepare(
    'INSERT INTO questions (quiz_id, type, question, options, correct_answer) VALUES (?, ?, ?, ?, ?)'
  ).run(quiz_id, type, question, optionsStr, correct_answer);

  res.json({
    id: result.lastInsertRowid,
    quiz_id,
    type,
    question,
    options,
    correct_answer
  });
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Simple route to check if server is running
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Catch-all route for client-side routing
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
