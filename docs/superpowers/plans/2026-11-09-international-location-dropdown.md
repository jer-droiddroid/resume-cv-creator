# International Location Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unstructured freeform text input for Location in Step 1 (Personal Information) with an international Country dropdown, a dependent City dropdown, and a custom city fallback, saving cleanly as `${city}, ${country}` in `personalInfo.location`.

**Architecture:** Create a curated, client-side dataset of international countries and major cities (`src/data/internationalLocations.js`) with formatting and reverse-parsing helper functions. Update `src/components/form/PersonalInfoStep.jsx` to render side-by-side Country and City selectors with an "Other (Type custom city...)" escape hatch, bidirectionally synchronizing with React Hook Form.

**Tech Stack:** React 19, React Hook Form 7, Tailwind CSS v4, Node.js native test runner (`node:test`, `node:assert`).

**Spec:** `docs/superpowers/specs/2026-11-09-international-location-dropdown-design.md`

## Global Constraints
- **Zero external network dependencies:** 100% offline, local-first dataset.
- **Design system tokens:** Border `#E3E8EE`, Ink `#1A2233`, Muted `#5B6678`, Accent `#1F4D8F` (`focus:ring-2 focus:ring-[#1F4D8F]/20 focus:border-[#1F4D8F]`), radius `rounded-[6px]`.
- **Backward compatibility:** `personalInfo.location` must remain a combined string so all 15 PDF and HTML templates, sample data, and AI PDF extraction continue to work without data migrations.
- **Dual-directory synchronization:** All changes in `C:\Users\jerwi\Downloads\papel-resume-creator` must stay synchronized with `C:\Users\jerwi\.gemini\antigravity\scratch\resume-cv-creator` and pushed to `origin/main`.

## Review Focus
1. `personalInfo.location` is initially empty: Country and City dropdowns should render empty placeholder options without throwing or auto-saving `"undefined, undefined"`.
2. Existing sample data or draft with arbitrary string format (e.g., `"San Francisco, CA"` or `"Quezon City, Philippines"`): `parseLocation` must correctly select Country and City where matched, or default to Country with Custom City.
3. Country with single city or city-state (e.g., `"Singapore"` or `"Monaco"`): formats as `"Singapore"` without duplicating into `"Singapore, Singapore"`.
4. User selects a country, then picks "Other (Type custom city...)": a clean text field appears and typing updates `personalInfo.location` to `"${customCity}, ${country}"`.
5. User switches Country after picking a City: City dropdown resets to empty placeholder so a city from Country A isn't accidentally paired with Country B.

---

### Task 1: Create International Locations Dataset & Helper Functions

**Files:**
- Create: `src/data/internationalLocations.js`
- Test: `test/internationalLocations.test.js`

**Interfaces:**
- Produces:
  - `INTERNATIONAL_COUNTRIES`: Array of `{ name: string, code: string, cities: string[] }`
  - `formatLocation(country: string, city: string): string`
  - `parseLocation(rawLocation: string): { country: string, city: string, isCustomCity: boolean }`

- [ ] **Step 1: Write the failing unit tests for dataset and helpers**

