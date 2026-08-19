import React from 'react';

export default function Header() {
    return (
        <header className="app-header">
            <button className="hamburger" aria-label="menu">
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
            </button>
            <button className="brand" type="button">GIM-HZ 2026</button>
            <div className="spacer" />
            <button className="create-btn" aria-label="creer programme">creer programme</button>
        </header>
    );
}
