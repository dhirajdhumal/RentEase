import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import './Profile.css';

function Profile() {
  const { user, setAuth } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/profile', formData);
      setAuth(data, useAuthStore.getState().token);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>
        <div className="profile-card">
          {!editing ? (
            <>
              <div className="profile-info">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>
              <button onClick={() => setEditing(true)} className="btn-primary">
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <div className="button-group">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
