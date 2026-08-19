import React from 'react';
import Header from './components/Header';
import ProgressList from './components/ProgressList';
import MetricsBar from './components/MetricsBar';
import './App.css';

function App() {
    const progressItems = [
        ['GIM SCHEMA PAIEMENT', '70%'],
        ['GIM TRILOGIE', '70%'],
        ['GIM SOUVERA', '70%'],
        ['GIM TECHNOPOLE', '20%'],
        ['GIMPAY', '70%'],
        ['GIM EXCELLENCE', '65%'],
        ['SIMULATION GAMIFI', '80%'],
        ['GIMPULSE', '50%'],
        ['GIM TRANSFORM', '70%']
    ];

    return (
        <div className="app-root">
            <Header />
            <main className="main-area">
                <div className="card">
                    <div className="left-col">
                        <div className="circles-row">
                            <div className="big-circle">
                                <div className="big-percent">45 %</div>
                                <div className="big-label">Horizon 2026</div>
                            </div>

                            <div className="small-circles">
                                <div className="small-circle">20 %<div className="axis">AXE 1</div></div>
                                <div className="small-circle">20 %<div className="axis">AXE 2</div></div>
                                <div className="small-circle">20 %<div className="axis">AXE 3</div></div>
                            </div>
                        </div>

                        <button className="report-btn">GENERER UN RAPPORT</button>
                    </div>

                    <div className="right-col">
                        <ProgressList items={progressItems} />
                    </div>
                    <MetricsBar />
                </div>
            </main>
            
        </div>
    );
}

export default App;
