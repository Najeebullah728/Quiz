import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import * as storageService from './src/services/storageService.js';

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
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Documentation routes
app.get('/api/documentation', (_, res) => {
  const docs = storageService.getDocumentation();
  res.json(docs);
});

app.post('/api/documentation', (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const result = storageService.addDocumentation(title, content);
    res.json(result);
  } catch (error) {
    console.error('Error adding documentation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Quiz routes
app.get('/api/quizzes', (_, res) => {
  const quizzes = storageService.getQuizzes();
  res.json(quizzes);
});

// Serve index.html for all other routes to support client-side routing
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/admin', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/admin/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/documentation', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/quiz', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});
