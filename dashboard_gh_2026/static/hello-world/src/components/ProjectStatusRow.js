import React from 'react';

function parsePercent(p){
    return String(p || '').replace('%','');
}

export default function ProjectStatusRow({ label, value }){
    const pct = parsePercent(value);
    return (
        <div className="project-row">
            <div className="badge">{value}</div>
            <div className="project-tag">
                <div className="tag-label">{label}</div>
                <div className="tag-bar">
                    <div className="tag-fill" style={{ width: `${pct}%` }} />
                </div>
            </div>
        </div>
    );
}
