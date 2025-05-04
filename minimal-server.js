import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Sample data for documentation and quizzes
const sampleDocumentation = [
  {
    id: 1,
    title: 'Python Strings',
    content: `# Python Strings\n\nStrings in Python are sequences of characters enclosed in quotes.`,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Python Lists',
    content: `# Python Lists\n\nLists in Python are ordered, mutable collections of items.`,
    created_at: new Date().toISOString()
  }
];

const sampleQuizzes = [
  {
    id: 1,
    title: 'Python Strings Quiz',
    description: 'Test your understanding of Python strings with this quiz.',
    created_at: new Date().toISOString(),
    questions: [
      {
        id: 1,
        quiz_id: 1,
        type: 'multipleChoice',
        question: 'What will be the output of the following Python code?\n\nprint("Hello"[1])',
        options: [
          { id: 'A', text: 'H' },
          { id: 'B', text: 'e' },
          { id: 'C', text: 'l' },
          { id: 'D', text: 'o' }
        ],
        correct_answer: 'B',
        created_at: new Date().toISOString()
      }
    ]
  }
];

// In-memory storage
let documentation = [...sampleDocumentation];
let quizzes = [...sampleQuizzes];

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Simple route to check if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Documentation routes
app.get('/api/documentation', (req, res) => {
  res.json(documentation);
});

app.post('/api/documentation', (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const newDoc = {
      id: documentation.length > 0 ? Math.max(...documentation.map(d => d.id)) + 1 : 1,
      title,
      content,
      created_at: new Date().toISOString()
    };

    documentation.push(newDoc);
    console.log(`Added documentation: ${title}`);

    res.json(newDoc);
  } catch (error) {
    console.error('Error adding documentation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Quiz routes
app.get('/api/quizzes', (req, res) => {
  res.json(quizzes);
});

// Serve index.html for client-side routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/admin/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/documentation', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});
