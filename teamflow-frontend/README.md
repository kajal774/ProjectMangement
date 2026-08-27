# TeamFlow — Frontend

React + TypeScript frontend for TeamFlow, a small project-management app.
This is the **frontend only**. It expects a Spring Boot backend running at
`http://localhost:8080/api` (see the API contract below) — you'll generate
that project separately.

## Stack

- **Vite** — dev server / build tool
- **React 18 + TypeScript**
- **React Router** — client-side routing
- **TanStack React Query** — server state (fetching, caching, invalidation)
- **React Hook Form + Zod** — forms and validation
- **Axios** — HTTP client
- **Tailwind CSS** — styling

## Getting started

1. Install [Node.js](https://nodejs.org/) 18 or later.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file and adjust if needed:
   ```bash
   cp .env.example .env
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:5173

The app will show a login screen. Until the backend exists, login/register
calls will fail with a network error in the console — that's expected.

## Project structure

```
src/
  api/            axios calls, one function per backend endpoint
  components/     small, focused, reusable UI pieces
  context/        AuthContext — app-wide login state
  hooks/          React Query hooks (useProjects.ts)
  lib/            query client config, Zod schemas
  pages/          one component per route
  types/          TypeScript types mirroring backend DTOs
```

Data flow for a typical page (ProjectsPage):

```
Component (ProjectsPage)
  -> useProjectsList()          [hooks/useProjects.ts]
  -> getProjects()              [api/projects.ts]
  -> apiClient.get("/projects") [api/apiClient.ts, adds JWT header]
  -> Spring Boot GET /api/projects
```

## Expected backend API contract

| Method | Path                  | Auth | Body                              | Returns          |
|--------|------------------------|------|------------------------------------|-------------------|
| POST   | /api/auth/register     | no   | `{name, email, password}`          | `{token, user}`   |
| POST   | /api/auth/login        | no   | `{email, password}`                | `{token, user}`   |
| GET    | /api/projects           | yes  | —                                   | `Project[]`       |
| GET    | /api/projects?status=  | yes  | —                                   | `Project[]`       |
| GET    | /api/projects/{id}      | yes  | —                                   | `Project`         |
| POST   | /api/projects           | yes  | `{name, description, status}`      | `Project`         |
| PUT    | /api/projects/{id}      | yes  | `{name, description, status}`      | `Project`         |
| DELETE | /api/projects/{id}      | yes  | —                                   | 204 No Content    |

`Project` shape:
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "status": "PLANNING | ACTIVE | ON_HOLD | COMPLETED",
  "createdAt": "ISO date string"
}
```

Authenticated requests send `Authorization: Bearer <token>` — see
`src/api/apiClient.ts`.

## What to extend first

1. **Loading skeletons everywhere, not just the list** — right now only
   `ProjectList` has a loading state; `ProjectDetailsPage` just shows text.
2. **Project members** — the backend doc this was built from mentions a
   `ProjectMember` join table. Add a members list to the detail page once
   that endpoint exists.
3. **Optimistic updates** — `useCreateProject`/`useUpdateProject` currently
   wait for the server response before the UI updates. Once you're
   comfortable with basic React Query, look at `onMutate` for optimistic
   UI (update the cache immediately, roll back on error).
4. **Toasts instead of `window.confirm`/inline errors** — the delete
   confirmation and error messages are intentionally basic so the control
   flow is easy to read; a toast library is a good next step.
5. **Pagination** — `getProjects()` currently fetches everything at once.
   Fine for a prototype; add page/size params once the list can grow large.

## What I learned (for interview prep)

**React:** functional components, controlled vs uncontrolled inputs,
lifting state up (`ProjectFilters`), route params (`useParams`), context
for cross-cutting app state vs React Query for server state.

**TypeScript:** modeling API DTOs as interfaces, `z.infer` to derive form
types from a single Zod schema instead of duplicating them.

**React Query:** query keys and cache invalidation, `enabled` to guard a
query that depends on a route param, why mutations don't need their own
loading state variable (`isPending` is built in).

**Likely interview questions:**
1. Why use React Query instead of `useEffect` + `fetch`?
2. What does `invalidateQueries` actually do, and why not just refetch
   manually after a mutation?
3. Why is auth state in Context but project data in React Query?
4. What happens end-to-end when a 401 comes back from the API?
5. Why separate `Project` and `ProjectInput` types instead of one type?
