import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { getIssues } from './forge/handlers.js';

const resolver = new Resolver();

/**
 * Test du resolver existant
 */
resolver.define('getText', (req) => {
    console.log(req);

    return 'Hello world!';
});
/**
 * Test creer un projet jira .
 */

resolver.define('createProgram', async (request) => {
    console.log('[createProgram] START');

    const data = request.payload || {};

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
    } = data;

    console.log('[createProgram] projectKey brut :', projectKey);
    console.log('[createProgram] typeof projectKey :', typeof projectKey);
    console.log('[createProgram] name :', name);
    console.log('[createProgram] responsable :', responsable);
    console.log('[createProgram] typeJira :', typeJira);

    /*
     * ==============================
     * VALIDATION
     * ==============================
     */

    if (!name || !name.trim()) {
        throw new Error(
            'Le nom du programme est obligatoire.'
        );
    }

    if (!projectKey || !projectKey.trim()) {
        throw new Error(
            'La clé du projet Jira est obligatoire.'
        );
    }

    const normalizedProjectKey =
        projectKey.trim().toUpperCase();

    /*
     * Jira :
     * uniquement lettres et chiffres.
     */
    if (!/^[A-Z0-9]+$/.test(normalizedProjectKey)) {
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

    if (!responsable) {
        throw new Error(
            'Le responsable est obligatoire.'
        );
    }

    if (!typeJira) {
        throw new Error(
            'Le type Jira est obligatoire.'
        );
    }

    /*
     * ==============================
     * VÉRIFICATION DE LA CLÉ
     * ==============================
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

    /*
     * 200 = projet déjà existant
     */
    if (existingProjectResponse.ok) {
        throw new Error(
            `La clé Jira "${normalizedProjectKey}" est déjà utilisée.`
        );
    }

    /*
     * ==============================
     * CRÉATION DU PROJET
     * ==============================
     */

    const projectData = {
        name: name.trim(),
        key: normalizedProjectKey,
        projectTypeKey: typeJira,
        description: description || '',
        leadAccountId: responsable,
    };

    /*
     * Axe stratégique = catégorie Jira
     */
    if (axle) {
        projectData.categoryId = Number(axle);
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
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify(projectData),
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

    const project =
        JSON.parse(responseText);

    console.log(
        '[createProgram] Projet Jira créé :',
        project
    );

    return {
        id: project.id,
        key: project.key,
        self: project.self,
        name: project.name,
    };
});

/**
 * Test d'autorisation compte jira associez pour creer un projet .
 */

resolver.define('checkProjectCreationPermission', async () => {
    console.log('[checkProjectCreationPermission] START');

    const response = await api
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
        const errorText = await response.text();

        console.error(
            '[checkProjectCreationPermission] Jira error:',
            errorText
        );

        throw new Error(
            `Impossible de vérifier les permissions Jira : ${response.status} ${errorText}`
        );
    }

    const permissions = await response.json();

    console.log(
        '[checkProjectCreationPermission] Permissions:',
        permissions
    );

    return permissions;
});

/**
 * Récupère les templates de projets Jira disponibles.
 */
resolver.define('getProjectTemplates', async () => {
    console.log('[getProjectTemplates] START');

    const response = await api
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
        const errorText = await response.text();

        console.error(
            '[getProjectTemplates] Jira error:',
            errorText
        );

        throw new Error(
            `Impossible de récupérer les templates Jira : ${response.status} ${errorText}`
        );
    }

    const templates = await response.json();

    console.log(
        '[getProjectTemplates] Jira templates:',
        templates
    );

    return templates;
});

/**
 * Vérifie les types de projets Jira accessibles
 * à l'application/utilisateur.
 */
resolver.define('getAccessibleProjectTypes', async () => {
    console.log('[getAccessibleProjectTypes] START');

    const response = await api
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
        const errorText = await response.text();

        console.error(
            '[getAccessibleProjectTypes] Jira error:',
            errorText
        );

        throw new Error(
            `Impossible de récupérer les types de projets Jira : ${response.status} ${errorText}`
        );
    }

    const projectTypes = await response.json();

    console.log(
        '[getAccessibleProjectTypes] Jira project types:',
        projectTypes
    );

    return projectTypes;
});

