import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', formData);
      setAuth(data, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          ✨
        </div>
        <h2>Create Account</h2>
        <p style={{ 
          textAlign: 'center', 
          color: '#718096', 
          marginBottom: '30px',
          fontSize: '0.95rem'
        }}>
          Join RentEase today
        </p>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          style={{ fontWeight: '600' }}
        >
          <option value="customer">👤 Customer (Rent Items)</option>
          <option value="owner">🏢 Owner (List Items)</option>
        </select>
        <button type="submit" className="btn-primary">Create Account</button>
        <p>Already have an account? <Link to="/login">Sign In</Link></p>
      </form>
    </div>
  );
}

export default Register;
