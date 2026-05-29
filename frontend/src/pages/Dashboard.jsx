import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect unauthenticated users to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="page-container">
      <h2>Dashboard</h2>
      <p>Welcome, {user?.username || 'Guest'}! Your financial overview will appear here.</p>
    </div>
  );
};

export default Dashboard;
