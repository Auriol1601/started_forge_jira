import React from 'react';
import MetricCircle from './MetricCircle';
import ProjectStatusRow from './ProjectStatusRow';
import SummaryBar from './SummaryBar';

const projects = [
    { label: 'GIM SCHEMA PAIEMENT', value: '70%' },
    { label: 'GIM TRILOGIE', value: '70%' },
    { label: 'GIM SOUVERA', value: '70%' },
    { label: 'GIM TECHNOPOLE', value: '20%' },
    { label: 'GIMPAY', value: '70%' },
    { label: 'GIM EXCELLENCE', value: '65%' },
    { label: 'SIMULATION GAMIFI', value: '80%' },
    { label: 'GIMPULSE', value: '50%' },
    { label: 'GIM TRANSFORM', value: '70%' }
];

export default function TopPanel() {
    return (
        <div className="top-panel">
            <div className="top-panel-inner">
                <div className="panel-dots"><span></span><span></span><span></span></div>
                <div className="panel-content">
                    <div className="left-col">
                        <div className="circles-row">
                            <div className="large-stack">
                                <MetricCircle size="large" percent="45 %" label="Horizon 2026" />
                                <button className="action-pill">GENERER UN RAPPORT</button>
                            </div>
                            <div className="small-circles">
                                <MetricCircle size="small" percent="20 %" label="AXE 1" />
                                <MetricCircle size="small" percent="20 %" label="AXE 2" />
                                <MetricCircle size="small" percent="20 %" label="AXE 3" />
                            </div>
                        </div>
                    </div>

                    <div className="right-col">
                        <div className="project-list">
                            {projects.map((p, i) => (
                                <ProjectStatusRow key={i} label={p.label} value={p.value} />
                            ))}
                        </div>
                    </div>
                </div>
                <SummaryBar />
            </div>
        </div>
    );
}
