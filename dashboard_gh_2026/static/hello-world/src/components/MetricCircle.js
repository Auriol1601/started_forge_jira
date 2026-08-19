import React from 'react';

export default function MetricCircle({ size = 'small', percent, label }) {
    const isLarge = size === 'large';
    return (
        <div className={isLarge ? 'metric-circle large' : 'metric-circle small'}>
            <div className="metric-percent">{percent}</div>
            <div className="metric-label">{label}</div>
        </div>
    );
}
