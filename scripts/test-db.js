import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`Created data directory: ${dataDir}`);
}

// Initialize SQLite database
const dbPath = path.join(dataDir, 'quiz_app.db');
console.log(`Connecting to database at: ${dbPath}`);

try {
  const db = new Database(dbPath);
  console.log('Database connection successful!');
  
  // Test query
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables in database:');
  tables.forEach(table => {
    console.log(`- ${table.name}`);
  });
  
  // Close the database connection
  db.close();
  console.log('Database connection closed.');
} catch (error) {
  console.error('Error connecting to database:', error);
}
