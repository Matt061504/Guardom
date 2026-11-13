# CLAUDE.md — Guardom

Fichier de contexte pour Claude Code. Décrit le projet, la stack, les commandes et les conventions pour que toute nouvelle session Claude reprenne sans perte d'information.

## Vue d'ensemble

**Guardom** : site vitrine statique en français pour une entreprise de domotique et sécurité connectée à Toulouse (particuliers, commerces, garages, petites entreprises). Trois offres : SMART (domotique Home Assistant), PROTECT (sécurité connectée), CARE (maintenance/dépannage).

- Site **privé** : `noindex, nofollow` + `robots.txt Disallow: /`. Retirer avant publication publique.
- **Aucune donnée collectée par défaut** : le formulaire télécharge un récapitulatif local tant que `contactEndpoint` n'est pas configuré.
- Hébergement : OpenAI Sites (`.openai/hosting.json`, project_id `appgprj_6ac7f41a1c0c8191956aca100a7f0ad7`). Garder cet identifiant ; ne pas créer un nouveau Site pour une modification.
- Dépôt GitHub : https://github.com/Matt061504/Guardom
- Branche principale : `main`

## Stack

- HTML/CSS/JS statique, **aucune dépendance runtime**, **aucun build tool** (pas de npm/yarn/vite/webpack).
- Génération : un seul script Node sans dépendances : `generate.mjs` (ESM, utilise uniquement `node:fs/promises`).
- Polices : Montserrat + Inter hébergées localement (`dist/assets/font-*.ttf`, licences incluses).
- Icônes : SVG inline générées par `generate.mjs` depuis l'objet `paths` (pas de Font Awesome).
- Palette : `#0B2D5B`, `#007DFF`, `#00C2FF`, `#1F2937`, `#F3F4F6`, blanc.

## Architecture

```
Guardom/
├── generate.mjs              # Générateur unique : produit tout dist/*.html
├── README.md                 # Doc utilisateur (personnalisation, mise en ligne)
├── CLAUDE.md                 # Ce fichier
├── .gitignore                # .DS_Store, .sites-runtime/, node_modules/, archives
├── .openai/hosting.json      # Config OpenAI Sites (ne pas modifier project_id)
├── .claude/settings.local.json  # Permissions Claude Code locales (git, cp)
└── dist/                     # Sortie servie telle quelle
    ├── index.html            # Accueil
    ├── services/index.html   # SMART/PROTECT/CARE
    ├── approche/index.html   # Méthode + Home Assistant
    ├── contact/index.html    # Formulaire de devis
    ├── informations/index.html  # Mentions + confidentialité
    ├── 404.html
    ├── robots.txt            # Disallow: / (à retirer avant publication)
    └── assets/
        ├── style.css         # Styles (à la main, pas généré)
        ├── app.js            # Logique front : menu, scénarios, formulaire
        ├── config.js         # Coordonnées + endpoint (à compléter côté client)
        ├── fonts.css
        ├── font-0..7.ttf     # Montserrat + Inter
        ├── guardom-logo-charte.png
        ├── guardom-favicon-charte.png
        └── maison-guardom.webp  # Visuel d'ambiance (généré, pas client)
```

**Important** : `style.css` et `app.js` ne sont PAS générés par `generate.mjs`. Seuls les HTML sont régénérés. Les éditer directement dans `dist/assets/`.

## Commandes

### Régénérer les HTML
```bash
node generate.mjs
```
Écrit dans `dist/` ; les assets existants (CSS, JS, polices, images) sont conservés.

### Prévisualiser en local
```bash
python3 -m http.server 3187 --directory dist
```
Puis ouvrir http://localhost:3187/. Les liens sont relatifs à la racine du domaine.

### Pas de build, pas de tests, pas de lint
Aucun `package.json`, aucun runner. Vérification manuelle dans le navigateur.

### Déploiement
Le dossier `dist/` est publié tel quel sur OpenAI Sites via la config `.openai/hosting.json`. N'importe quel hébergeur statique fonctionne aussi (Netlify, GitHub Pages, S3, etc.).

