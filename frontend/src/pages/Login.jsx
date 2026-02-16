import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', formData);
      setAuth(data, data.token);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} style={{ animation: 'fadeInUp 0.6s ease' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          fontSize: '3rem'
        }}>
          🔐
        </div>
        <h2>Welcome Back</h2>
        <p style={{ 
          textAlign: 'center', 
          color: '#718096', 
          marginBottom: '30px',
          fontSize: '0.95rem'
        }}>
          Login to access your account
        </p>
        {error && <div className="error">{error}</div>}
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit" className="btn-primary">Login to Account</button>
        <p>Don't have an account? <Link to="/register">Create Account</Link></p>
      </form>
    </div>
  );
}

export default Login;
