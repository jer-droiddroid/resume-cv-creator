# Papel interface conventions

Papel helps students describe coursework, projects, organizations, and OJT experience in a resume or academic CV. Keep the existing calm blue and paper-based visual language.

- Application colors, typography, and spacing primitives live in `src/index.css`. Use semantic utilities such as `text-text`, `text-text-muted`, `bg-page`, `bg-surface`, `border-border`, and `bg-accent`. PDF template colors remain separate and theme-driven.
- Use the shared `Modal` component for dialogs. It portals outside the app, makes the background inert, contains keyboard focus, supports Escape, and restores focus. Do not place fixed overlays inside transformed ancestors.
- Keep touch controls at least 44px high. Narrow progress segments communicate status; the All steps menu provides direct navigation.
- Contact information comes before optional format and OJT configuration. On mobile, Edit and Preview preserve the same form state.
- Examples are opt-in and never exported. Export review provides suggestions without making optional resume sections mandatory.
- Preserve meaningful drafts before sample/import replacement, including drafts without a name. Keep clear/undo available during the editing session.
- Describe privacy precisely: drafts are stored locally; optional AI import sends extracted PDF text to Google Gemini. Disclose this before import.
- Template metadata and HTML formatting must stay independent of PDF packages. Load PDF layouts on export and extraction code on import.

Validation: `node --test`, `npm run lint`, and `npm run build`. Check desktop and mobile dialogs, keyboard focus, draft restoration, and actual PDF export when changing these flows.
