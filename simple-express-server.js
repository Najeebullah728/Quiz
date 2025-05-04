import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data
const sampleData = {
  documentation: [
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
  ],
  quizzes: [
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
          options: JSON.stringify([
            { id: 'A', text: 'H' },
            { id: 'B', text: 'e' },
            { id: 'C', text: 'l' },
            { id: 'D', text: 'o' }
          ]),
          correct_answer: 'B',
          created_at: new Date().toISOString()
        }
      ]
    }
  ]
};

// In-memory database
const db = {
  documentation: [...sampleData.documentation],
  quizzes: [...sampleData.quizzes]
};

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Documentation routes
app.get('/api/documentation', (req, res) => {
  res.json(db.documentation);
});

app.post('/api/documentation', (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const newDoc = {
      id: db.documentation.length > 0 ? Math.max(...db.documentation.map(d => d.id)) + 1 : 1,
      title,
      content,
      created_at: new Date().toISOString()
    };

    db.documentation.push(newDoc);
    console.log(`Added documentation: ${title}`);

    res.json(newDoc);
  } catch (error) {
    console.error('Error adding documentation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete documentation
app.delete('/api/documentation/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Received request to delete documentation with ID: ${id}`);

    if (isNaN(id)) {
      console.log('Invalid ID format');
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const docIndex = db.documentation.findIndex(doc => doc.id === id);
    console.log(`Documentation index: ${docIndex}`);

    if (docIndex === -1) {
      console.log('Documentation not found');
      return res.status(404).json({ error: 'Documentation not found' });
    }

    const deletedDoc = db.documentation.splice(docIndex, 1)[0];
    console.log(`Deleted documentation: ${deletedDoc.title}`);

    res.json({ success: true, message: 'Documentation deleted successfully', id });
  } catch (error) {
    console.error('Error deleting documentation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Quiz routes
app.get('/api/quizzes', (req, res) => {
  res.json(db.quizzes);
});

// Delete quiz
app.delete('/api/quizzes/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Received request to delete quiz with ID: ${id}`);

    if (isNaN(id)) {
      console.log('Invalid ID format');
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const quizIndex = db.quizzes.findIndex(quiz => quiz.id === id);
    console.log(`Quiz index: ${quizIndex}`);

    if (quizIndex === -1) {
      console.log('Quiz not found');
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const deletedQuiz = db.quizzes.splice(quizIndex, 1)[0];
    console.log(`Deleted quiz: ${deletedQuiz.title}`);

    res.json({ success: true, message: 'Quiz deleted successfully', id });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin login route (simplified)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Hardcoded credentials for simplicity
  if (username === 'Najeebullah@12' && password === 'path="Najeebullah@123"') {
    res.json({ success: true, username });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Admin logout route
app.post('/api/admin/logout', (req, res) => {
  res.json({ success: true });
});

// Serve index.html for client-side routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/documentation', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Catch-all route for admin routes
app.use('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Simple Express server running on port ${PORT}`);
});
