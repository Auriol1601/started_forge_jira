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

export default function ProgramTablePanel({ programs, selectedId, onSelect, onDeleteRequest }) {
    return (
        <section className="program-table-panel">
            <div className="table-note">NB: utilisez l'icône d'édition pour modifier un programme</div>
            <div className="table-header-row">
                <span>nom du programme</span>
                <span>status</span>
                <span>budget conso</span>
                <span>date debut</span>
                <span>date fin</span>
                <span className="actions-header">actions</span>
            </div>

            {programs.map((program) => (
                <div key={program.id} className="table-row-wrap">
                    <div className={selectedId === program.id ? 'table-row row-selected' : 'table-row'}>
                        <span>{program.name}</span>
                        <StatusBadge status={program.status} />
                        <span>{program.budgetCons}</span>
                        <span>{program.startDate}</span>
                        <span>{program.endDate}</span>
                        <span className="row-actions">
                            <button
                                type="button"
                                className="edit-icon-btn"
                                aria-label={`Editer ${program.name}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(program);
                                }}
                            >
                                ✎
                            </button>
                            <button
                                type="button"
                                className="delete-icon-btn"
                                aria-label={`Supprimer ${program.name}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteRequest(program);
                                }}
                            >
                                🗑
                            </button>
                        </span>
                    </div>
                </div>
            ))}
        </section>
    );
}
