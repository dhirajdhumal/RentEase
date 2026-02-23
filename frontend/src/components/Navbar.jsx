import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">RentEase</Link>
        <div className="nav-links">
          <Link to="/listings">Browse</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              {(user.role === 'owner' || user.role === 'customer') && (
                <Link to="/dashboard">Dashboard</Link>
              )}
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
