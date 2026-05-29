import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const location = useLocation();

  // Apply theme attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Convert pathname to dynamic title labels
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/transactions')) return 'Transactions';
    if (path.startsWith('/categories')) return 'Categories';
    if (path.startsWith('/profile')) return 'My Profile';
    return 'Finance Tracker';
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title={getPageTitle()} theme={theme} toggleTheme={toggleTheme} />
        <main className="content-body animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
