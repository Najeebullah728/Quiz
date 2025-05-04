import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

function Layout() {
  return (
    <div className="app-layout">
      <Navigation />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="main-footer">
        <p>Python Learning Hub © {new Date().getFullYear()}</p>
        <p className="creator-attribution">Created and maintained by Najeebullah</p>
      </footer>
    </div>
  );
}

export default Layout;
