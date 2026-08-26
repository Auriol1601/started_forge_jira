import Resolver from '@forge/resolver';
import api from '@forge/api';
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
    const response = await api
        .asApp()
        .requestJira('/rest/api/3/projectCategory', {
            headers: {
                Accept: 'application/json',
            },
        });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Impossible de récupérer les catégories Jira : ${response.status} ${errorText}`
        );
    }

    const categories = await response.json();

    return categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description || '',
    }));
});

resolver.define('getIssues', async (request) => getIssues(request.payload));

export const handler = resolver.getDefinitions();