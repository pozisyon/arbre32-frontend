# Arbre32 Pro Frontend (React + Vite + Tailwind)

Frontend "pro" pour le jeu Arbre32, adapté à un backend Spring Boot avec :
- Authentification **email + mot de passe** (JWT)
- API REST pour les parties
- WebSocket STOMP (/ws, /topic/chat/{id}, /app/chat/{id})

## Endpoints attendus côté backend

- `POST /api/auth/login` → `{ email, password }` → `{ token, user }`
- `POST /api/auth/register` → `{ email, password }`
- `GET  /api/games/open` → liste des parties pour le lobby
- `POST /api/games` → `{ players: string[], deckType: "32" | "52" }` → GameDTO
- `GET  /api/games/{id}` → GameDTO
- `POST /api/games/{id}/play` → `{ cardId }` → GameDTO
- WebSocket STOMP sur `/ws`
  - Souscription chat : `/topic/chat/{gameId}`
  - Envoi chat : `/app/chat/{gameId}`

Adapte les chemins si ton backend diffère (fichiers `src/api/*.ts` et `src/context/*.tsx`).

## Démarrage

```bash
npm install
npm run dev
```

Variables d'environnement optionnelles (fichier `.env` à la racine) :

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
```

