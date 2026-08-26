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
        responsable: '',
        sponsor: 'Ministère',
        typeJira: '',
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
        responsable: '',
        sponsor: 'Direction',
        typeJira: '',
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
        responsable: '',
        sponsor: 'Coordination',
        typeJira: '',
        description: 'Description ......',
    },
];

const emptyForm = {
    axle: '',
    name: '',
    responsable: '',
    sponsor: '',
    typeJira: '',
    startDate: '',
    endDate: '',
    status: 'EN COURS',
    budget: '',
    budgetCons: '',
    description: '',
};

export default function ProgramPage() {

    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [programs, setPrograms] = useState(initialPrograms);
    const [selectedId, setSelectedId] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [formData, setFormData] = useState({ ...emptyForm });


    useEffect(() => {
        const testProjectCreationPermission = async () => {
            console.log(
                '[FRONT] Test permission création projet démarré'
            );

            try {
                const result = await invoke(
                    'checkProjectCreationPermission'
                );

                console.log(
                    '[FRONT] Permission Jira:',
                    result
                );
            } catch (error) {
                console.error(
                    '[FRONT] Erreur vérification permission:',
                    error
                );
            }
        };

        testProjectCreationPermission();
    }, []);
    
    useEffect(() => {
        const testProjectTemplates = async () => {
            console.log('[FRONT] Test project templates démarré');

            try {
                const result = await invoke('getProjectTemplates');

                console.log(
                    '[FRONT] Templates Jira retournés :',
                    result
                );

                console.table(result);
            } catch (error) {
                console.error(
                    '[FRONT] Erreur récupération templates Jira :',
                    error
                );
            }
        };

        testProjectTemplates();
    }, []);

    useEffect(() => {
        const testProjectTypes = async () => {
            console.log('[FRONT] Test project types démarré');

            try {
                const result = await invoke('getAccessibleProjectTypes');

                console.log(
                    '[FRONT] Types de projets Jira retournés :',
                    result
                );

                console.table(result);
            } catch (error) {
                console.error(
                    '[FRONT] Erreur récupération types de projets Jira :',
                    error
                );
            }
        };

        testProjectTypes();
    }, []);

    useEffect(() => {
        const loadUsers = async () => {
            console.log('[FRONT] Recherche des responsables Jira démarrée');

            try {
                const { invoke } = await import('@forge/bridge');
                const result = await invoke('searchUsers', { query: 'pulseone' });

                console.log('[FRONT] Responsables Jira retournés :', result);
                setUsers(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error('[FRONT] Erreur recherche utilisateurs Jira :', error);
            }
        };

        loadUsers();
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await invoke('getProjectCategories');

                console.log('[FRONT] Catégories Jira retournées :', result);
                console.log('[FRONT] Nombre de catégories Jira :', result.length);

                setCategories(result);

                if (result.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        axle: prev.axle || result[0].id,
                    }));
                }
            } catch (error) {
                console.error(
                    '[FRONT] Erreur récupération catégories Jira :',
                    error
                );
            }
        };

        loadCategories();
    }, []);


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
            responsable: formData.responsable,
            sponsor: formData.sponsor,
            typeJira: formData.typeJira,
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
            <ProgramFormPanel
                formData={formData}
                categories={categories}
                users={users}
                onChange={updateField}
                onSubmit={handleSubmit}
            />
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
