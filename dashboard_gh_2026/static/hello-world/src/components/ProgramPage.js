import React, { useEffect, useState } from 'react';
import ProgramFormPanel from './ProgramFormPanel';
import ProgramTablePanel from './ProgramTablePanel';
import { invoke } from '@forge/bridge';


/*
 * =========================================================
 * FORMULAIRE VIDE
 * =========================================================
 */

const emptyForm = {
    axle: '',
    name: '',
    projectKey: '',
    responsable: '',
    sponsor: '',
    typeJira: '',
    template: '',
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

    const [projectsLoading, setProjectsLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [projectTypesLoading, setProjectTypesLoading] = useState(true);


    /*
     * =========================================================
     * PROGRAMMES
     * =========================================================
     */

    const [programs, setPrograms] = useState([]);


    /*
     * =========================================================
     * ÉTAT DE L'INTERFACE
     * =========================================================
     */

    const [selectedId, setSelectedId] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    const [pendingDelete, setPendingDelete] = useState(null);

    const [isCreating, setIsCreating] = useState(false);


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
     * CHARGEMENT DES PROJETS JIRA
     * =========================================================
     */

    useEffect(() => {

        const loadProjects = async () => {

            console.log(
                '[FRONT] Chargement des projets Jira...'
            );

            try {

                const result = await invoke(
                    'getProjects'
                );

                const safeProjects =
                    Array.isArray(result)
                        ? result
                        : [];

                console.log(
                    '[FRONT] Projets Jira retournés :',
                    safeProjects
                );

                console.log(
                    '[FRONT] Nombre de projets Jira :',
                    safeProjects.length
                );

                console.table(
                    safeProjects
                );

                setPrograms(
                    safeProjects
                );

            } catch (error) {

                console.error(
                    '[FRONT] Erreur récupération projets Jira :',
                    error
                );

                setPrograms([]);

            } finally {

                setProjectsLoading(false);
            }
        };

        loadProjects();

    }, []);


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

            } finally {

                setUsersLoading(false);
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
                 * uniquement lors du chargement initial.
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

            } finally {

                setCategoriesLoading(false);
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
                 * Sélection automatique du premier type
                 * lors du chargement initial.
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

            } finally {

                setProjectTypesLoading(false);
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

    const handleSelectProgram = (program) => {

        console.log(
            '[FRONT] Édition du programme :',
            program
        );

        setSelectedId(
            program.id
        );

        setIsEditing(
            true
        );

        setFormData({

            ...emptyForm,

            ...program,

            projectKey:
                program.projectKey ||
                program.jiraKey ||
                '',

            budget:
                program.budget ||
                '',
        });
    };


    /*
     * =========================================================
     * MODIFICATION DU PROGRAMME
     * =========================================================
     */

    const handleUpdate = async () => {

        console.log(
            '[FRONT] Modification du programme démarrée'
        );


        /*
         * -----------------------------------------------------
         * VÉRIFICATION
         * -----------------------------------------------------
         */

        if (!selectedId) {

            console.error(
                '[FRONT] Aucun programme sélectionné pour modification'
            );

            return;
        }


        /*
         * -----------------------------------------------------
         * VALIDATION
         * -----------------------------------------------------
         */

        if (
            !formData.name ||
            !formData.name.trim()
        ) {

            console.warn(
                '[FRONT] Le nom du programme est obligatoire'
            );

            return;
        }


        /*
         * -----------------------------------------------------
         * PAYLOAD
         * -----------------------------------------------------
         */

        const payload = {

            projectId:
                selectedId,

            projectKey:
                formData.projectKey,

            name:
                formData.name.trim(),

            description:
                formData.description || '',

            axle:
                formData.axle || '',

            responsable:
                formData.responsable || '',

            sponsor:
                formData.sponsor || '',

            typeJira:
                formData.typeJira || '',

            template:
                formData.template || '',

            startDate:
                formData.startDate || '',

            endDate:
                formData.endDate || '',

            status:
                formData.status || '',

            budget:
                formData.budget || '',

            budgetCons:
                formData.budgetCons || '',
        };


        console.log(
            '[FRONT] Données envoyées à updateProgram :',
            payload
        );


        try {

            const result =
                await invoke(
                    'updateProgram',
                    payload
                );


            console.log(
                '[FRONT] Projet Jira modifié :',
                result
            );


            /*
             * -------------------------------------------------
             * MISE À JOUR DU TABLEAU
             * -------------------------------------------------
             */

            setPrograms((prev) =>
                prev.map((program) => {

                    if (
                        program.id !== selectedId
                    ) {
                        return program;
                    }

                    return {

                        ...program,

                        name:
                            formData.name,

                        projectKey:
                            result?.key ||
                            formData.projectKey,

                        jiraKey:
                            result?.key ||
                            formData.projectKey,

                        description:
                            formData.description,

                        axle:
                            formData.axle,

                        responsable:
                            formData.responsable,

                        typeJira:
                            formData.typeJira,

                        sponsor:
                            formData.sponsor,

                        template:
                            formData.template,

                        startDate:
                            formData.startDate,

                        endDate:
                            formData.endDate,

                        status:
                            formData.status,

                        budget:
                            formData.budget,

                        budgetCons:
                            formData.budgetCons,
                    };
                })
            );


            /*
             * -------------------------------------------------
             * SORTIE DU MODE ÉDITION
             * -------------------------------------------------
             */

            setSelectedId(null);

            setIsEditing(false);


            /*
             * -------------------------------------------------
             * RESET
             * -------------------------------------------------
             */

            setFormData({

                ...emptyForm,

                axle:
                    categories.length > 0
                        ? categories[0].id
                        : '',

                typeJira:
                    projectTypes.length > 0
                        ? projectTypes[0].key
                        : '',
            });


            console.log(
                '[FRONT] Retour au mode création'
            );

        } catch (error) {

            console.error(
                '[FRONT] Erreur modification programme :',
                error
            );
        }
    };


    /*
     * =========================================================
     * CRÉATION DU PROGRAMME
     * =========================================================
     */

    const handleCreate = async () => {

        console.log(
            '[FRONT] Création du programme démarrée'
        );


        /*
         * =====================================================
         * VALIDATION
         * =====================================================
         */

        const name =
            (formData.name || '').trim();

        const projectKey =
            (formData.projectKey || '')
                .trim()
                .toUpperCase();


        if (!name) {

            console.warn(
                '[FRONT] Nom du programme obligatoire'
            );

            return;
        }


        if (!projectKey) {

            console.warn(
                '[FRONT] Clé Jira obligatoire'
            );

            return;
        }


        if (
            !/^[A-Z0-9]+$/.test(
                projectKey
            )
        ) {

            console.warn(
                '[FRONT] La clé Jira doit contenir uniquement des lettres et des chiffres'
            );

            return;
        }


        if (
            projectKey.length < 2 ||
            projectKey.length > 10
        ) {

            console.warn(
                '[FRONT] La clé Jira doit contenir entre 2 et 10 caractères'
            );

            return;
        }


        if (!formData.responsable) {

            console.warn(
                '[FRONT] Responsable obligatoire'
            );

            return;
        }


        if (!formData.typeJira) {

            console.warn(
                '[FRONT] Type Jira obligatoire'
            );

            return;
        }


        /*
         * =====================================================
         * PAYLOAD COMPLET
         * =====================================================
         */

        const payload = {

            axle:
                formData.axle || '',

            name,

            projectKey,

            responsable:
                formData.responsable,

            sponsor:
                formData.sponsor || '',

            typeJira:
                formData.typeJira,

            template:
                formData.template || '',

            startDate:
                formData.startDate || '',

            endDate:
                formData.endDate || '',

            status:
                formData.status ||
                'EN COURS',

            budget:
                formData.budget || '',

            budgetCons:
                formData.budgetCons || '',

            description:
                formData.description || '',
        };


        console.log(
            '[FRONT] ================================='
        );

        console.log(
            '[FRONT] PAYLOAD CRÉATION'
        );

        console.log(
            '[FRONT] Données envoyées à createProgram :',
            payload
        );


        /*
         * =====================================================
         * CRÉATION JIRA
         * =====================================================
         */

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
         * =====================================================
         * PROGRAMME LOCAL
         * =====================================================
         */

        const program = {

            id:
                result.id,

            jiraId:
                result.id,

            projectKey:
                result.key ||
                projectKey,

            jiraKey:
                result.key ||
                projectKey,

            jiraUrl:
                result.self ||
                '',

            name:
                result.name ||
                name,

            status:
                formData.status ||
                'EN COURS',

            budget:
                formData.budget ||
                '',

            budgetCons:
                formData.budgetCons ||
                '',

            startDate:
                formData.startDate ||
                '',

            endDate:
                formData.endDate ||
                '',

            axle:
                formData.axle ||
                '',

            responsable:
                formData.responsable ||
                '',

            sponsor:
                formData.sponsor ||
                '',

            typeJira:
                formData.typeJira ||
                '',

            template:
                formData.template ||
                '',

            description:
                formData.description ||
                '',
        };


        console.log(
            '[FRONT] Programme local créé :',
            program
        );


        /*
         * =====================================================
         * AJOUT AU TABLEAU
         * =====================================================
         */

        setPrograms((prev) => [

            program,

            ...prev,
        ]);


        /*
         * =====================================================
         * IMPORTANT
         *
         * NE PAS sélectionner le programme créé.
         *
         * Sinon le formulaire pourrait repasser
         * automatiquement en mode modification.
         * =====================================================
         */

        setSelectedId(null);

        setIsEditing(false);


        /*
         * =====================================================
         * RESET COMPLET DU FORMULAIRE
         *
         * On conserve uniquement :
         *
         * - premier axe disponible
         * - premier type Jira disponible
         *
         * Toutes les autres données sont supprimées.
         * =====================================================
         */

        setFormData({

            ...emptyForm,

            axle:
                categories.length > 0
                    ? categories[0].id
                    : '',

            typeJira:
                projectTypes.length > 0
                    ? projectTypes[0].key
                    : '',
        });


        console.log(
            '[FRONT] ================================='
        );

        console.log(
            '[FRONT] Formulaire réinitialisé'
        );

        console.log(
            '[FRONT] Prêt pour une nouvelle création'
        );
    };


    /*
     * =========================================================
     * SOUMISSION UNIQUE
     * =========================================================
     *
     * Une seule porte d'entrée pour le bouton.
     *
     * Création :
     *     handleCreate()
     *
     * Modification :
     *     handleUpdate()
     * =========================================================
     */

    const handleSubmit = async () => {

        /*
         * Protection contre le double clic.
         */

        if (isCreating) {

            console.warn(
                '[FRONT] Opération déjà en cours'
            );

            return;
        }


        /*
         * -----------------------------------------------------
         * MODE MODIFICATION
         * -----------------------------------------------------
         */

        if (isEditing) {

            await handleUpdate();

            return;
        }


        /*
         * -----------------------------------------------------
         * MODE CRÉATION
         * -----------------------------------------------------
         */

        setIsCreating(true);

        try {

            await handleCreate();

        } catch (error) {

            console.error(
                '[FRONT] Erreur création programme :',
                error
            );

        } finally {

            setIsCreating(false);
        }
    };


    /*
     * =========================================================
     * SUPPRESSION
     * =========================================================
     */

    const handleDeleteConfirmed = async () => {

        if (!pendingDelete) {
            return;
        }

        const deletedId =
            pendingDelete.id;

        console.log(
            '[FRONT] Suppression du programme démarrée :',
            pendingDelete
        );


        try {

            const result =
                await invoke(
                    'deleteProgram',
                    {
                        projectId:
                            deletedId,
                    }
                );


            console.log(
                '[FRONT] Projet Jira supprimé :',
                result
            );


            /*
             * -------------------------------------------------
             * TABLEAU
             * -------------------------------------------------
             */

            setPrograms((prev) =>
                prev.filter(
                    (item) =>
                        item.id !== deletedId
                )
            );


            /*
             * -------------------------------------------------
             * FERMETURE MODALE
             * -------------------------------------------------
             */

            setPendingDelete(null);


            /*
             * -------------------------------------------------
             * SI LE PROGRAMME SUPPRIMÉ ÉTAIT SÉLECTIONNÉ
             * -------------------------------------------------
             */

            if (
                selectedId === deletedId
            ) {

                setSelectedId(null);

                setIsEditing(false);

                setFormData({

                    ...emptyForm,

                    axle:
                        categories.length > 0
                            ? categories[0].id
                            : '',

                    typeJira:
                        projectTypes.length > 0
                            ? projectTypes[0].key
                            : '',
                });
            }


            console.log(
                '[FRONT] Suppression du programme terminée'
            );

        } catch (error) {

            console.error(
                '[FRONT] Erreur suppression programme :',
                error
            );

            alert(
                error?.message ||
                'Impossible de supprimer le programme.'
            );
        }
    };


    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (

        <main
            className="program-page-shell"
            aria-busy={
                projectsLoading ||
                usersLoading ||
                categoriesLoading ||
                projectTypesLoading
            }
        >

            {(
                projectsLoading ||
                usersLoading ||
                categoriesLoading ||
                projectTypesLoading
            ) ? (

                /*
                 * -------------------------------------------------
                 * LOADER INITIAL
                 * -------------------------------------------------
                 */

                <div
                    className="initial-loader"
                    role="status"
                    aria-label="Chargement des données"
                >

                    <span
                        className="initial-loader-spinner"
                    />

                </div>

            ) : (

                <>

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

                        isEditing={
                            isEditing
                        }

                        isCreating={
                            isCreating
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

                </>

            )}

        </main>
    );
}