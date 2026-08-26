import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProgramPage from './components/ProgramPage';
import './App.css';

function App(){
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState('home');

    const goHome = () => {
        setSidebarOpen(false);
        setCurrentView('home');
    };

    const goToProgramPage = () => {
        setSidebarOpen(false);
        setCurrentView('program');
    };

    return (
        <div className="app-root">
            <Header
                onToggleSidebar={() => setSidebarOpen(s => !s)}
                onGoHome={goHome}
                onCreateProgram={goToProgramPage}
            />
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onGoHome={goHome}
                onOpenProgramPage={goToProgramPage}
            />
            {currentView === 'program' ? <ProgramPage /> : <Dashboard />}
        </div>
    );
}

export default App;
