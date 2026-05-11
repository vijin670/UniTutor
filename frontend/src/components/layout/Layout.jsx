import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AIPanel from '../chat/AIPanel';

// 3-Column Layout: Sidebar (Left), Dashboard (Center), AI (Right)
const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {children}
      </main>
      <AIPanel />
    </div>
  );
};

export default Layout;
