import React from 'react';

export default function SummaryBar(){
    return (
        <div className="summary-bar">
            <div className="summary-left">10090000 FCFA Budgé restant</div>
            <div className="summary-center"><span className="big-red">50</span> Arbitrages</div>
            <div className="summary-right"><span className="green">15</span> projets terminé</div>
        </div>
    );
}
