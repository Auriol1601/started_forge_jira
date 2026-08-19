import React from 'react';
import ProgressItem from './ProgressItem';

export default function ProgressList({ items }) {
    return (
        <div className="progress-list">
            {items.map((it, i) => (
                <ProgressItem key={i} label={it[0]} percent={it[1]} />
            ))}
        </div>
    );
}
