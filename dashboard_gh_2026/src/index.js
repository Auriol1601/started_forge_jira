import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { kvs } from '@forge/kvs';
import { getIssues } from './forge/handlers.js';

const resolver = new Resolver();


/**
 * =========================================================
 * TEST RESOLVER
 * =========================================================
 */

resolver.define('getText', (req) => {

    console.log(req);

    return 'Hello world!';
});


/**
 * =========================================================
 * MÉTADONNÉES DES PROGRAMMES
 * =========================================================
 *
 * Les informations métier qui ne sont pas directement
 * stockées dans Jira sont conservées dans Forge KVS.
 *
 * Le projectId Jira sert de clé de rattachement.
 *
 * Métadonnées :
 *
 * - sponsor
 * - startDate
 * - endDate
 * - status
 * - budget
 * - budgetCons
 * - typeJira
 * - template
 *
 * L'axe (axle) est stocké côté Jira comme catégorie.
 * =========================================================
 */


/**
 * =========================================================
 * CONSTRUIRE LA CLÉ STORAGE
 * =========================================================
 */

const getProgramMetadataKey = (projectId) =>
    `program-metadata:${projectId}`;


/**
 * =========================================================
 * MÉTADONNÉES VIDES
 * =========================================================
 */

const getEmptyProgramMetadata = (projectId) => ({

    projectId,

    sponsor: '',

    startDate: '',

    endDate: '',

    status: 'EN COURS',

    budget: '',

    budgetCons: '',

    typeJira: '',

    template: '',
});


/**
 * =========================================================
 * SAUVEGARDER LES MÉTADONNÉES
 * =========================================================
 */

const saveProgramMetadata = async (
    projectId,
    metadata = {}
) => {

    if (!projectId) {

        throw new Error(
            'Impossible de sauvegarder les métadonnées : projectId manquant.'
        );
    }


    const key =
        getProgramMetadataKey(projectId);


    const data = {

        projectId,

        sponsor:
            metadata.sponsor || '',

        startDate:
            metadata.startDate || '',

        endDate:
            metadata.endDate || '',

        status:
            metadata.status ||
            'EN COURS',

        budget:
            metadata.budget || '',

        budgetCons:
            metadata.budgetCons || '',

        typeJira:
            metadata.typeJira || '',

        template:
            metadata.template || '',
    };


    console.log(
        '[metadata] Sauvegarde KVS :',
        {
            key,
            data,
        }
    );


    await kvs.set(
        key,
        data
    );


    console.log(
        '[metadata] Sauvegarde KVS terminée :',
        projectId
    );


    return data;
};


/**
 * =========================================================
 * RÉCUPÉRER LES MÉTADONNÉES
 * =========================================================
 */

const getProgramMetadata = async (
    projectId
) => {

    if (!projectId) {

        return null;
    }


    const key =
        getProgramMetadataKey(projectId);


    const metadata =
        await kvs.get(key);


    if (!metadata) {

        return getEmptyProgramMetadata(
            projectId
        );
    }


    return {

        ...getEmptyProgramMetadata(
            projectId
        ),

        ...metadata,

        projectId,
    };
};


/**
 * =========================================================
 * SUPPRIMER LES MÉTADONNÉES
 * =========================================================
 */

const deleteProgramMetadata = async (
    projectId
) => {

    if (!projectId) {

        return;
    }


    const key =
        getProgramMetadataKey(projectId);


    console.log(
        '[metadata] Suppression KVS :',
        key
    );


    await kvs.delete(
        key
    );


    console.log(
        '[metadata] Suppression KVS terminée :',
        projectId
    );
};


/**
 * =========================================================
 * CRÉER UN PROJET / PROGRAMME JIRA
 * =========================================================
 */

