import api from '@forge/api';

export async function getIssues(context) {
    // context may include payload from invoke; we expect { jql }
    const jql = (context && context.jql) ? context.jql : 'project=GIM';
    const url = `/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=summary,status,assignee,created&maxResults=25`;
    const res = await api.asApp().requestJira(url, {
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Jira request failed: ${res.status} ${text}`);
    }
    const data = await res.json();
    return {
        issues: data.issues || [],
        total: data.total || 0
    };
}
