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

resolver.define('getIssues', async (request) => getIssues(request.payload));

export const handler = resolver.getDefinitions();