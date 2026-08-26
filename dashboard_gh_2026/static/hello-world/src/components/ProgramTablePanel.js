import React from 'react';

function StatusBadge({ status }) {
    const normalized = (status || '').toUpperCase();
    const variants = {
        'EN COURS': 'status status-running',
        'TERMINE': 'status status-done',
        'PLANIFIE': 'status status-pending',
        'EN RETARD': 'status status-delayed',
    };

    return <span className={variants[normalized] || 'status'}>{normalized}</span>;
}

export default function ProgramTablePanel({ programs, selectedId, onSelect }) {
    return (
        <section className="program-table-panel">
            <div className="table-note">NB: cliquez sur un programme pour le modifiez</div>
            <div className="table-header-row">
                <span>nom du programme</span>
                <span>status</span>
                <span>budget conso</span>
                <span>date debut</span>
                <span>date fin</span>
            </div>

            {programs.map((program) => (
                <button
                    type="button"
                    key={program.id}
                    className={selectedId === program.id ? 'table-row row-selected' : 'table-row'}
                    onClick={() => onSelect(program)}
                >
                    <span>{program.name}</span>
                    <StatusBadge status={program.status} />
                    <span>{program.budgetCons}</span>
                    <span>{program.startDate}</span>
                    <span>{program.endDate}</span>
                </button>
            ))}
        </section>
    );
}