resolver.define(
    'createProgram',
    async (request) => {

        console.log(
            '[createProgram] START'
        );


        const data =
            request.payload || {};


        console.log(
            '[createProgram] Payload reçu :',
            data
        );


        const {

            name,

            projectKey,

            description,

            axle,

            responsable,

            typeJira,

            sponsor,

            startDate,

            endDate,

            status,

            budget,

            budgetCons,

            template,

        } = data;


        /**
         * =====================================================
         * VALIDATION
         * =====================================================
         */

        if (
            !name ||
            !name.trim()
        ) {

            throw new Error(
                'Le nom du programme est obligatoire.'
            );
        }


        if (
            !projectKey ||
            !projectKey.trim()
        ) {

            throw new Error(
                'La clé du projet Jira est obligatoire.'
            );
        }


        const normalizedProjectKey =
            projectKey
                .trim()
                .toUpperCase();


        /**
         * =====================================================
         * VALIDATION CLÉ JIRA
         * =====================================================
         */

        if (
            !/^[A-Z0-9]+$/.test(
                normalizedProjectKey
            )
        ) {

            throw new Error(
                'La clé Jira doit contenir uniquement des lettres et des chiffres.'
            );
        }


        if (
            normalizedProjectKey.length < 2 ||
            normalizedProjectKey.length > 10
        ) {

            throw new Error(
                'La clé Jira doit contenir entre 2 et 10 caractères.'
            );
        }


        /**
         * =====================================================
         * RESPONSABLE
         * =====================================================
         */

        if (!responsable) {

            throw new Error(
                'Le responsable est obligatoire.'
            );
        }


        /**
         * =====================================================
         * TYPE JIRA
         * =====================================================
         */

        if (!typeJira) {

            throw new Error(
                'Le type Jira est obligatoire.'
            );
        }


        /**
         * =====================================================
         * VÉRIFICATION DE LA CLÉ
         * =====================================================
         */

        console.log(
            '[createProgram] Vérification de la clé :',
            normalizedProjectKey
        );


        const existingProjectResponse =
            await api
                .asApp()
                .requestJira(
                    route`/rest/api/3/project/${normalizedProjectKey}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );


        console.log(
            '[createProgram] Vérification clé status:',
            existingProjectResponse.status
        );


        /**
         * 200 = projet déjà existant.
         */

        if (
            existingProjectResponse.ok
        ) {

            throw new Error(
                `La clé Jira "${normalizedProjectKey}" est déjà utilisée.`
            );
        }


        /**
         * =====================================================
         * CRÉATION DU PROJET JIRA
         * =====================================================
         */

        const projectData = {

            name:
                name.trim(),

            key:
                normalizedProjectKey,

            projectTypeKey:
                typeJira,

            description:
                description || '',

            leadAccountId:
                responsable,
        };


        /**
         * Axe stratégique = catégorie Jira.
         */

        if (axle) {

            const numericAxle =
                Number(axle);


            if (
                Number.isNaN(
                    numericAxle
                )
            ) {

                throw new Error(
                    'L’axe stratégique sélectionné est invalide.'
                );
            }


            projectData.categoryId =
                numericAxle;
        }


        console.log(
            '[createProgram] Payload envoyé à Jira :',
            projectData
        );


        const response =
            await api
                .asApp()
                .requestJira(
                    route`/rest/api/3/project`,
                    {

                        method: 'POST',

                        headers: {

                            Accept:
                                'application/json',

                            'Content-Type':
                                'application/json',
                        },

                        body:
                            JSON.stringify(
                                projectData
                            ),
                    }
                );


        console.log(
            '[createProgram] Jira status:',
            response.status
        );


        const responseText =
            await response.text();


        if (!response.ok) {

            console.error(
                '[createProgram] Jira error:',
                responseText
            );


            throw new Error(
                `Impossible de créer le projet Jira : ${response.status} ${responseText}`
            );
        }


        /**
         * =====================================================
         * PARSING RÉPONSE JIRA
         * =====================================================
         */

        let project;


        try {

            project =
                JSON.parse(
                    responseText
                );

        } catch (error) {

            console.error(
                '[createProgram] Erreur parsing Jira:',
                error
            );


            throw new Error(
                'Réponse Jira invalide lors de la création du projet.'
            );
        }


        console.log(
            '[createProgram] Projet Jira créé :',
            project
        );


        /**
         * =====================================================
         * SAUVEGARDE MÉTADONNÉES
         * =====================================================
         */

        const metadata =
            await saveProgramMetadata(
                project.id,
                {

                    sponsor,

                    startDate,

                    endDate,

                    status,

                    budget,

                    budgetCons,

                    typeJira,

                    template,
                }
            );


        console.log(
            '[createProgram] Métadonnées sauvegardées :',
            metadata
        );


        /**
         * =====================================================
         * RETOUR
         * =====================================================
         */

        return {

            id:
                project.id,

            key:
                project.key,

            self:
                project.self,

            name:
                project.name,

            metadata,
        };
    }
);


/**
 * =========================================================
 * MODIFIER UN PROJET / PROGRAMME JIRA
 * =========================================================
 */

resolver.define(
    'updateProgram',
    async (request) => {

        console.log(
            '[updateProgram] START'
        );


        const data =
            request.payload || {};


        console.log(
            '[updateProgram] Payload reçu :',
            data
        );


        const {

            projectId,

            projectKey,

            name,

            description,

            axle,

            responsable,

            sponsor,

            startDate,

            endDate,

            status,

            budget,

            budgetCons,

            typeJira,

            template,

        } = data;


        /**
         * =====================================================
         * VALIDATION
         * =====================================================
         */

        if (!projectId) {

            throw new Error(
                'L’identifiant du projet Jira est obligatoire.'
            );
        }


        if (
            !name ||
            !name.trim()
        ) {

            throw new Error(
                'Le nom du programme est obligatoire.'
            );
        }


        if (!responsable) {

            throw new Error(
                'Le responsable est obligatoire.'
            );
        }


        /**
         * =====================================================
         * PAYLOAD JIRA
         * =====================================================
         */

        const projectData = {

            name:
                name.trim(),

            description:
                description || '',

            leadAccountId:
                responsable,
        };


        /**
         * Axe stratégique = catégorie Jira.
         */

        if (axle) {

            const numericAxle =
                Number(axle);


            if (
                Number.isNaN(
                    numericAxle
                )
            ) {

                throw new Error(
                    'L’axe stratégique sélectionné est invalide.'
                );
            }


            projectData.categoryId =
                numericAxle;
        }


        console.log(
            '[updateProgram] Payload envoyé à Jira :',
            projectData
        );


        /**
         * =====================================================
         * MISE À JOUR JIRA
         * =====================================================
         */

        const response =
            await api
                .asApp()
                .requestJira(
                    route`/rest/api/3/project/${projectId}`,
                    {

                        method: 'PUT',

                        headers: {

                            Accept:
                                'application/json',

                            'Content-Type':
                                'application/json',
                        },

                        body:
                            JSON.stringify(
                                projectData
                            ),
                    }
                );


        console.log(
            '[updateProgram] Jira status:',
            response.status
        );


        const responseText =
            await response.text();


        console.log(
            '[updateProgram] Jira response:',
            responseText
        );


        if (!response.ok) {

            console.error(
                '[updateProgram] Jira error:',
                responseText
            );


            throw new Error(
                `Impossible de modifier le projet Jira : ${response.status} ${responseText}`
            );
        }


        /**
         * =====================================================
         * PARSING
         * =====================================================
         */

        let project = {};


        if (responseText) {

            try {

                project =
                    JSON.parse(
                        responseText
                    );

            } catch (error) {

                console.warn(
                    '[updateProgram] Réponse Jira non JSON :',
                    responseText
                );

                project = {};
            }
        }


        console.log(
            '[updateProgram] Projet Jira modifié :',
            project
        );


        /**
         * =====================================================
         * MISE À JOUR DES MÉTADONNÉES
         * =====================================================
         */

        const metadata =
            await saveProgramMetadata(
                projectId,
                {

                    sponsor,

                    startDate,

                    endDate,

                    status,

                    budget,

                    budgetCons,

                    typeJira,

                    template,
                }
            );


        console.log(
            '[updateProgram] Métadonnées mises à jour :',
            metadata
        );


        /**
         * =====================================================
         * RETOUR
         * =====================================================
         */

        return {

            id:
                project.id ||
                projectId,

            key:
                project.key ||
                projectKey ||
                '',

            self:
                project.self ||
                '',

            name:
                project.name ||
                name,

            metadata,
        };
    }
);


/**
 * =========================================================
 * SUPPRESSION DU PROJET JIRA
 * =========================================================
 */

resolver.define(
    'deleteProgram',
    async (request) => {

        console.log(
            '[deleteProgram] START'
        );


        const data =
            request.payload || {};


        console.log(
            '[deleteProgram] Payload reçu :',
            data
        );


        const {
            projectId,
        } = data;


        /**
         * =====================================================
         * VALIDATION
         * =====================================================
         */

        if (!projectId) {

            throw new Error(
                'L’identifiant du projet Jira est obligatoire.'
            );
        }


        console.log(
            '[deleteProgram] Suppression du projet Jira :',
            projectId
        );


        /**
         * =====================================================
         * SUPPRESSION JIRA
         * =====================================================
         */

        const response =
            await api
                .asApp()
                .requestJira(
                    route`/rest/api/3/project/${projectId}`,
                    {

                        method: 'DELETE',

                        headers: {

                            Accept:
                                'application/json',
                        },
                    }
                );


        console.log(
            '[deleteProgram] Jira status:',
            response.status
        );


        /**
         * =====================================================
         * ERREUR JIRA
         * =====================================================
         */

        if (!response.ok) {

            const responseText =
                await response.text();


            console.error(
                '[deleteProgram] Jira error:',
                responseText
            );


            throw new Error(
                `Impossible de supprimer le projet Jira : ${response.status} ${responseText}`
            );
        }


        /**
         * =====================================================
         * SUPPRESSION MÉTADONNÉES KVS
         * =====================================================
         */

        try {

            await deleteProgramMetadata(
                projectId
            );

            console.log(
                '[deleteProgram] Métadonnées KVS supprimées :',
                projectId
            );

        } catch (storageError) {

            /**
             * Jira a déjà été supprimé.
             *
             * On ne transforme donc pas une suppression Jira
             * réussie en échec à cause du Storage.
             */

            console.error(
                '[deleteProgram] Erreur suppression metadata KVS:',
                storageError
            );
        }


        /**
         * =====================================================
         * SUCCÈS
         * =====================================================
         */

        console.log(
            '[deleteProgram] Projet Jira supprimé avec succès :',
            projectId
        );


        return {

            success:
                true,

            id:
                projectId,
        };
    }
);


/**
 * =========================================================
 * VÉRIFIER LA PERMISSION DE CRÉATION
 * =========================================================
 */

resolver.define(
    'checkProjectCreationPermission',
    async () => {

        console.log(
            '[checkProjectCreationPermission] START'
        );


        const response =
            await api
                .asApp()
                .requestJira(
                    route`/rest/api/3/mypermissions?permissions=ADMINISTER`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );


        console.log(
            '[checkProjectCreationPermission] Jira status:',
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                '[checkProjectCreationPermission] Jira error:',
                errorText
            );


            throw new Error(
                `Impossible de vérifier les permissions Jira : ${response.status} ${errorText}`
            );
        }


        const permissions =
            await response.json();


        console.log(
            '[checkProjectCreationPermission] Permissions:',
            permissions
        );


        return permissions;
    }
);


/**
 * =========================================================
 * RÉCUPÉRER LES TEMPLATES JIRA
 * =========================================================
 */

resolver.define(
    'getProjectTemplates',
    async () => {

        console.log(
            '[getProjectTemplates] START'
        );


        const response =
            await api
                .asApp()
                .requestJira(
                    route`/rest/api/3/project-templates`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );


        console.log(
            '[getProjectTemplates] Jira status:',
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                '[getProjectTemplates] Jira error:',
                errorText
            );


            throw new Error(
                `Impossible de récupérer les templates Jira : ${response.status} ${errorText}`
            );
        }


        const templates =
            await response.json();


        console.log(
            '[getProjectTemplates] Jira templates:',
            templates
        );


        return templates;
    }
);


/**
 * =========================================================
 * RÉCUPÉRER LES TYPES DE PROJETS JIRA
 * =========================================================
 */

resolver.define(
    'getAccessibleProjectTypes',
    async () => {

        console.log(
            '[getAccessibleProjectTypes] START'
        );


        const response =
            await api
                .asApp()
                .requestJira(
                    route`/rest/api/3/project/type/accessible`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );


        console.log(
            '[getAccessibleProjectTypes] Jira status:',
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                '[getAccessibleProjectTypes] Jira error:',
                errorText
            );


            throw new Error(
                `Impossible de récupérer les types de projets Jira : ${response.status} ${errorText}`
            );
        }


        const projectTypes =
            await response.json();


        console.log(
            '[getAccessibleProjectTypes] Jira project types:',
            projectTypes
        );


        return projectTypes.map(
            (projectType) => ({

                key:
                    projectType.key,

                name:
                    projectType.formattedKey ||
                    projectType.name ||
                    projectType.key,

                description:
                    projectType.description ||
                    '',
            })
        );
    }
);


/**
 * =========================================================
 * RÉCUPÉRER LES CATÉGORIES JIRA
 * =========================================================
 */

resolver.define(
    'getProjectCategories',
    async () => {

        console.log(
            '[getProjectCategories] START'
        );


        const response =
            await api
                .asApp()
                .requestJira(
                    route`/rest/api/3/projectCategory`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );


        console.log(
            '[getProjectCategories] Jira status:',
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                '[getProjectCategories] Jira error:',
                errorText
            );


            throw new Error(
                `Impossible de récupérer les catégories Jira : ${response.status} ${errorText}`
            );
        }


        const categories =
            await response.json();


        console.log(
            '[getProjectCategories] Jira categories:',
            categories
        );


        return categories.map(
            (category) => ({

                id:
                    category.id,

                name:
                    category.name,

                description:
                    category.description ||
                    '',
            })
        );
    }
);


/**
 * =========================================================
 * RECHERCHER LES UTILISATEURS JIRA
 * =========================================================
 */

resolver.define(
    'searchUsers',
    async (request) => {

        const query =
            request.payload?.query?.trim() ||
            '';


        console.log(
            '[searchUsers] START'
        );


        console.log(
            '[searchUsers] Query:',
            query
        );


        if (!query) {

            return [];
        }


        const response =
            await api
                .asApp()
                .requestJira(
                    route`/rest/api/3/user/search?query=${query}&maxResults=20`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );


        console.log(
            '[searchUsers] Jira status:',
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                '[searchUsers] Jira error:',
                errorText
            );


            throw new Error(
                `Impossible de rechercher les utilisateurs Jira : ${response.status} ${errorText}`
            );
        }


        const users =
            await response.json();


        console.log(
            '[searchUsers] Users returned:',
            users
        );


        return users.map(
            (user) => ({

                accountId:
                    user.accountId,

                displayName:
                    user.displayName,

                emailAddress:
                    user.emailAddress ||
                    '',

                active:
                    user.active,
            })
        );
    }
);


/**
 * =========================================================
 * RÉCUPÉRER LES PROJETS JIRA
 * =========================================================
 *
 * On récupère :
 *
 * 1. les données natives Jira
 * 2. les métadonnées KVS
 *
 * puis on fusionne les deux.
 *
 * Ainsi les données métier sont conservées
 * après un F5 / rechargement.
 * =========================================================
 */

resolver.define(
    'getProjects',
    async () => {

        console.log(
            '[getProjects] START'
        );


        /**
         * =====================================================
         * RÉCUPÉRATION JIRA
         * =====================================================
         */

        const response =
            await api
                .asApp()
                .requestJira(
                    route`/rest/api/3/project/search?startAt=0&maxResults=50`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );


        console.log(
            '[getProjects] Jira status:',
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                '[getProjects] Jira error:',
                errorText
            );


            throw new Error(
                `Impossible de récupérer les projets Jira : ${response.status} ${errorText}`
            );
        }


        const result =
            await response.json();


        console.log(
            '[getProjects] Jira response:',
            result
        );


        const projects =
            Array.isArray(result.values)
                ? result.values
                : [];


        console.log(
            '[getProjects] Nombre de projets Jira:',
            projects.length
        );


        /**
         * =====================================================
         * RÉCUPÉRATION DES MÉTADONNÉES KVS
         * =====================================================
         */

        const projectsWithMetadata =
            await Promise.all(

                projects.map(
                    async (project) => {

                        const metadata =
                            await getProgramMetadata(
                                project.id
                            );


                        return {

                            /**
                             * ---------------------------------
                             * DONNÉES JIRA
                             * ---------------------------------
                             */

                            id:
                                project.id,

                            jiraId:
                                project.id,

                            key:
                                project.key,

                            projectKey:
                                project.key,

                            jiraKey:
                                project.key,

                            name:
                                project.name,

                            description:
                                project.description ||
                                '',

                            projectTypeKey:
                                project.projectTypeKey ||
                                '',

                            typeJira:
                                metadata.typeJira ||
                                project.projectTypeKey ||
                                '',

                            style:
                                project.style ||
                                '',

                            leadAccountId:
                                project.lead?.accountId ||
                                '',

                            responsable:
                                project.lead?.accountId ||
                                '',

                            categoryId:
                                project.projectCategory?.id ||
                                '',

                            axle:
                                project.projectCategory?.id ||
                                '',

                            avatarUrls:
                                project.avatarUrls ||
                                {},

                            self:
                                project.self ||
                                '',

                            jiraUrl:
                                project.self ||
                                '',


                            /**
                             * ---------------------------------
                             * MÉTADONNÉES KVS
                             * ---------------------------------
                             */

                            sponsor:
                                metadata.sponsor ||
                                '',

                            startDate:
                                metadata.startDate ||
                                '',

                            endDate:
                                metadata.endDate ||
                                '',

                            status:
                                metadata.status ||
                                'EN COURS',

                            budget:
                                metadata.budget ||
                                '',

                            budgetCons:
                                metadata.budgetCons ||
                                '',

                            template:
                                metadata.template ||
                                '',
                        };
                    }
                )
            );


        console.log(
            '[getProjects] Projets enrichis :',
            projectsWithMetadata
        );


        console.log(
            '[getProjects] Nombre final de programmes :',
            projectsWithMetadata.length
        );


        return projectsWithMetadata;
    }
);


/**
 * =========================================================
 * RÉCUPÉRER LES ISSUES
 * =========================================================
 */

resolver.define(
    'getIssues',
    async (request) =>
        getIssues(
            request.payload
        )
);


/**
 * =========================================================
 * EXPORT FORGE
 * =========================================================
 */

export const handler =
    resolver.getDefinitions();