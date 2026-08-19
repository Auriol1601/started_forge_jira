import React from 'react';

function parsePercent(p) {
    if (!p) return 0;
    return parseInt(String(p).replace('%','')) || 0;
}

export default function ProgressItem({ label, percent }) {
    const p = parsePercent(percent);
    return (
        <div className="progress-item">
            <div className="progress-label"><span className="pct">{percent}</span> {label}</div>
            <div className="progress-bar">
                <div className="bar-fill" style={{ width: `${p}%` }} />
            </div>
        </div>
    );
}