```javascript
// test/internationalLocations.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  INTERNATIONAL_COUNTRIES,
  formatLocation,
  parseLocation,
} from '../src/data/internationalLocations.js'

test('INTERNATIONAL_COUNTRIES contains major countries with cities', () => {
  assert.ok(Array.isArray(INTERNATIONAL_COUNTRIES))
  assert.ok(INTERNATIONAL_COUNTRIES.length > 50)
  const ph = INTERNATIONAL_COUNTRIES.find((c) => c.name === 'Philippines')
  assert.ok(ph)
  assert.ok(ph.cities.includes('Manila'))
  assert.ok(ph.cities.includes('Quezon City'))
  assert.ok(ph.cities.includes('Cebu City'))
})

test('formatLocation formats city and country cleanly', () => {
  assert.equal(formatLocation('Philippines', 'Manila'), 'Manila, Philippines')
  assert.equal(formatLocation('Singapore', 'Singapore'), 'Singapore')
  assert.equal(formatLocation('Philippines', ''), 'Philippines')
  assert.equal(formatLocation('', 'Tokyo'), 'Tokyo')
  assert.equal(formatLocation('', ''), '')
})

test('parseLocation extracts country and city from combined strings', () => {
  const result1 = parseLocation('Manila, Philippines')
  assert.equal(result1.country, 'Philippines')
  assert.equal(result1.city, 'Manila')
  assert.equal(result1.isCustomCity, false)

  const result2 = parseLocation('San Francisco, CA, United States')
  assert.equal(result2.country, 'United States')
  assert.equal(result2.city, 'San Francisco, CA')

  const result3 = parseLocation('San Francisco, CA')
  assert.equal(result3.country, 'United States')
  assert.equal(result3.city, 'San Francisco, CA')

  const result4 = parseLocation('Random Unknown Village, Philippines')
  assert.equal(result4.country, 'Philippines')
  assert.equal(result4.city, 'Random Unknown Village')
  assert.equal(result4.isCustomCity, true)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/internationalLocations.test.js`
Expected: FAIL with module not found or functions not defined.

- [ ] **Step 3: Implement `src/data/internationalLocations.js`**

Implement `INTERNATIONAL_COUNTRIES` with curated country and city lists (Philippines, US, Canada, UK, Australia, Singapore, Germany, France, Japan, etc., plus global countries), `formatLocation`, and `parseLocation`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/internationalLocations.test.js`
Expected: PASS all tests.

- [ ] **Step 5: Commit**

```bash
git add src/data/internationalLocations.js test/internationalLocations.test.js
git commit -m "feat(data): add curated international locations dataset and parse/format helpers"
```

---

### Task 2: Integrate Country and City Dropdowns into PersonalInfoStep

**Files:**
- Modify: `src/components/form/PersonalInfoStep.jsx:180-220`
- Consumes: `INTERNATIONAL_COUNTRIES`, `formatLocation`, `parseLocation` from `src/data/internationalLocations.js`

- [ ] **Step 1: Update `PersonalInfoStep.jsx` state and markup**
  - Add local state for `selectedCountry`, `selectedCity`, and `customCity`.
  - On mount and when `formValues?.personalInfo?.location` changes externally (e.g. sample load or clear), run `parseLocation` to update local state.
  - Render a 2-column grid in place of the single Location input:
    1. **Country Dropdown (`<select>`):** Lists `INTERNATIONAL_COUNTRIES` with `aria-label="Country"`.
    2. **City Dropdown (`<select>`):** Displays `currentCountry.cities` plus an option `__custom__` ("Other / Custom city...").
    3. If `selectedCity === '__custom__'` or if the country has no preset cities, render an inline custom city `<input>`.
  - When either Country or City changes, call `setValue('personalInfo.location', formatLocation(country, city), { shouldDirty: true })`.
  - Style with `.stitch/DESIGN.md` tokens: `rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1.5 text-xs text-[#1A2233] focus:border-[#1F4D8F] focus:ring-2 focus:ring-[#1F4D8F]/20`.

- [ ] **Step 2: Verify with lint and build**

Run: `npm run lint` and `npm run build`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/form/PersonalInfoStep.jsx
git commit -m "feat(ui): add international country and city dropdowns to PersonalInfoStep"
```

---

### Task 3: Dual-Repository Synchronization & End-to-End Verification

**Files:**
- Sync: `C:\Users\jerwi\Downloads\papel-resume-creator` ↔ `C:\Users\jerwi\.gemini\antigravity\scratch\resume-cv-creator`

- [ ] **Step 1: Synchronize all modified and newly created files**
  - Copy `src/data/internationalLocations.js`, `test/internationalLocations.test.js`, and `src/components/form/PersonalInfoStep.jsx` to `scratch/resume-cv-creator`.
- [ ] **Step 2: Run verification in both directories**
  - Run `node --test test/internationalLocations.test.js`
  - Run `npm run lint`
  - Run `npm run build`
- [ ] **Step 3: Commit and push to GitHub `origin/main`**

```bash
git push origin main
```

