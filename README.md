# Quiz Website

A full-stack quiz application with documentation and quiz functionality. Built with React, Express, and SQLite.

## Features

- Interactive quizzes with multiple question types
- Documentation section for learning materials
- Admin panel for managing content
- Authentication system
- Mobile-responsive design

## Tech Stack

- **Frontend**: React, React Router, CSS
- **Backend**: Express.js, SQLite (better-sqlite3)
- **Authentication**: Express-session, bcrypt

## Deployment on Vercel

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Git](https://git-scm.com/) installed on your machine
3. [Node.js](https://nodejs.org/) (v16 or later) installed on your machine

### Deployment Steps

1. **Push your code to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/quiz-website.git
   git push -u origin main
   ```

2. **Connect to Vercel**

   - Go to [Vercel](https://vercel.com) and sign in
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Other
     - Build Command: `npm run vercel-build`
     - Output Directory: `dist`
   - Add Environment Variables:
     - `NODE_ENV`: `production`
     - `SESSION_SECRET`: (generate a random string)
   - Click "Deploy"

3. **Verify Deployment**

   - Once deployment is complete, Vercel will provide you with a URL
   - Visit the URL to ensure your application is working correctly

## Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/quiz-website.git
   cd quiz-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev:full
   ```

4. **Open your browser**

   Navigate to [http://localhost:5173](http://localhost:5173)

## Admin Access

Default admin credentials:
- Username: Njeebullah@12
- Password: Najeebullah@123

## License

This project is licensed under the MIT License.
