# Chamber Week 4 Join Page

## Objective

Implement the complete WDD 231 Week 4 Chamber Membership Join Page for the existing Keizer Chamber site while preserving the established responsive design and shared site behavior.

## Problem

The Chamber site currently includes Home and Directory pages, but it does not yet provide the required membership application flow. The navigation still treats Join as a future page.

## Why

Week 4 requires a responsive, accessible membership form, membership-level cards with modal benefit details, an initial-load animation, and a confirmation page that displays the submitted required information.

## Scope

- Create `chamber/join.html` with the required GET form and four membership cards.
- Create `chamber/thankyou.html` to display required submitted values safely.
- Create page-specific CSS for Join and Thank You without modifying unrelated Home or Directory page styles.
- Create page-specific JavaScript for timestamps, dialogs, and submitted query parameters.
- Activate the Join navigation link on existing and new Chamber pages.
- Keep Discover disabled until its assigned implementation exists.

## Constraints

- Use semantic HTML, accessible labels, keyboard-friendly dialogs, and responsive layouts.
- Reuse `chamber/scripts/site.js` for navigation and footer behavior.
- Preserve the current `normalize.css` → `shared.css` → page stylesheet architecture.
- Do not use frameworks or external libraries.
- Do not modify legacy unused `small.css` or `larger.css`.
- Do not commit or push without explicit user authorization.
- Technical artifacts and site content remain in English.

## Delivery

- Route: delegated direct implementation.
- Trigger evidence: understanding spans the two current pages and shared assets; implementation creates or modifies multiple non-trivial files.
- Writer: one bounded `gentle-ai-worker` with exact allowed edit surfaces.
- Forecast: approximately 450–650 authored changed lines because the assignment requires two complete pages, responsive styling, four dialogs, and two JavaScript modules. The size is driven by coherent assignment requirements rather than optional expansion.
- Delivery strategy: `ask-on-risk`; no commit or pull request is authorized yet.
- TDD mode: not enabled or configured for this static course repository; use focused functional and structural checks.

## Tasks

- [x] **W4-1 — Build membership application page**
  - Create the complete accessible GET form with exact field names, types, autocomplete values, pattern, membership values, description, timestamp, and submit button.
  - Add four membership cards and four accessible benefit dialogs.
  - Add an initial-load card animation with reduced-motion support.
  - Route: delegated writer (multi-file write trigger).

- [x] **W4-2 — Build confirmation flow**
  - Create the Thank You page using the established Chamber template.
  - Parse query parameters and render first name, last name, email, phone, organization, and timestamp with `textContent`.
  - Route: delegated writer (multi-file write trigger).

- [x] **W4-3 — Integrate navigation and responsive design**
  - Activate Join links on Home, Directory, Join, and Thank You pages.
  - Preserve Discover as an intentional disabled future route.
  - Confirm the layout works from 320px through desktop widths without horizontal overflow.
  - Route: delegated writer (multi-file write trigger).

- [x] **W4-4 — Verify the complete Week 4 candidate**
  - Run JavaScript syntax checks and focused structural/reference checks.
  - Run LSP/lens diagnostics on edited files.
  - Perform a browser-based form, modal, confirmation, keyboard, console, and responsive smoke test when the local environment permits.
  - Route: verification determined after native risk assessment of the writer diff.

## Acceptance Criteria

- `join.html` submits with GET to `thankyou.html`.
- Every required field and attribute matches the Week 4 assignment.
- The organization title accepts only letters, spaces, and hyphens with at least seven characters.
- The hidden timestamp records the page-load date and time.
- All four membership levels use the required values: `np`, `bronze`, `silver`, and `gold`.
- Each membership card opens its own accessible modal and returns focus to its trigger when closed.
- Membership cards animate on initial load and respect `prefers-reduced-motion`.
- `thankyou.html` displays every required submitted value and the timestamp without unsafe HTML insertion.
- Shared navigation, footer, visual identity, and responsive behavior remain consistent.
- All existing local links remain valid except the intentionally disabled Discover route.
- No JavaScript runtime errors or blocking diagnostics remain.

## Verification Evidence

- Writer reported `node --check chamber/scripts/join.js`: passed with no output.
- Writer reported `node --check chamber/scripts/thankyou.js`: passed with no output.
- Writer reported `git diff --check`: passed with no output.
- Native risk assessment was unavailable because untracked files require explicit review scope; per its returned plan, independent verification was required.
- Independent Chrome/CDP verification passed dialogs, focus restoration, Escape handling, timestamp, GET confirmation, safe `textContent` rendering, animation, reduced motion, desktop layout, local references, navigation, and console behavior.
- Independent verification failed the organization-title pattern because Chrome Unicode `v` mode requires the hyphen to be escaped.
- Independent verification found `name="title"` instead of `name="organization-title"` and missing required `title` attributes on first name, last name, email, phone, and organization.
- Independent verification measured horizontal overflow at 320px because `shared.css` enforced `min-width: 320px` while the scrollbar reduced the content viewport to 305px.
- Correction writer changed the field to `name="organization-title"`, escaped the pattern hyphen for Unicode `v` mode, added the five missing `title` attributes, and removed the shared fixed minimum width.
- Post-correction `node --check` for both scripts and `git diff --check` passed.
- Post-correction native risk assessment remained unavailable because of untracked candidate files, so its returned plan again required independent verification.
- Focused post-correction Chrome/CDP verification passed: valid organization titles accepted, digit-containing and short titles rejected, no regex/console/runtime errors, and no horizontal overflow on Join, Home, or Directory at 320px or desktop widths.
- Final parent spot-check `git diff --check` passed.
- Final LSP diagnostics confirmed all eight edited HTML, CSS, and JavaScript files clean with zero diagnostics.

## Progress

- Official Week 4 assignment, cumulative Chamber description, and site plan reviewed.
- Existing architecture mapped by a read-only exploration worker.
- Dedicated branch `feat/chamber-week4-join` created from clean `main`.
- W4-1 completed after correcting the organization-title field contract and missing `title` attributes.
- W4-2 completed: confirmation page and safe query rendering implemented and independently verified.
- W4-3 completed after removing the shared 320px minimum-width overflow while preserving the remaining shared styles.
- W4-4 completed: independent browser verification, exact command checks, parent spot-check, and final LSP diagnostics all passed.

## Next Step

Implementation and verification are complete. Await explicit user authorization before any commit or push.