/**
 * Récupère les catégories de projets Jira.
 *
 * Ces catégories représentent les axes stratégiques
 * dans notre interface personnalisée.
 */
resolver.define('getProjectCategories', async () => {
    console.log('[getProjectCategories] START');

    const response = await api
        .asApp()
        .requestJira(route`/rest/api/3/projectCategory`, {
            headers: {
                Accept: 'application/json',
            },
        });

    console.log(
        '[getProjectCategories] Jira status:',
        response.status
    );

    if (!response.ok) {
        const errorText = await response.text();

        console.error(
            '[getProjectCategories] Jira error:',
            errorText
        );

        throw new Error(
            `Impossible de récupérer les catégories Jira : ${response.status} ${errorText}`
        );
    }

    const categories = await response.json();

    console.log(
        '[getProjectCategories] Jira categories:',
        categories
    );

    return categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description || '',
    }));
});

resolver.define('searchUsers', async (request) => {
    const query = request.payload?.query?.trim() || '';

    console.log('[searchUsers] START');
    console.log('[searchUsers] Query:', query);

    if (!query) {
        return [];
    }

    const response = await api
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
        const errorText = await response.text();

        console.error(
            '[searchUsers] Jira error:',
            errorText
        );

        throw new Error(
            `Impossible de rechercher les utilisateurs Jira : ${response.status} ${errorText}`
        );
    }

    const users = await response.json();

    console.log(
        '[searchUsers] Users returned:',
        users
    );

    return users.map((user) => ({
        accountId: user.accountId,
        displayName: user.displayName,
        emailAddress: user.emailAddress || '',
        active: user.active,
    }));
});
const handleSubmit = async () => {
    console.log('[FRONT] Création du programme démarrée');

    const name = formData.name.trim();
    const projectKey = formData.projectKey.trim().toUpperCase();

    /*
     * Validation du nom
     */
    if (!name) {
        console.warn('[FRONT] Nom du programme obligatoire');
        return;
    }

    /*
     * Validation de la clé Jira
     *
     * Lettres et chiffres uniquement.
     */
    const projectKeyRegex = /^[A-Z0-9]+$/;

    if (!projectKey) {
        console.warn('[FRONT] Clé Jira obligatoire');
        return;
    }

    if (!projectKeyRegex.test(projectKey)) {
        console.warn(
            '[FRONT] Clé Jira invalide :',
            projectKey
        );

        return;
    }

    if (projectKey.length < 2 || projectKey.length > 10) {
        console.warn(
            '[FRONT] Longueur de clé Jira invalide'
        );

        return;
    }

    /*
     * Validation du responsable
     */
    if (!formData.responsable) {
        console.warn('[FRONT] Responsable obligatoire');
        return;
    }

    /*
     * Validation du type Jira
     */
    if (!formData.typeJira) {
        console.warn('[FRONT] Type Jira obligatoire');
        return;
    }

    try {
        const payload = {
            name,
            projectKey,
            description: formData.description,
            axle: formData.axle,
            responsable: formData.responsable,
            typeJira: formData.typeJira,
        };

        console.log(
            '[FRONT] Payload envoyé à createProgram :',
            payload
        );

        const result = await invoke(
            'createProgram',
            payload
        );

        console.log(
            '[FRONT] Projet Jira créé :',
            result
        );

        const program = {
            id: result.id,
            jiraKey: result.key,

            name,
            projectKey,

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
            description: formData.description,
        };

        setPrograms((prev) => [
            program,
            ...prev,
        ]);

        setSelectedId(program.id);

        console.log(
            '[FRONT] Programme ajouté au tableau :',
            program
        );

    } catch (error) {
        console.error(
            '[FRONT] Erreur création programme :',
            error
        );
    }
};

resolver.define('getIssues', async (request) => getIssues(request.payload));

export const handler = resolver.getDefinitions();