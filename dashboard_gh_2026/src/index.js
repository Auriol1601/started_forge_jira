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