import { useState } from 'react'
import './App.css'
import Quiz from './components/Quiz'
import quizQuestions from './data/questions'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>📝 Python Strings - Quiz</h1>
        <p>Test your understanding of Python Strings by answering the following questions.</p>
      </header>

      <main>
        <Quiz questions={quizQuestions} />
      </main>

      <footer>
        <p>Created with React + Vite</p>
      </footer>
    </div>
  )
}

export default App
