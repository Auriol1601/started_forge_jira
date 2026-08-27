import React, { useEffect, useState } from 'react';
import ProgramFormPanel from './ProgramFormPanel';
import ProgramTablePanel from './ProgramTablePanel';
import { invoke } from '@forge/bridge';

const initialPrograms = [];

const emptyForm = {
    axle: '',
    name: '',
    projectKey: '',
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
     * =========================================================
     * DONNÉES JIRA
     * =========================================================
     */

    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);

    /*
     * =========================================================
     * PROGRAMMES
     * =========================================================
     *
     * Pour le moment, les programmes sont conservés
     * uniquement en mémoire côté interface.
     *
     * La persistance Jira viendra dans l'étape suivante.
     */

    const [programs, setPrograms] = useState(initialPrograms);

    /*
     * =========================================================
     * ÉTAT DE L'INTERFACE
     * =========================================================
     */

    const [selectedId, setSelectedId] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);

    /*
     * =========================================================
     * FORMULAIRE
     * =========================================================
     */

    const [formData, setFormData] = useState({
        ...emptyForm,
    });

    /*
     * =========================================================
     * CHARGEMENT DES RESPONSABLES JIRA
     * =========================================================
     */

    useEffect(() => {
        const loadUsers = async () => {
            console.log(
                '[FRONT] Chargement des responsables Jira...'
            );

            try {
                const result = await invoke(
                    'searchUsers',
                    {
                        query: 'pulseone',
                    }
                );

                console.log(
                    '[FRONT] Responsables Jira retournés :',
                    result
                );

                setUsers(
                    Array.isArray(result)
                        ? result
                        : []
                );
            } catch (error) {
                console.error(
                    '[FRONT] Erreur chargement responsables Jira :',
                    error
                );

                setUsers([]);
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
                '[FRONT] Chargement des catégories Jira...'
            );

            try {
                const result = await invoke(
                    'getProjectCategories'
                );

                const safeCategories =
                    Array.isArray(result)
                        ? result
                        : [];

                console.log(
                    '[FRONT] Catégories Jira retournées :',
                    safeCategories
                );

                console.log(
                    '[FRONT] Nombre de catégories Jira :',
                    safeCategories.length
                );

                setCategories(
                    safeCategories
                );

                /*
                 * Sélection automatique du premier axe
                 * uniquement si aucun axe n'est sélectionné.
                 */

                if (
                    safeCategories.length > 0
                ) {
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

                setCategories([]);
            }
        };

        loadCategories();
    }, []);

    /*
     * =========================================================
     * CHARGEMENT DES TYPES DE PROJETS JIRA
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

                const safeProjectTypes =
                    Array.isArray(result)
                        ? result
                        : [];

                console.log(
                    '[FRONT] Types de projets Jira retournés :',
                    safeProjectTypes
                );

                console.log(
                    '[FRONT] Nombre de types de projets :',
                    safeProjectTypes.length
                );

                setProjectTypes(
                    safeProjectTypes
                );

                /*
                 * Si aucun type n'est défini dans le formulaire,
                 * on sélectionne le premier type disponible.
                 */

                if (
                    safeProjectTypes.length > 0
                ) {
                    setFormData((prev) => ({
                        ...prev,

                        typeJira:
                            prev.typeJira ||
                            safeProjectTypes[0].key,
                    }));
                }
            } catch (error) {
                console.error(
                    '[FRONT] Erreur récupération types de projets Jira :',
                    error
                );

                setProjectTypes([]);
            }
        };

        loadProjectTypes();
    }, []);

    /*
     * =========================================================
     * MODIFICATION D'UN CHAMP
     * =========================================================
     */

    const updateField = (
        field,
        value
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /*
     * =========================================================
     * SÉLECTION D'UN PROGRAMME
     * =========================================================
     */

    const handleSelectProgram = (
        program
    ) => {
        console.log(
            '[FRONT] Programme sélectionné :',
            program
        );

        setSelectedId(
            program.id
        );

        setFormData({
            ...emptyForm,
            ...program,

            budget:
                program.budget || '',
        });
    };

    /*
     * =========================================================
     * CRÉATION DU PROGRAMME
     * =========================================================
     */

    const handleSubmit = async () => {
        console.log(
            '[FRONT] Création du programme démarrée'
        );

        /*
         * -----------------------------------------------------
         * VALIDATION DU NOM
         * -----------------------------------------------------
         */

        if (
            !formData.name ||
            !formData.name.trim()
        ) {
            console.warn(
                '[FRONT] Nom du programme obligatoire'
            );

            return;
        }

        /*
         * -----------------------------------------------------
         * VALIDATION DE LA CLÉ JIRA
         * -----------------------------------------------------
         */

        if (
            !formData.projectKey ||
            !formData.projectKey.trim()
        ) {
            console.warn(
                '[FRONT] Clé du projet Jira obligatoire'
            );

            return;
        }

        const normalizedProjectKey =
            formData.projectKey
                .trim()
                .toUpperCase();

        if (
            !/^[A-Z0-9]+$/.test(
                normalizedProjectKey
            )
        ) {
            console.warn(
                '[FRONT] La clé Jira doit contenir uniquement des lettres et des chiffres'
            );

            return;
        }

        if (
            normalizedProjectKey.length < 2 ||
            normalizedProjectKey.length > 10
        ) {
            console.warn(
                '[FRONT] La clé Jira doit contenir entre 2 et 10 caractères'
            );

            return;
        }

        /*
         * -----------------------------------------------------
         * RESPONSABLE
         * -----------------------------------------------------
         */

        if (!formData.responsable) {
            console.warn(
                '[FRONT] Responsable obligatoire'
            );

            return;
        }

        /*
         * -----------------------------------------------------
         * TYPE JIRA
         * -----------------------------------------------------
         */

        if (!formData.typeJira) {
            console.warn(
                '[FRONT] Type Jira obligatoire'
            );

            return;
        }

        /*
         * -----------------------------------------------------
         * PAYLOAD
         * -----------------------------------------------------
         */

        const payload = {
            name:
                formData.name.trim(),

            projectKey:
                normalizedProjectKey,

            description:
                formData.description || '',

            axle:
                formData.axle || '',

            responsable:
                formData.responsable,

            typeJira:
                formData.typeJira,
        };

        console.log(
            '[FRONT] Données envoyées à createProgram :',
            payload
        );

        /*
         * -----------------------------------------------------
         * APPEL FORGE
         * -----------------------------------------------------
         */

        try {
            const result =
                await invoke(
                    'createProgram',
                    payload
                );

            console.log(
                '[FRONT] Projet Jira créé :',
                result
            );

            /*
             * -------------------------------------------------
             * CONSTRUCTION DU PROGRAMME LOCAL
             * -------------------------------------------------
             */

            const program = {
                id:
                    result.id,

                jiraKey:
                    result.key,

                name:
                    formData.name.trim(),

                projectKey:
                    normalizedProjectKey,

                status:
                    formData.status,

                budget:
                    formData.budget,

                budgetCons:
                    formData.budgetCons ||
                    '0FCFA',

                startDate:
                    formData.startDate ||
                    '00/00/0000',

                endDate:
                    formData.endDate ||
                    '00/00/0000',

                axle:
                    formData.axle,

                responsable:
                    formData.responsable,

                sponsor:
                    formData.sponsor,

                typeJira:
                    formData.typeJira,

                template:
                    formData.template,

                description:
                    formData.description,
            };

            /*
             * -------------------------------------------------
             * AJOUT DANS LE TABLEAU
             * -------------------------------------------------
             */

            setPrograms((prev) => [
                program,
                ...prev,
            ]);

            /*
             * -------------------------------------------------
             * SÉLECTION DU PROGRAMME CRÉÉ
             * -------------------------------------------------
             */

            setSelectedId(
                program.id
            );

            /*
             * -------------------------------------------------
             * RÉINITIALISATION DU FORMULAIRE
             * -------------------------------------------------
             */

            setFormData({
                ...emptyForm,

                /*
                 * On conserve l'axe actuellement sélectionné
                 * pour faciliter la création du programme suivant.
                 */

                axle:
                    formData.axle,

                /*
                 * On conserve également le type Jira.
                 */

                typeJira:
                    formData.typeJira,
            });

            console.log(
                '[FRONT] Programme ajouté au tableau :',
                program
            );

            console.log(
                '[FRONT] Formulaire réinitialisé'
            );

        } catch (error) {
            console.error(
                '[FRONT] Erreur création programme :',
                error
            );
        }
    };

    /*
     * =========================================================
     * SUPPRESSION
     *
     * ATTENTION :
     * Pour l'instant suppression locale uniquement.
     *
     * La suppression Jira sera intégrée dans une prochaine
     * étape.
     * =========================================================
     */

    const handleDeleteConfirmed = () => {
        if (!pendingDelete) {
            return;
        }

        const deletedId =
            pendingDelete.id;

        console.log(
            '[FRONT] Suppression locale du programme :',
            deletedId
        );

        setPrograms((prev) =>
            prev.filter(
                (item) =>
                    item.id !== deletedId
            )
        );

        setPendingDelete(
            null
        );

        setSelectedId(
            (current) => {
                if (
                    current !== deletedId
                ) {
                    return current;
                }

                const remaining =
                    programs.filter(
                        (item) =>
                            item.id !==
                            deletedId
                    );

                return remaining.length > 0
                    ? remaining[0].id
                    : null;
            }
        );
    };

    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (
        <main className="program-page-shell">

            {/* =================================================
                FORMULAIRE
                ================================================= */}

            <ProgramFormPanel
                formData={
                    formData
                }

                categories={
                    categories
                }

                users={
                    users
                }

                projectTypes={
                    projectTypes
                }

                onChange={
                    updateField
                }

                onSubmit={
                    handleSubmit
                }
            />

            {/* =================================================
                TABLEAU
                ================================================= */}

            <ProgramTablePanel
                programs={
                    programs
                }

                selectedId={
                    selectedId
                }

                onSelect={
                    handleSelectProgram
                }

                onDeleteRequest={
                    setPendingDelete
                }
            />

            {/* =================================================
                MODALE DE SUPPRESSION
                ================================================= */}

            {pendingDelete && (
                <div
                    className="delete-modal-overlay"
                    onClick={() =>
                        setPendingDelete(
                            null
                        )
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
                                    setPendingDelete(
                                        null
                                    )
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