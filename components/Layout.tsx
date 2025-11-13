
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy; 2024 Career Connect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
