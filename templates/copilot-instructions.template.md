# GitHub Copilot Instructions — [PROJECT NAME]
# TODO: Replace "[PROJECT NAME]" with the actual project name (e.g. "personal-portfolio")

## Project Overview
<!-- TODO: Write 1-2 sentences describing what this project does and who it's for. -->
<!-- Example: "SvelteKit portfolio site showcasing projects, experience, and certifications." -->

TODO: Project description here.

## Tech Stack
<!-- TODO: Fill in the tech stack. Remove lines that don't apply. Add any missing tools. -->

- **Framework**: SvelteKit 2 + Svelte 5
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Hosting**: TODO — e.g. Vercel / Netlify / Railway / Fly.io
- **Package manager**: TODO — pnpm / npm / yarn

<!-- TODO: Add more entries as needed: -->
<!-- - **Email**: Resend -->
<!-- - **Database**: TODO — e.g. Supabase / PlanetScale / SQLite -->
<!-- - **Auth**: TODO — e.g. Lucia / Auth.js / Clerk -->
<!-- - **Icons**: Lucide Svelte + @icons-pack/svelte-simple-icons -->

## Project Structure
<!-- TODO: Update this tree to match the actual src/ layout. Delete folders that don't exist.
     Focus on the non-obvious parts — where to find components, data, types, routes. -->

```
src/
├── lib/
│   ├── components/     # TODO: describe subfolders if any (e.g. shared/, home/)
│   ├── data/           # TODO: delete if not used — static data / content
│   ├── types/          # TODO: TypeScript interfaces and types
│   └── utils/          # TODO: utility functions
├── routes/
│   ├── api/            # TODO: describe API routes if any
│   └── ...             # TODO: list key routes / pages
└── app.css             # TODO: delete if using a different global style entry
```

## Key Conventions
<!-- TODO: Add project-specific rules that Copilot should always follow.
     These are the things that aren't obvious from the code alone.
     Examples below — edit freely. -->

- TODO: Where does content / data live? e.g. "All blog posts are `.md` files in `src/posts/` — the API at `/api/posts` picks them up automatically."
- TODO: Any external links or cross-site integrations? e.g. "Nav 'Blog' link is external → https://blog.example.com"
- TODO: Any non-obvious naming rules? e.g. "Route slugs must match the `slug` field in the data file exactly."
- TODO: Any forbidden patterns? e.g. "Do not add client-side fetch() calls — all data loading is in +page.ts load functions."

## Environment Variables
<!-- TODO: List all required env vars. Never put actual values here — only names and descriptions.
     This helps Copilot know what exists without hardcoding secrets. -->

```
# TODO: Add your env vars here. Example format:
# VAR_NAME=description of what this is used for
```

<!-- TODO: If no env vars are needed, delete this section. -->

## External URLs
<!-- TODO: List any external services, URLs, or APIs this project interacts with.
     Helps Copilot avoid inventing wrong URLs. -->

<!-- Example:
- Production site: https://example.com
- Blog (external): https://blog.example.com
- API base: https://api.example.com
-->

TODO: Add URLs or delete this section.

## Changelog
<!-- TODO: Update this entry with the actual date and project. -->
| Date | Change |
|------|--------|
| TODO: YYYY-MM-DD | Initial copilot instructions created |
