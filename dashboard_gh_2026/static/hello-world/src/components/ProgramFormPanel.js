import React from 'react';

export default function ProgramFormPanel({
    formData,
    categories = [],
    users = [],
    projectTypes = [],
    onChange,
    onSubmit,
}) {
    return (
        <aside className="program-form-panel">

            {/* AXE STRATÉGIQUE */}
            <div className="field-group field-group-wide">
                <label>Axe stratégique</label>

                <div className="input-shell input-shell-select">
                    <select
                        value={formData.axle}
                        onChange={(e) => onChange('axle', e.target.value)}
                    >
                        <option value="">
                            Sélectionner un axe stratégique
                        </option>

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

            {/* NOM DU PROGRAMME */}
            <div className="field-group">
                <label>Nom du programme</label>

                <div className="input-shell">
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                            onChange('name', e.target.value)
                        }
                        placeholder="Nom du programme"
                    />
                </div>
            </div>
            
            {/* CLÉ DU PROJET JIRA */}
            <div className="field-group">
                <label>Clé du projet Jira</label>

                <div className="input-shell">
                    <input
                        type="text"
                        value={formData.projectKey}
                        onChange={(e) =>
                            onChange(
                                'projectKey',
                                e.target.value.toUpperCase()
                            )
                        }
                        placeholder="Ex : GIMSP"
                        maxLength={10}
                    />
                </div>
            </div>

            {/* RESPONSABLE */}
            <div className="field-group">
                <label>Responsable</label>

                <div className="input-shell input-shell-select">
                    <select
                        value={formData.responsable}
                        onChange={(e) =>
                            onChange('responsable', e.target.value)
                        }
                    >
                        <option value="">
                            Sélectionner un responsable
                        </option>

                        {users.map((user) => (
                            <option
                                key={user.accountId}
                                value={user.accountId}
                            >
                                {user.displayName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* SPONSOR */}
            <div className="field-group">
                <label>Nom du sponsor</label>

                <div className="input-shell">
                    <input
                        type="text"
                        value={formData.sponsor}
                        onChange={(e) =>
                            onChange('sponsor', e.target.value)
                        }
                        placeholder="Nom du sponsor"
                    />
                </div>
            </div>

            {/* TYPE JIRA */}
            <div className="field-group">
                <label>Type Jira</label>

                <div className="input-shell input-shell-select">
                    <select
                        value={formData.typeJira}
                        onChange={(e) =>
                            onChange('typeJira', e.target.value)
                        }
                    >
                        <option value="">
                            Sélectionner un type
                        </option>

                        {projectTypes.map((type) => (
                            <option
                                key={type.key}
                                value={type.key}
                            >
                                {type.formattedKey}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* MODE SCRUM / KANBAN */}
            <div className="field-group">
                <label>Modèle de travail</label>

                <div className="input-shell input-shell-select">
                    <select
                        value={formData.template}
                        onChange={(e) =>
                            onChange('template', e.target.value)
                        }
                    >
                        <option value="">
                            Sélectionner un modèle
                        </option>

                        <option value="scrum">
                            Scrum
                        </option>

                        <option value="kanban">
                            Kanban
                        </option>
                    </select>
                </div>
            </div>

            {/* DATES */}
            <div className="field-row two-cols">

                <div className="field-group">
                    <label>Date début</label>

                    <div className="input-shell input-shell-date">
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) =>
                                onChange('startDate', e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="field-group">
                    <label>Date fin</label>

                    <div className="input-shell input-shell-date">
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) =>
                                onChange('endDate', e.target.value)
                            }
                        />
                    </div>
                </div>

            </div>

            {/* STATUS + BUDGET */}
            <div className="field-row two-cols">

                <div className="field-group">
                    <label>Status</label>

                    <div className="input-shell input-shell-select">
                        <select
                            value={formData.status}
                            onChange={(e) =>
                                onChange('status', e.target.value)
                            }
                        >
                            <option value="EN COURS">
                                EN COURS
                            </option>

                            <option value="PLANIFIE">
                                PLANIFIE
                            </option>

                            <option value="TERMINE">
                                TERMINE
                            </option>

                            <option value="EN RETARD">
                                EN RETARD
                            </option>
                        </select>
                    </div>
                </div>

                <div className="field-group">
                    <label>Budget</label>

                    <div className="input-shell">
                        <input
                            type="text"
                            value={formData.budget}
                            onChange={(e) =>
                                onChange('budget', e.target.value)
                            }
                            placeholder="BUDGET"
                        />
                    </div>
                </div>

            </div>

            {/* BUDGET CONSOMMÉ */}
            <div className="field-group">
                <label>Budget consommé</label>

                <div className="input-shell">
                    <input
                        type="text"
                        value={formData.budgetCons}
                        onChange={(e) =>
                            onChange('budgetCons', e.target.value)
                        }
                        placeholder="BUDGET CONSO"
                    />
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="field-group">
                <label>Description</label>

                <div className="input-shell textarea-shell">
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            onChange('description', e.target.value)
                        }
                        placeholder="Description ......"
                    />
                </div>
            </div>

            {/* ACTION */}
            <div className="form-actions">
                <button
                    type="button"
                    className="primary-action"
                    onClick={onSubmit}
                >
                    Creer un programme
                </button>
            </div>

        </aside>
    );
}