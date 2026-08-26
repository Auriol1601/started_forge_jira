import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProgramPage from './components/ProgramPage';
import './App.css';

function App(){
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="app-root">
            <Header onToggleSidebar={() => setSidebarOpen(s => !s)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <ProgramPage />
        </div>
    );
}

export default App;
