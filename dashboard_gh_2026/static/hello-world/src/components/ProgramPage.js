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
        typeJira: 'software',
        template: 'scrum',
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
        typeJira: 'software',
        template: 'kanban',
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
        typeJira: 'software',
        template: 'scrum',
        description: 'Description ......',
    },
];

const emptyForm = {
    axle: '',
    name: '',
    responsable: '',
    sponsor: '',
    typeJira: 'software',
    template: 'scrum',
    startDate: '',
    endDate: '',
    status: 'EN COURS',
    budget: '',
    budgetCons: '',
    description: '',
};

export default function ProgramPage() {
    /*
     * Données provenant de Jira
     */
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);

    /*
     * Données actuellement utilisées par la table.
     * Elles seront remplacées par les vrais projets Jira
     * lors de l'étape suivante.
     */
    const [programs, setPrograms] = useState(initialPrograms);

    /*
     * Gestion de la sélection / modification
     */
    const [selectedId, setSelectedId] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);

    /*
     * Données du formulaire
     */
    const [formData, setFormData] = useState({ ...emptyForm });

    /*
     * =========================================================
     * CHARGEMENT DES RESPONSABLES JIRA
     * =========================================================
     */
    useEffect(() => {
        const loadUsers = async () => {
            console.log(
                '[FRONT] Recherche des responsables Jira démarrée'
            );

            try {
                const result = await invoke('searchUsers', {
                    query: 'pulseone',
                });

                console.log(
                    '[FRONT] Responsables Jira retournés :',
                    result
                );

                setUsers(
                    Array.isArray(result) ? result : []
                );
            } catch (error) {
                console.error(
                    '[FRONT] Erreur recherche utilisateurs Jira :',
                    error
                );
            }
        };

        loadUsers();
    }, []);

    /*
     * =========================================================
     * CHARGEMENT DES CATÉGORIES JIRA
     *
     * Les catégories représentent les axes stratégiques.
     * =========================================================
     */
    useEffect(() => {
        const loadCategories = async () => {
            console.log(
                '[FRONT] Chargement des catégories Jira démarré'
            );

            try {
                const result = await invoke(
                    'getProjectCategories'
                );

                console.log(
                    '[FRONT] Catégories Jira retournées :',
                    result
                );

                console.log(
                    '[FRONT] Nombre de catégories Jira :',
                    result.length
                );

                const safeCategories = Array.isArray(result)
                    ? result
                    : [];

                setCategories(safeCategories);

                /*
                 * Sélection automatique du premier axe
                 * uniquement si aucun axe n'est encore sélectionné.
                 */
                if (safeCategories.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        axle:
                            prev.axle ||
                            safeCategories[0].id,
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

    /*
     * =========================================================
     * CHARGEMENT DES TYPES DE PROJETS JIRA
     *
     * Exemple :
     * software
     * business
     * =========================================================
     */
    useEffect(() => {
        const loadProjectTypes = async () => {
            console.log(
                '[FRONT] Chargement des types de projets Jira...'
            );

            try {
                const result = await invoke(
                    'getAccessibleProjectTypes'
                );

                console.log(
                    '[FRONT] Types de projets Jira retournés :',
                    result
                );

                console.table(result);

                setProjectTypes(
                    Array.isArray(result)
                        ? result
                        : []
                );
            } catch (error) {
                console.error(
                    '[FRONT] Erreur récupération types de projets Jira :',
                    error
                );
            }
        };

        loadProjectTypes();
    }, []);

    /*
     * =========================================================
     * MODIFICATION D'UN CHAMP DU FORMULAIRE
     * =========================================================
     */
    const updateField = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /*
     * =========================================================
     * SÉLECTION D'UN PROGRAMME
     *
     * Pour l'instant les programmes viennent encore du mock.
     * Cette fonction sera conservée pour la future lecture Jira.
     * =========================================================
     */
    const handleSelectProgram = (program) => {
        setSelectedId(program.id);

        setFormData({
            ...emptyForm,
            ...program,
            budget: program.budget || '',
        });
    };

    /*
     * =========================================================
     * SOUMISSION DU FORMULAIRE
     *
     * IMPORTANT :
     * Pour cette étape, on ne crée PAS encore de projet Jira.
     *
     * On conserve uniquement le comportement local.
     * La prochaine étape remplacera cette partie par :
     *
     * invoke('createProgram', formData)
     *
     * =========================================================
     */
    const handleSubmit = () => {
        /*
         * Validation minimale
         */
        if (!formData.name.trim()) {
            console.warn(
                '[FRONT] Création impossible : nom du programme manquant'
            );

            return;
        }

        /*
         * Construction du programme local
         */
        const program = {
            id: selectedId || Date.now(),

            name: formData.name,

            status: formData.status,

            budget: formData.budget,

            budgetCons:
                formData.budgetCons || '0FCFA',

            startDate:
                formData.startDate || '00/00/0000',

            endDate:
                formData.endDate || '00/00/0000',

            axle: formData.axle,

            responsable: formData.responsable,

            sponsor: formData.sponsor,

            typeJira: formData.typeJira,

            template: formData.template,

            description: formData.description,
        };

        console.log(
            '[FRONT] Programme local :',
            program
        );

        /*
         * Mise à jour de la table locale
         */
        setPrograms((prev) => {
            const existing = prev.some(
                (item) => item.id === selectedId
            );

            if (existing) {
                return prev.map((item) =>
                    item.id === selectedId
                        ? program
                        : item
                );
            }

            return [program, ...prev];
        });

        setSelectedId(program.id);
    };

    /*
     * =========================================================
     * SUPPRESSION LOCALE
     *
     * Sera remplacée par deleteProgram() lors de l'intégration
     * Jira.
     * =========================================================
     */
    const handleDeleteConfirmed = () => {
        if (!pendingDelete) {
            return;
        }

        setPrograms((prev) =>
            prev.filter(
                (item) =>
                    item.id !== pendingDelete.id
            )
        );

        /*
         * Fermeture de la modal
         */
        setPendingDelete(null);

        /*
         * Si le programme supprimé était sélectionné,
         * on sélectionne le premier programme restant.
         */
        setSelectedId((current) => {
            if (
                current !== pendingDelete.id
            ) {
                return current;
            }

            const remainingPrograms =
                programs.filter(
                    (item) =>
                        item.id !== pendingDelete.id
                );

            const next =
                remainingPrograms[0];

            return next
                ? next.id
                : null;
        });
    };

    return (
        <main className="program-page-shell">

            {/* =================================================
                FORMULAIRE
                ================================================= */}
            <ProgramFormPanel
                formData={formData}
                categories={categories}
                users={users}
                projectTypes={projectTypes}
                onChange={updateField}
                onSubmit={handleSubmit}
            />

            {/* =================================================
                TABLE
                ================================================= */}
            <ProgramTablePanel
                programs={programs}
                selectedId={selectedId}
                onSelect={handleSelectProgram}
                onDeleteRequest={setPendingDelete}
            />

            {/* =================================================
                MODALE DE SUPPRESSION
                ================================================= */}
            {pendingDelete && (
                <div
                    className="delete-modal-overlay"
                    onClick={() =>
                        setPendingDelete(null)
                    }
                >
                    <div
                        className="delete-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <div className="delete-modal-title">
                            Confirmation
                        </div>

                        <p className="delete-warning">
                            La suppression du programme
                            supprimera tous les projets
                            associés. Êtes-vous sûr !!
                        </p>

                        <div className="delete-modal-actions">

                            <button
                                type="button"
                                className="delete-modal-cancel"
                                onClick={() =>
                                    setPendingDelete(null)
                                }
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                className="delete-modal-confirm"
                                onClick={
                                    handleDeleteConfirmed
                                }
                            >
                                Supprimer
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </main>
    );
}