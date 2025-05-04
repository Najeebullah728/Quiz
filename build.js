import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting build process...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('Created dist directory');
}

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

try {
  // Run Vite build
  console.log('Building frontend with Vite...');
  execSync('vite build', { stdio: 'inherit' });
  console.log('Frontend build completed successfully');

  // Copy necessary files for Vercel deployment
  console.log('Copying files for Vercel deployment...');
  
  // Ensure src/data directory exists
  const srcDataDir = path.join(__dirname, 'src', 'data');
  if (!fs.existsSync(srcDataDir)) {
    fs.mkdirSync(srcDataDir, { recursive: true });
    console.log('Created src/data directory');
  }

  console.log('Build process completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
