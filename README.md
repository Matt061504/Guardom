# GUARDOM — Site prêt à personnaliser

Site en français, responsive, sans dépendance d’exécution et sans collecte activée par défaut.

## Pages

- `/` : accueil, services, deux modèles d’activité, scénario interactif, zone et FAQ.
- `/services/` : SMART, PROTECT, CARE et garde-fou sur les alarmes autonomes.
- `/approche/` : méthode, expertise Home Assistant indépendante et zone d’intervention.
- `/contact/` : formulaire validé, récapitulatif et téléchargement local.
- `/informations/` : mentions et confidentialité à compléter.
- `/404.html` : page d’erreur.

## Personnalisation

1. **Logo** : `dist/assets/guardom-logo-charte.png` reprend directement les pixels de la variante horizontale de la planche validée fournie par l’utilisateur. `guardom-favicon-charte.png` reprend son symbole principal. Aucune génération ni réinterprétation du dessin. Ces extraits raster peuvent être remplacés par les fichiers vectoriels originaux pour une netteté supérieure à forte résolution. Le nom et la signature « DOMOTIQUE & SÉCURITÉ CONNECTÉE » sont conservés tels qu’ils figurent dans la charte.
2. **Coordonnées et informations d’entreprise** : compléter `dist/assets/config.js`. Les valeurs vides ne créent aucune fausse coordonnée. Compléter également le texte juridique de `generate.mjs` selon la situation réelle avant ouverture au public.
3. **Contact** : sans configuration, la demande est préparée et téléchargée sur l’appareil seulement. Avec `email`, un lien ouvre la messagerie du visiteur ; il doit envoyer lui-même. Avec `contactEndpoint`, le site envoie un POST JSON HTTPS et exige une réponse JSON `{ "ok": true }` et un statut HTTP réussi pour confirmer la réception. Le backend est à raccorder ; il doit valider côté serveur, protéger contre les abus, gérer les doublons, limiter la taille des entrées et assurer la réception effective avant réponse. Aucun secret ne doit être placé dans la configuration publique.
4. **Confidentialité** : compléter identité du responsable, finalité, base légale, destinataires/service de réception, contact et droits, durée de conservation et hébergeur avant activation du contact/publication publique. Les champs configurables ne remplacent pas la rédaction des informations requises pour l’activité réelle.
5. **Contenu** : modifier `generate.mjs`, puis exécuter `node generate.mjs`. Le résultat est écrit dans `dist/` ; les fichiers d’assets sont conservés.
6. **Référencement** : le site est privé et comporte `noindex, nofollow` et un fichier robots qui bloque l’indexation. Avant publication publique, retirer ces restrictions, ajouter le domaine public réel, ses URL canoniques et un sitemap. Ne pas utiliser une URL temporaire comme domaine d’entreprise.

## Aperçu et mise en ligne

Servir le dossier `dist` avec un serveur HTTP (par exemple `python3 -m http.server 3187 --directory dist`). Les liens sont relatifs à la racine du domaine. Le dossier `dist` peut être hébergé sur un hébergement statique. Sites conserve son identifiant dans `.openai/hosting.json` ; ne pas créer de nouveau Site pour une modification.

## Ressources et choix

- Palette : #0B2D5B, #007DFF, #00C2FF, #1F2937, #F3F4F6 et blanc.
- Montserrat et Inter hébergées localement ; fichiers et licences dans `dist/assets`.
- Icônes vectorielles outline intégrées.
- Maison : image illustrative générée pour ce site, pas une réalisation client.
- Aucun avis, référence client, résultat chiffré, numéro de téléphone ou adresse d’entreprise inventé.
- Home Assistant : description vérifiée sur https://www.home-assistant.io/ ; aucun partenariat ou certification revendiqué.
- Aucun outil d’analyse, publicité, cookie applicatif ou suivi marketing ajouté.
- Contrôles : menu mobile, scénarios illustratifs, FAQ native, choix de services, préselection par URL, champs requis, formats, consentement de lecture, résultat téléchargeable. Réduction des animations selon préférence système, navigation clavier, focus visibles.
