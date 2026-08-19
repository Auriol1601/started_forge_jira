import React from 'react';
import TopPanel from './TopPanel';
import SummaryBar from './SummaryBar';

export default function Dashboard() {
    return (
        <div className="dashboard-root">
            <TopPanel />
            <SummaryBar />
        </div>
    );
}
