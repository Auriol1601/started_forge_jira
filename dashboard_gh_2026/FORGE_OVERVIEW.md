# Présentation de Forge (pour ce projet)

Ce document explique brièvement le fonctionnement de Forge (Atlassian Forge) et les commandes utiles pour développer, tester et déployer une application Forge avec une Custom UI.

## Concepts clés

- **App manifest (`manifest.yml`)** : décrit les modules (jira-full-page, webtrigger, etc.), permissions et points d'entrée (fonction cloud, static UI). Voir le fichier `manifest.yml` du projet.
- **Fonctions (Serverless)** : code backend exécuté dans l'environnement Forge (JavaScript/TypeScript). Elles sont définies dans le manifest et empaquetées lors du déploiement.
- **Custom UI (Static)** : interface React/JS servie par Forge ou en local via un tunnel (`forge tunnel`). Le dossier `static/hello-world` contient l'UI de cet exemple.
- **Bridge (`@forge/bridge`)** : bibliothèque utilisée par la Custom UI pour communiquer avec les fonctions Forge (invoke, storage, etc.). Le bridge ne fonctionne que dans le contexte d'un produit Atlassian connecté (ou via `forge tunnel`).

## Flux de développement recommandé

1. Installer les dépendances du projet principal :

```powershell
cd dashboard_gh_2026
npm install
```

2. Installer et lancer l'UI localement (si vous modifiez l'UI) :

```powershell
cd dashboard_gh_2026\static\hello-world
npm install --legacy-peer-deps   # si conflits de peer deps
npm start                        # démarre le dev server (http://localhost:3000)
```

3. Pour permettre à la Custom UI locale de communiquer avec Forge (bridge), utiliser le tunnel :

```powershell
cd dashboard_gh_2026
forge tunnel
```

Le tunnel redirige les requêtes depuis Atlassian (où l'app est installée) vers votre machine locale. Rechargez la page Atlassian où l'app est installée pour établir la connexion.

4. Déployer les changements (backend / manifest) :

```powershell
cd dashboard_gh_2026
forge deploy
```

5. Installer l'app sur un site Atlassian (si nécessaire) :

```powershell
forge install
```

6. Utiliser `forge logs` et `forge tunnel` pour le debug en temps réel :

```powershell
forge logs -f        # suivre les logs
forge tunnel         # pour la Custom UI locale
```

## Erreurs courantes et solutions

- `BridgeAPIError: Unable to establish a connection with the Custom UI bridge` : signifie que la Custom UI essaye d'utiliser `@forge/bridge` hors du contexte Atlassian. Solution : soit utiliser l'UI servie par Forge après `forge deploy`, soit exécuter `forge tunnel` et ouvrir la page Jira où l'app est installée.
- `ENOENT: could not read package.json` : vous exécutez `npm` depuis un dossier sans `package.json`. Placez-vous dans `dashboard_gh_2026` ou `static/hello-world`.
- Conflits de peer-deps lors de `npm install` : relancer avec `--legacy-peer-deps` ou résoudre les versions dans `package.json`.

## Bonnes pratiques

- Modifiez l'UI dans `static/hello-world/src` et testez en local avec `npm start` + `forge tunnel`.
- Déployez fréquemment les changements back-end (fonctions/manifest) avec `forge deploy`.
- Tenir à jour les dépendances et surveiller les warnings de sécurité (`npm audit`).

## Liens utiles

- Docs Forge : https://developer.atlassian.com/platform/forge/
- Tunnel & Custom UI : https://go.atlassian.com/forge-tunneling-with-custom-ui

---
Ce fichier a été ajouté automatiquement pour vous aider à démarrer. Voulez-vous que j'y ajoute des instructions spécifiques à ce projet (manifest, commandes supplémentaires) ?

## Arborescence du projet et où personnaliser l'UI

Voici l'arborescence essentielle du projet (chemins relatifs à `dashboard_gh_2026`) :

- `manifest.yml` — décrit les modules et ressources. Ce projet référence la ressource `main` pointant vers `static/hello-world/build`.
- `package.json` — scripts et dépendances pour le projet (racine).
- `src/index.js` — fonctions serverless (resolver). C'est ici que sont définies les fonctions invoquées par la Custom UI (ex: `getText`).
- `static/hello-world/` — dossier de la Custom UI React :
	- `src/` — code source React à modifier (`App.js`, `index.js`, etc.).
	- `public/index.html` — page HTML d'entrée (`div#root`).
	- `package.json` — dépendances et scripts pour l'UI (`npm start`, `npm run build`).
	- `build/` — output du build (`npm run build`) ; ce dossier est déployé par Forge (référencé dans `manifest.yml`).

Mapping important :
- Pendant le développement local vous modifiez `static/hello-world/src` et lancez `npm start`.
- Pour que la Custom UI locale communique avec Forge, lancez `forge tunnel` depuis la racine du projet et ouvrez la page Atlassian où l'app est installée.
- Quand vous êtes prêt à déployer l'UI tel quel, exécutez `npm run build` dans `static/hello-world` puis `forge deploy` depuis la racine — Forge utilisera `static/hello-world/build` comme ressource statique.

Conseils rapides pour personnaliser l'UI :
- Modifier `static/hello-world/src/App.js` (ou ajouter de nouveaux composants). Le dev server (http://localhost:3000) affiche les changements en live.
- Si votre UI appelle des fonctions Forge via `invoke`, vérifiez que les noms (`getText`, etc.) correspondent à ceux définis dans `src/index.js` et au `manifest.yml`.
- Après un `npm run build`, vérifiez que `static/hello-world/build/index.html` contient bien le `div#root` attendu.

Si vous voulez, je peux :
- Ajouter un schéma visuel plus détaillé de l'arborescence, ou
- Documenter le `manifest.yml` du projet en ligne à ligne.

