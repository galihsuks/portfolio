# Portfolio Galih (Next.js)

Portfolio website with integrated real-time chat module.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand (global state)
- TanStack Query (server state/cache)
- WebSocket (real-time chat/presence)
- next-intl (localization)
- Lenis (smooth scrolling)

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file (or update existing):

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_WS=ws://localhost:8080
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
NEXT_PUBLIC_URL_CV=

CHAT_OWNER_CODE=*****
CHAT_OWNER_EMAIL=*****
CHAT_OWNER_PASSWORD=*****
GENERATED_PASSWORD=*****
```

3. Start dev server:

```bash
npm run dev
```

App runs at `http://localhost:3001`.

## Scripts

- `npm run dev` - run development server on port `3001`
- `npm run build` - production build
- `npm run start` - run production server on port `3001`
- `npm run lint` - run ESLint

## Chat Architecture (Summary)

- Entry component: `src/app/components/ChatApp.tsx`
- Unauthenticated flow: `src/app/components/ChatAppNoLogin.tsx`
- Auth state: `src/app/chat/store/auth.store.ts`
- Rooms state + realtime reducer: `src/app/chat/store/roomsMain.store.ts`
- WebSocket client: `src/app/chat/store/ws.store.ts`
- Online members state: `src/app/chat/store/onlineMembers.store.ts`
- Query hooks:
  - Rooms: `src/app/chat/hooks/useRooms.ts`
  - Chats: `src/app/chat/hooks/useChatMutations.ts`
  - User: `src/app/chat/hooks/useUser.ts`

### Pre-auth Flow

- Guest opens chat -> bot asks visitor name.
- If input matches owner code -> `/api/chat/owner-login` -> login as owner.
- Otherwise -> `/api/chat/preauth`:
  - detect known visitor (optional confirm),
  - register new guest if needed,
  - login guest,
  - continue to chat.

### 401 Handling

Global API client (`src/app/_services/api/client.ts`) handles `401` by:

- clearing auth store,
- preventing reload loop with session guard,
- hard reloading page.
