import { useState, useEffect } from 'react';
import api from '../api/axios';
import './Dashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [pendingListings, setPendingListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchStats();
    fetchPendingListings();
    fetchAllListings();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    const { data } = await api.get('/admin/stats');
    setStats(data);
  };

  const fetchPendingListings = async () => {
    const { data } = await api.get('/admin/listings/pending');
    setPendingListings(data);
  };

  const fetchAllListings = async () => {
    const { data } = await api.get('/admin/listings');
    setAllListings(data);
  };

  const fetchUsers = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data);
  };

  const approveListing = async (id) => {
    try {
      await api.put(`/admin/listings/${id}/approve`);
      fetchPendingListings();
      fetchAllListings();
      fetchStats();
    } catch (error) {
      alert('Failed to approve listing');
    }
  };

  const toggleListingStatus = async (id) => {
    try {
      await api.put(`/admin/listings/${id}/toggle-status`);
      fetchAllListings();
    } catch (error) {
      alert('Failed to update listing status');
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle-status`);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Listings</h3>
            <p>{stats.totalListings || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p>{stats.totalBookings || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Approvals</h3>
            <p>{stats.pendingListings || 0}</p>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={activeTab === 'pending' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pendingListings.length})
          </button>
          <button 
            className={activeTab === 'all' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('all')}
          >
            All Listings ({allListings.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'pending' && (
          <div className="items-list">
            {pendingListings.length === 0 ? (
              <p>No pending listings</p>
            ) : (
              pendingListings.map((listing) => (
                <div key={listing._id} className="item-card">
                  {listing.images && listing.images.length > 0 && (
                    <img src={listing.images[0]} alt={listing.title} className="listing-thumb" />
                  )}
                  <h3>{listing.title}</h3>
                  <p>Owner: {listing.owner?.name}</p>
                  <p>Type: {listing.type} - {listing.category}</p>
                  <p>₹{listing.price}/day</p>
                  <button onClick={() => approveListing(listing._id)} className="btn-primary">
                    Approve
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'all' && (
          <div className="items-list">
            {allListings.map((listing) => (
              <div key={listing._id} className="item-card">
                {listing.images && listing.images.length > 0 && (
                  <img src={listing.images[0]} alt={listing.title} className="listing-thumb" />
                )}
                <h3>{listing.title}</h3>
                <p>Owner: {listing.owner?.name}</p>
                <p>Type: {listing.type} - {listing.category}</p>
                <p>₹{listing.price}/day</p>
                <div className="status-badges">
                  <span className={listing.isApproved ? 'badge-success' : 'badge-warning'}>
                    {listing.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  <span className={listing.availability ? 'badge-success' : 'badge-danger'}>
                    {listing.availability ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="button-group">
                  {!listing.isApproved && (
                    <button onClick={() => approveListing(listing._id)} className="btn-primary">
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => toggleListingStatus(listing._id)}
                    className={listing.availability ? 'btn-danger' : 'btn-primary'}
                  >
                    {listing.availability ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>

        <h2>Users Management</h2>
        <div className="tab-content">
          <div className="items-list">
          {users.map((user) => (
            <div key={user._id} className="item-card">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>Role: {user.role}</p>
              <button
                onClick={() => toggleUserStatus(user._id)}
                className={user.isActive ? 'btn-danger' : 'btn-primary'}
              >
                {user.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
