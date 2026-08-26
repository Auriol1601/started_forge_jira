import React, { useEffect, useState } from 'react';
import ProgramFormPanel from './ProgramFormPanel';
import ProgramTablePanel from './ProgramTablePanel';
import { invoke } from '@forge/bridge';

const initialPrograms = [
    {
        id: 1,
        name: 'Schema paiement',
        status: 'EN COURS',
        budgetCons: '2000000FCFA',
        startDate: '03/08/2026',
        endDate: '04/08/2026',
        axle: 'AXE 1',
        sponsor: 'Ministère',
        sponsorAuto: 'AUTO',
        description: 'Description ......',
    },
    {
        id: 2,
        name: 'GIM trilogie',
        status: 'PLANIFIE',
        budgetCons: '1800000FCFA',
        startDate: '05/08/2026',
        endDate: '12/08/2026',
        axle: 'AXE 2',
        sponsor: 'Direction',
        sponsorAuto: 'AUTO',
        description: 'Description ......',
    },
    {
        id: 3,
        name: 'GIM souvera',
        status: 'TERMINE',
        budgetCons: '2600000FCFA',
        startDate: '01/07/2026',
        endDate: '15/07/2026',
        axle: 'AXE 3',
        sponsor: 'Coordination',
        sponsorAuto: 'AUTO',
        description: 'Description ......',
    },
];

const emptyForm = {
    axle: 'AXE STRATEGIQUE',
    name: '',
    sponsor: '',
    sponsorAuto: '',
    startDate: '',
    endDate: '',
    status: 'EN COURS',
    budget: '',
    budgetCons: '',
    description: '',
};

export default function ProgramPage() {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await invoke('getProjectCategories');

                console.log('Catégories Jira :', result);

                setCategories(result);
            } catch (error) {
                console.error(
                    'Erreur récupération catégories Jira :',
                    error
                );
            }
        };

        loadCategories();
    }, []);

    const [programs, setPrograms] = useState(initialPrograms);
    const [selectedId, setSelectedId] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [formData, setFormData] = useState({ ...emptyForm });

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSelectProgram = (program) => {
        setSelectedId(program.id);
        setFormData({
            ...emptyForm,
            ...program,
            budget: program.budgetCons || '',
        });
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) return;

        const program = {
            id: selectedId || Date.now(),
            name: formData.name,
            status: formData.status,
            budgetCons: formData.budgetCons || '0FCFA',
            startDate: formData.startDate || '00/00/0000',
            endDate: formData.endDate || '00/00/0000',
            axle: formData.axle,
            sponsor: formData.sponsor,
            sponsorAuto: formData.sponsorAuto,
            description: formData.description,
        };

        setPrograms((prev) => {
            const existing = prev.some((item) => item.id === selectedId);
            if (existing) {
                return prev.map((item) => (item.id === selectedId ? program : item));
            }
            return [program, ...prev];
        });

        setSelectedId(program.id);
    };

    const handleDeleteConfirmed = () => {
        if (!pendingDelete) return;

        setPrograms((prev) => prev.filter((item) => item.id !== pendingDelete.id));
        setPendingDelete(null);

        setSelectedId((current) => {
            if (current !== pendingDelete.id) return current;
            const next = programs.filter((item) => item.id !== pendingDelete.id)[0];
            return next ? next.id : null;
        });
    };

    return (
        <main className="program-page-shell">
            <ProgramFormPanel formData={formData} onChange={updateField} onSubmit={handleSubmit} />
            <ProgramTablePanel
                programs={programs}
                selectedId={selectedId}
                onSelect={handleSelectProgram}
                onDeleteRequest={setPendingDelete}
            />

            {pendingDelete && (
                <div className="delete-modal-overlay" onClick={() => setPendingDelete(null)}>
                    <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-title">Confirmation</div>
                        <p className="delete-warning">
                            La suppression du programme supprimera tous les projets associés. Êtes-vous sûr !!
                        </p>
                        <div className="delete-modal-actions">
                            <button type="button" className="delete-modal-cancel" onClick={() => setPendingDelete(null)}>
                                Annuler
                            </button>
                            <button type="button" className="delete-modal-confirm" onClick={handleDeleteConfirmed}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
