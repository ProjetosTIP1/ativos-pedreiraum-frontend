# GEMINI.md - Frontend: Valemix Assets Catalog

## Project Overview
This is the frontend application for the **Valemix Assets Catalog**, an industrial inventory management system. It provides a professional catalog for clients and a secure administrative dashboard.

### Core Architecture & Tech Stack
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite 8+
- **Routing:** React Router 7
- **State Management:** Zustand (Store-first state)
- **Validation:** Zod (matches backend Pydantic models)
- **HTTP Client:** Axios (configured with `withCredentials: true` for HTTP-only cookies)
- **Styling:** Vanilla CSS (Industrial/Dark theme)
- **Icons:** Lucide React

## Building and Running

### Prerequisites
- Node.js / Bun (Bun is preferred for speed)

### Key Commands
- **Install Dependencies:** `bun install` or `npm install`
- **Start Dev Server:** `bun run dev` (API proxy configured in `vite.config.ts`)
- **Build Project:** `bun run build`
- **Run Linting:** `bun run lint`
- **Preview Build:** `bun run preview`

## Development Conventions

### 1. State Management (Zustand)
- Store logic resides in `src/stores/`.
- Use `useAuthStore` for authentication and user sessions.
- Use `useToastStore` for global notifications.
- Use `useAssetStore` for managing catalog state.

### 2. API & Services
- All API interactions are encapsulated in `src/server/`.
- `apiClient.ts` provides the base Axios instance with interceptors and CSRF/Cookie handling.
- Follow the patterns in `assetService.ts`, `authService.ts`, and `imageService.ts`.

### 3. Validation & Schemas (Zod)
- Define domain entities and validation schemas in `src/schemas/entities.ts`.
- These schemas MUST mirror the backend's Pydantic models to ensure cross-platform type safety.

### 4. Design System & Styling
- **Theme:** Industrial Precision & Editorial Depth (see `DESIGN.md`).
- **Typography:** 
  - Headlines: **Manrope** (Geometric, tight spacing).
  - Body: **Inter** (Technical legibility).
- **Colors:** Rooted in construction aesthetics (Stark White, structural charcoal, high-visibility yellow).
- **Conventions:**
  - Avoid 1px solid borders; use tonal shifts and negative space.
  - No pure black (#000000); use `on_background` (#1c1b1b).
  - Minimalist input fields (no box/bottom line, left-side marker on focus).

### 5. Component Structure
- Reusable UI primitives: `src/components/ui/`.
- Layout components: `src/components/layout/`.
- Feature-specific components: Located within their respective page directories or `src/components/`.

### 6. Authentication flow
- Relies on **HTTP-only Cookies**.
- Browser automatically handles the `access_token` cookie.
- Ensure all API calls have `withCredentials: true`.

## Key Files & Directories
- `src/App.tsx`: Main routing and provider setup.
- `src/schemas/entities.ts`: Single source of truth for frontend domain types.
- `src/server/apiClient.ts`: Base HTTP configuration.
- `FRONTEND_GUIDE.md`: Technical integration details for backend parity.
- `DESIGN.md`: Detailed design system documentation.
- `API.md`: API documentation for the backend.

