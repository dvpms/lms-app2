---
inclusion: always
---

# Tech Stack Guidelines

## Package Manager — pnpm

- Use **pnpm** exclusively (faster installs, efficient disk usage via hard links)
- `pnpm add <pkg>` — add dependency
- `pnpm add -D <pkg>` — add dev dependency
- `pnpm run <script>` — run scripts
- `pnpm dlx <cmd>` — instead of `npx`
- `pnpm create next-app@latest` — scaffold Next.js project

## Next.js (App Router)

- Use App Router exclusively — no Pages Router
- Route groups: `(admin)`, `(auth)`, `(student)`
- Server Components by default; use `"use client"` only when needed (interactivity, hooks, browser APIs)
- API routes go in `src/app/api/`
- Use `loading.js`, `error.js`, `not-found.js` conventions per segment

## JavaScript

- No TypeScript — plain JavaScript throughout
- Use ES modules (`import`/`export`)
- Use async/await over `.then()` chains

## Tailwind CSS

- Use `@theme` design system for all design tokens (colors, spacing, typography)
- No inline styles — Tailwind classes only
- Mobile-first responsive design
- Component variants via `clsx` or `cn()` utility

## Prisma ORM v7 + Neon (Serverless)

- **Prisma v7** with **Neon serverless PostgreSQL**
- Use `@prisma/adapter-neon` + `@neondatabase/serverless` for serverless-optimized connections
- No singleton pattern needed — Prisma v7 handles connection management internally
- All DB access goes through `src/lib/prisma.js`
- Migrations via `prisma migrate dev`
- Never expose Prisma client to the client side
- Set `DATABASE_URL` to Neon connection string (pooled) in `.env`

```js
// src/lib/prisma.js
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
export const prisma = new PrismaClient({ adapter })
```

```prisma
// schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Dependencies:
```
prisma@^7
@prisma/client@^7
@prisma/adapter-neon
@neondatabase/serverless
```

## Redux Toolkit + RTK Query

Structure:
```
src/lib/redux/
  store.js
  slices/       # createSlice for global UI/auth state
  api/          # createApi (RTK Query) for server data
```

- Use RTK Query for all server data fetching (not useEffect + fetch)
- Use slices only for truly global client state (e.g., auth session, UI toggles)
- Avoid storing server data in slices — that's RTK Query's job

## Cloudinary (S3 Method)

- Use Cloudinary SDK server-side only
- Upload via signed upload or server-side API route
- Store only the public URL / public_id in the database
- Never expose Cloudinary API secret to the client

## Lucide React

- Import icons individually: `import { BookOpen } from 'lucide-react'`
- Use consistent icon sizing via Tailwind (`size-4`, `size-5`, etc.)

## Framer Motion

- Use for all page/component transitions and game feedback animations
- Import: `import { motion, AnimatePresence } from 'framer-motion'`
- Keep animation variants in a separate `src/lib/animations.js` file
- Use `AnimatePresence` for enter/exit transitions (card slides, game results)
- Avoid animating layout-heavy properties (width/height) — prefer `transform` and `opacity`

## @dnd-kit

- Use for drag-and-drop in Word Arrangement and Multiplication/Division Puzzle games
- Import from `@dnd-kit/core` and `@dnd-kit/sortable`
- Keep drag logic in dedicated game component files
- Use `DndContext`, `SortableContext`, `useSortable` hooks

## Card-Based Learning (Material System)

- No PDF support — materials use Card-Based Learning only
- Material JSON shape:
```js
{
  title: string,
  image: string,       // Cloudinary URL (optional)
  contentArray: [
    { type: 'text' | 'image' | 'heading', value: string }
  ]
}
```
- Admin creates/edits card content via structured form or JSON editor
- Cards rendered as slide components with Framer Motion transitions

## Game System

- 3 games as pure React components (no external game engines):
  1. `WordArrangementGame` — drag-and-drop with `@dnd-kit`
  2. `WordPuzzleGame` — letter grid interaction
  3. `MultiplicationPuzzleGame` — drag-and-drop with `@dnd-kit`
- On completion → call `postActivity` RTK Query mutation:
```js
postActivity({ type: 'GAME', activityId, points })
```

## Authentication — NextAuth.js (Auth.js)

- Use **NextAuth.js** (`next-auth`) with **Credentials provider**
- Passwords hashed with `bcryptjs`
- Use **Prisma adapter** (`@auth/prisma-adapter`) to persist sessions in PostgreSQL
- JWT strategy: `session: { strategy: 'jwt' }`
- Extend JWT and session callbacks to include `role` and `id` fields
- Role-based access: `STUDENT` and `ADMIN`
- Protect routes via `src/middleware.js` using `getToken()` from `next-auth/jwt`

```js
// src/app/api/auth/[...nextauth]/route.js
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null
        return user
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.role = user.role; token.id = user.id }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.user.id = token.id
      return session
    }
  }
}
```
