function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Python Learning Hub</h1>
        <p>Your one-stop resource for learning Python programming</p>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h3>📚 Documentation</h3>
          <p>Access comprehensive Python documentation with examples and explanations.</p>
          <a href="/documentation" className="feature-link">Browse Documentation</a>
        </div>

        <div className="feature-card">
          <h3>🧠 Interactive Quizzes</h3>
          <p>Test your knowledge with our interactive quizzes on various Python topics.</p>
          <a href="/quiz" className="feature-link">Take a Quiz</a>
        </div>

        <div className="feature-card">
          <h3>🔄 Regular Updates</h3>
          <p>Our content is regularly updated with new documentation and quizzes.</p>
          <a href="/documentation" className="feature-link">Learn More</a>
        </div>
      </div>

      <div className="getting-started">
        <h2>Getting Started</h2>
        <p>New to Python? Start with our beginner-friendly documentation and then test your knowledge with quizzes.</p>
        <div className="action-buttons">
          <a href="/documentation" className="primary-btn">Start Learning</a>
          <a href="quiz/" className="secondary-btn">Test Your Skills</a>
        </div>
      </div>
    </div>
  );
}

export default Home;
