# Mutaah Frontend Agent Instructions

## Project Context

Mutaah is a Next.js App Router frontend for a Palestinian peer-to-peer rental platform. The UI is Arabic-first and RTL. The frontend consumes a REST API through Axios and React Query; production behavior must use the API rather than product mock data.

Technology:

- Next.js 16 App Router
- React 19
- TypeScript in strict mode
- TanStack React Query 5
- Axios
- Tailwind CSS 4
- ESLint 9 with `eslint-config-next`

## Repository Structure

- `app/`: routes and page-level UI. Route groups include `app/(main)`.
- `components/`: reusable presentational components.
- `context/`: only shared global client state/providers.
- `services/`: all REST API calls and response normalization.
- `api/`: Axios client and React Query keys.
- `types/`: shared TypeScript interfaces and API contracts.
- `hooks/`: reusable client hooks.
- `utils/`: pure formatting, calendar, time, category, and display helpers.
- `validations/`: form validation functions.
- `mock/`: only stable local reference data that is still genuinely required by the UI. Do not add product or API-response mock data.
- `public/`: static assets.

Use the existing `@/*` alias for imports. Keep route-specific code in its route and do not reorganize folders without a clear requirement.

## Source of Truth and API Boundaries

1. Backend field names and documented API responses are authoritative.
2. Define or update shared API interfaces in `types/`; do not duplicate response shapes in pages.
3. Put all network calls in `services/`. Pages and components must call service functions or React Query hooks, never Axios directly.
4. Keep API response mapping in services. Do not silently invent fallback data for a successful response.
5. Use React Query for server state, caching, invalidation, mutations, loading, and error states.
6. Use Context only for cross-route client state. Do not put page-specific forms or server data in Context.
7. If an endpoint shape is unconfirmed, stop and ask for the contract instead of guessing.
8. Keep backend names unchanged. If the UI needs a display label, create a typed display helper rather than changing the API model.

Important current conventions:

- Product locations are nested as `product.location.governorate` and `product.location.district`.
- Plan names/features are frontend display data derived by `utils/planDisplay.ts`; `Plan` must match the API and should not gain `name` unless the backend sends it.
- `mock/locations.ts` contains local governorate/district options used by registration and profile forms. It is not a product/API mock.
- Product mock files and `ProductsContext` are intentionally removed. Do not reintroduce them.

## Authentication and Authorization

- The Axios client is `api/client.ts`; reuse it for authenticated requests.
- Preserve the existing token-change events and React Query behavior unless changing authentication is explicitly requested.
- Client-side role checks are UX guards only. Backend authorization must protect every admin endpoint.
- Never treat `localStorage` values, route guards, hidden buttons, or client state as real authorization.
- Do not expose tokens, credentials, or sensitive API responses in logs.
- Never add secrets to source code, `.env` files committed to Git, or client-exposed configuration.

## Security Requirements

- Never render user/API text with `dangerouslySetInnerHTML` unless a reviewed sanitizer and strict allowlist are required.
- Render chat and user-generated content as text by default.
- Validate redirect/query parameters. Allow only safe internal paths; reject absolute URLs, protocol-relative URLs, hosts, and backslashes.
- Validate uploaded files on the server contract side. Client `accept` attributes are only UX hints.
- Do not weaken authorization, CSRF, cookie, or upload protections to make a feature work.
- Review dependency changes with `npm audit`.

## React and Next.js Rules

- Add `"use client"` only when hooks, browser APIs, event handlers, or client-only libraries require it.
- Wrap client pages using `useSearchParams()` in a `Suspense` boundary compatible with App Router prerendering.
- Prefer server components where possible; keep client components focused.
- Use `next/image` for images. For `File`/`ObjectURL` previews, use explicit dimensions and `unoptimized` when optimization cannot process the blob URL.
- Revoke object URLs when previews are replaced or unmounted when practical.
- Use stable keys; do not use array indexes when a stable identifier exists.
- Keep loading, empty, error, disabled, and mutation-pending states explicit.
- Preserve Arabic RTL layout and existing Tailwind design tokens. Reuse existing utility patterns instead of inventing arbitrary styles.
- Keep accessibility: semantic controls, labels, keyboard support, useful Arabic alt text, and visible error states.

## TypeScript and Code Quality

- Keep `strict` TypeScript passing.
- Do not use `any`, `@ts-ignore`, `@ts-nocheck`, or unsafe casts as shortcuts.
- Prefer narrow interfaces, discriminated unions, typed service return values, and type guards.
- Avoid duplicated business logic and duplicated API response mapping.
- Remove unused imports, variables, handlers, and stale comments.
- Do not leave speculative comments such as “unconfirmed” after the contract is established; update or remove them.
- Do not hide lint errors with disable comments unless there is a documented, unavoidable reason.

## Forms, Mutations, and Files

- Keep validation in `validations/` and reuse it from pages.
- Submit mutations through services and invalidate/update the relevant React Query keys on success.
- Do not display success before the server confirms the mutation.
- For multipart requests, build `FormData` in the service and follow the exact backend field names.
- Do not calculate security-sensitive totals, permissions, or ownership exclusively in the browser.
- Do not use hardcoded product, rental, payment, or subscription values when API data is available.

## Required Workflow

Before changing code:

1. Inspect the relevant route, component, service, type, query key, and validation files.
2. Search for existing helpers and patterns before creating new ones.
3. State the implementation plan and any ambiguity.
4. Ask the user before making a decision that changes an API contract, authentication model, payment behavior, or destructive data flow.

While changing code:

1. Make small, related, reversible changes.
2. Preserve unrelated user changes in the worktree.
3. Update all consumers when changing a shared type or service.
4. Keep filenames and imports consistent in casing; Git and Linux builds are case-sensitive.

After changing code:

1. Run `npm run lint`.
2. Run `npx tsc --noEmit`.
3. Run `npm run build`.
4. Run `npm audit` when dependencies or security-sensitive code changes.
5. Run `git diff --check`.
6. Report exactly what changed and any remaining warnings or failures.

## Git and Delivery

- Do not commit or push unless the user explicitly requests it.
- Never use destructive commands such as `git reset --hard` or broad checkout/revert commands.
- Never overwrite unrelated user changes.
- Use a short, accurate commit message describing the cohesive change.
- When pushing, verify the current branch and remote first; do not force-push unless explicitly authorized.
- Include the repository's required Copilot co-author trailer in commits:

  `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

## Response Expectations

- Be concise but include the files changed, validation results, and any blockers.
- Use absolute Markdown links when referring to workspace files.
- If requirements or API behavior are ambiguous, ask one focused question rather than guessing.
- Do not claim a security fix is complete if it depends on backend enforcement that has not been verified.