## Conventions

- **Langue** : français partout (contenu, commentaires, commits). Ponctuation française (`« »`, insécables, apostrophes typographiques `’`).
- **Pas d'invention** : aucun avis, référence client, chiffre, téléphone, adresse, certification ou partenariat inventé. Home Assistant est cité comme technologie utilisée, sans affiliation revendiquée.
- **Garde-fou sécurité** : toujours rappeler qu'une alarme critique doit fonctionner indépendamment de Home Assistant. Présent dans `/services/#protect` et `/approche/`.
- **Logo** : `guardom-logo-charte.png` et `guardom-favicon-charte.png` viennent directement de la planche charte fournie par l'utilisateur. Ne pas régénérer ni réinterpréter ; remplacer par vectoriel original si besoin.
- **Maison** : `maison-guardom.webp` est une illustration générée, pas une réalisation client — toujours libellée « Visuel d'ambiance ».
- **Accessibilité** : skip-link, `aria-current`, `aria-live` sur résultats, `aria-pressed` sur scénarios, focus visibles, respect de `prefers-reduced-motion`.
- **SEO** : `noindex, nofollow` sur toutes les pages tant que le site reste privé. `robots.txt` bloque tout.
- **Pas de tracking** : aucun Google Analytics, pixel, cookie applicatif, carte embarquée, CDN externe.

## Personnalisation à faire avant publication publique

1. Compléter `dist/assets/config.js` : `email`, `phone`, `phoneLink`, `contactEndpoint`, `legalName`, `legalStatus`, `registration`, `address`, `publicationDirector`, `hostingProvider`, `privacyContact`, `retentionPeriod`.
2. Rédiger les mentions légales et la politique de confidentialité réelles dans `generate.mjs` (section `infoPage`) selon l'activité réelle.
3. Si `contactEndpoint` est renseigné : brancher un backend HTTPS qui valide côté serveur, protège contre les abus, limite la taille des entrées, gère les doublons et répond `{"ok": true}` avec statut HTTP réussi. Aucun secret dans `config.js` (public).
4. Retirer `noindex, nofollow` dans `generate.mjs` (fonction `page`) et remplacer `dist/robots.txt` par un fichier autorisant l'indexation.
5. Ajouter l'URL canonique réelle, un sitemap, et ne pas utiliser l'URL temporaire d'hébergement comme domaine d'entreprise.
6. Relancer `node generate.mjs` après chaque modification de contenu.

## État actuel (au 2026-11-13)

- Commit initial unique : `4b315d7 Initial commit: site Guardom complet`.
- Formulaire en mode « préparation » : télécharge localement, rien n'est envoyé.
- `config.js` vide : aucune coordonnée publiée.
- Site privé, non indexable.
- Reste à faire : compléter `config.js`, rédiger mentions + confidentialité, raccorder un backend de contact, basculer en public (retirer noindex/robots) quand prêt.

## Bugs connus / points de vigilance

- Aucun bug identifié à ce jour.
- `generate.mjs` écrit `dist/index.html` deux fois : d'abord avec `home()` seul (ligne 15), puis avec `allHome` complet (ligne 25). Le second écrase le premier ; comportement voulu, ne pas « nettoyer » sans tester.
- Si on ajoute des assets dans `dist/assets/`, ne pas les perdre : `generate.mjs` ne touche pas aux assets, mais une suppression manuelle de `dist/` les emporterait.

## Interactions avec Claude Code

- `.claude/settings.local.json` autorise sans prompt : `git *`, `cp *`, et `git remote -v` sur ce chemin précis.
- Projet synchronisé depuis un dossier ChatGPT project. Si des fichiers apparaissent sous `sources/` au niveau parent, ils sont **en lecture seule** (voir `../AGENTS.md`). Le dossier `Guardom/` lui-même est éditable.
- Attribution des commits : toujours finir par `Co-Authored-By: Claude <noreply@anthropic.com>`.
