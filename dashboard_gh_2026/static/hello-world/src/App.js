import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import './App.css';

function App(){
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="app-root">
            <Header onToggleSidebar={() => setSidebarOpen(s => !s)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Dashboard />
        </div>
    );
}

export default App;
