import React from 'react';

export default function Header({ onToggleSidebar, onGoHome, onCreateProgram }) {
    return (
        <header className="app-header">
            <button className="hamburger" aria-label="menu" onClick={onToggleSidebar}>
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
            </button>
            <button className="brand" type="button" onClick={onGoHome}>GIM-HZ 2026</button>
            <div className="spacer" />
            <button className="create-btn" aria-label="creer programme" onClick={onCreateProgram}>
                CREER UN PROGRAMME
            </button>
        </header>
    );
}
