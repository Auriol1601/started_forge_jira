import React from 'react';

export default function ProgramFormPanel({ formData, categories, onChange, onSubmit }) {
    return (
        <aside className="program-form-panel">
            <div className="field-group field-group-wide">
                <label>selectionner / axe strategique</label>
                <div className="input-shell input-shell-select">
                    <select
                        value={formData.axle}
                        onChange={(e) => onChange('axle', e.target.value)}
                    >
                        <option value="">Sélectionner un axe stratégique</option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="field-group">
                <label>nom du programme</label>
                <div className="input-shell">
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="NOM DU PROGRAMME"
                    />
                </div>
            </div>

            <div className="field-group">
                <label>nom du sponsor</label>
                <div className="input-shell">
                    <input
                        type="text"
                        value={formData.sponsor}
                        onChange={(e) => onChange('sponsor', e.target.value)}
                        placeholder="NOM DU SPONSOR"
                    />
                </div>
            </div>

            {/* <div className="field-group">
                <label>sponsor auto</label>
                <div className="input-shell">
                    <input
                        type="text"
                        value={formData.sponsorAuto}
                        onChange={(e) => onChange('sponsorAuto', e.target.value)}
                        placeholder="SPONSOR AUTO"
                    />
                </div>
            </div> */}

            <div className="field-row two-cols">
                <div className="field-group">
                    <label>Date de début</label>
                    <div className="input-shell input-shell-date">
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => onChange('startDate', e.target.value)}
                        />
                    </div>
                </div>

                <div className="field-group">
                    <label>Date de fin</label>
                    <div className="input-shell input-shell-date">
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => onChange('endDate', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="field-row two-cols">
                <div className="field-group">
                    <label>status</label>
                    <div className="input-shell input-shell-select">
                        <select value={formData.status} onChange={(e) => onChange('status', e.target.value)}>
                            <option value="EN COURS">EN COURS</option>
                            <option value="PLANIFIE">PLANIFIE</option>
                            <option value="TERMINE">TERMINE</option>
                            <option value="EN RETARD">EN RETARD</option>
                        </select>
                    </div>
                </div>

                <div className="field-group">
                    <label>budget</label>
                    <div className="input-shell">
                        <input
                            type="text"
                            value={formData.budget}
                            onChange={(e) => onChange('budget', e.target.value)}
                            placeholder="BUDGET"
                        />
                    </div>
                </div>
            </div>

            <div className="field-group">
                <label>budget consommé</label>
                <div className="input-shell">
                    <input
                        type="text"
                        value={formData.budgetCons}
                        onChange={(e) => onChange('budgetCons', e.target.value)}
                        placeholder="BUDGET CONSO"
                    />
                </div>
            </div>

            <div className="field-group">
                <label>description</label>
                <div className="input-shell textarea-shell">
                    <textarea
                        value={formData.description}
                        onChange={(e) => onChange('description', e.target.value)}
                        placeholder="Description ......"
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="primary-action" onClick={onSubmit}>
                    creer un programme
                </button>
            </div>
        </aside>
    );
}
