import React from 'react';

export default function SummaryBar(){
    return (
        <div className="summary-bar">
            <div className="summary-left">10090000 FCFA Budgé restant</div>
            <div className="summary-center">
                <div className="metric-item"><span className="big-red">50</span> <span className="label-red">Arbitrages</span></div>
                <div className="metric-item"><span className="big-yellow">30</span> <span className="label-yellow">Vigilances</span></div>
            </div>
            <div className="summary-right"><span className="green">15</span> projets terminé</div>
        </div>
    );
}
