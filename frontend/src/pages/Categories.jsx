import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Categories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Redirect unauthenticated users
  React.useEffect(() => {
    if (!user) {
      showToast('Please log in to view categories.', 'error');
      navigate('/login');
    }
  }, [user, navigate, showToast]);

  return (
    <div className="page-container">
      <h2>Categories</h2>
      <p>This page will list your expense categories. Implementation coming soon.</p>
    </div>
  );
};

export default Categories;
