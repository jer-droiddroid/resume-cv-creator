# Design Spec: International Country and City Location Dropdown

## 1. Intent & Context
Papel is a privacy-first, local-first student resume, OJT practicum application, and CV creator. Currently, `personalInfo.location` is a single freeform text input (e.g., `"San Francisco, CA"`). This change replaces the unstructured text field with an international **Country** dropdown and a dependent **City** dropdown, while preserving a custom city fallback and backward compatibility with existing drafts, sample data, and all 15 resume templates.

## 2. Goals, Non-Goals & Anti-Goals
- **Goals:**
  - Provide a curated international Country dropdown (with prominent placement for high-volume student regions such as the Philippines, United States, Canada, United Kingdom, Australia, Singapore, and worldwide countries).
  - Provide a dependent City dropdown that dynamically populates with major cities, student hubs, and metropolitan areas for the selected country.
  - Provide an "Other (Type custom city...)" option in the City dropdown that seamlessly reveals a text input, ensuring no applicant is blocked if their town or province is unlisted.
  - Automatically format and save the combined location into `personalInfo.location` as `${city}, ${country}` (e.g., `"Manila, Philippines"` or `"Toronto, Canada"`).
  - Support reverse-parsing so existing drafts, sample resumes (`"San Francisco, CA"`), and AI PDF imports properly pre-populate the dropdowns.
- **Non-Goals:**
  - Street addresses, postal codes, or GPS location tracking.
  - Breaking changes to the existing `personalInfo.location` data structure.
- **Anti-Goals:**
  - Rigid dropdown-only constraints that prevent a student from entering their actual university town or province.
  - Introducing heavy npm dependencies or external network geocoding APIs that violate Papel's 100% offline and local-first architecture.

## 3. Constraints & Design System Tokens
- Must adhere strictly to `.stitch/DESIGN.md`:
  - Borders: `#E3E8EE`
  - Text: `#1A2233` (Ink), `#5B6678` (Muted)
  - Accent / Focus Ring: `#1F4D8F` (`focus:ring-2 focus:ring-[#1F4D8F]/20 focus:border-[#1F4D8F]`)
  - Border radius: `rounded-[6px]` (`--radius-input`)
  - Height: `h-10` standard input/select height
- Zero external runtime network requests; 100% client-side dataset.

## 4. Approaches Considered
1. **Approach 1 (Selected): Curated Global Dataset with Custom City Fallback**
   - Lightweight local module (`src/data/internationalLocations.js`, ~12 KB).
   - Instant response, zero latency, 100% offline.
   - Includes custom city escape hatch for total flexibility.
2. **Approach 2 (Rejected): Comprehensive Global Geo Package (`country-state-city`)**
   - Adds 2–3 MB of payload to client bundle, sluggish dropdown rendering.
3. **Approach 3 (Rejected): Live Geocoding API**
   - Violates privacy, breaks offline functionality, and introduces rate limits.

## 5. Implementation Details
- **Data Source:** `src/data/internationalLocations.js` exporting:
  - `INTERNATIONAL_COUNTRIES`: list of country objects `{ code, name, commonCities: [...] }`.
  - Helpers: `parseLocationString(rawLocation)`, `formatLocationString(city, country)`.
- **UI Component Update (`src/components/form/PersonalInfoStep.jsx`):**
  - Replace the single Location text input with a 2-column grid: `Country` dropdown and `City` dropdown.
  - When `City === '__custom__'`, display an inline text input for custom city entry.
  - Keep `personalInfo.location` in sync with React Hook Form using `setValue('personalInfo.location', formatted, { shouldDirty: true })`.
- **Sync Requirement:** Mirror all changes between `C:\Users\jerwi\Downloads\papel-resume-creator` and `C:\Users\jerwi\.gemini\antigravity\scratch\resume-cv-creator`.

