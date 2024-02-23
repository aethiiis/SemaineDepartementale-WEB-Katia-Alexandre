# beeper-starter-2024

## Fonctionnalités :
(testées sous Opera (Chromium) et Firefox)

### Réponses aux beeps
Lors du survol d'un beep avec la souris, une boîte de texte apparaît pour taper une réponse. Les réponses peuvent êtres likées comme les beeps.

### Scroll infini
Lorsque l'on fait défiler la page vers le bas, la page charge automatiquement les beeps suivants.

### Barre de recherche
Une barre de recherche permet de trouver les utilisateurs par leur nom. Comme elle fonctionne avec une requête SQL utilisant LIKE, il suffit de taper les premières lettres du nom d'utilisateur pour qu'il apparaisse dans la liste des correspondances.

Pour commencer :

 - Run `npm install` pour installer toutes les dépendances listées dans le `package.json`
 - Mettre un `.env` avec toutes les bonnes variables pour se connecter à la base de données et à Auth0 (demander à un camarade pour un modèle de `.env`)
 - Lancer le serveur avec `node server.js` (ou `npx nodemon server.js` pour qu'il redémarre automatiquement quand un fichier change)
