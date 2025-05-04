import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="main-nav">
      <div className="nav-logo">
        <h2>Python Learning Hub</h2>
        <div className="creator-info">Created by Najeebullah</div>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/documentation" className={({ isActive }) => isActive ? 'active' : ''}>
            Documentation
          </NavLink>
        </li>
        <li>
          <NavLink to="/quiz" className={({ isActive }) => isActive ? 'active' : ''}>
            Quiz
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
