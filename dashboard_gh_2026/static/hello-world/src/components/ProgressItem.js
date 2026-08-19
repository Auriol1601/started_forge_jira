import React from 'react';

function parsePercent(p) {
    if (!p) return 0;
    return parseInt(String(p).replace('%','')) || 0;
}

export default function ProgressItem({ label, percent }) {
    const p = parsePercent(percent);
    return (
        <div className="progress-item">
            <div className="progress-row">
                <div className="pct-box">{percent}</div>
                <div className="label-and-bar">
                    <div className="label-box">{label}</div>
                    <div className="progress-bar">
                        <div className="bar-fill" style={{ width: `${p}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
