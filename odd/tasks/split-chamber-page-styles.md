# Split Chamber Page Styles

## Objective

Reduce the CSS declaration count loaded by each Chamber page without changing its rendered design or behavior.

## Problem

`chamber/styles/small.css` combines shared shell styles with directory-only and home-only rules. The Week 03 audit reports 370 declarations on the home page, above its 250-declaration maintainability guideline.

## Why

Page-specific stylesheets keep each page below the audit guideline, make ownership clearer, and avoid removing the shared normalize stylesheet merely to reduce a metric.

## Scope

- Extract shared Chamber shell and membership badge styles.
- Extract home-only styles.
- Extract directory-only styles.
- Preserve responsive breakpoints, cascade order, reduced-motion behavior, and current rendering.
- Update `chamber/index.html` and `chamber/directory.html` stylesheet references.

## Constraints

- Keep `chamber/styles/normalize.css` first.
- Keep membership badge rules shared because both page renderers use them.
- Do not delete legacy CSS until all current consumers are accounted for.
- Do not change page content, JavaScript, or visual design.
- No commit without explicit user authorization.

## Delivery

- Strategy: ask-on-risk
- Forecast: under 400 authored changed lines when moves are counted as cohesive stylesheet extraction; no PR chaining expected.
- TDD: not applicable; this is a CSS organization change with structural and browser-facing checks.

## Tasks

### ODD-CSS-1 — Split shared and page-specific styles

- Status: implemented; commit pending explicit authorization
- Route: delegated writer
- Trigger: multi-file write (new shared/page CSS plus two HTML references)
- Acceptance criteria:
  - `normalize.css` remains the first stylesheet.
  - Both pages load shared styles before their page-specific styles.
  - Home, directory, responsive, badge, and reduced-motion rules retain their original ownership and order.
  - No unrelated source files are changed.
- Checks:
  - Inspect stylesheet links and selector ownership.
  - Confirm no page-specific stylesheet exceeds the 250-declaration guideline.

### ODD-CSS-2 — Verify both Chamber pages

- Status: completed
- Route: delegated verification if required by native assessment
- Acceptance criteria:
  - Both HTML files resolve every referenced local stylesheet.
  - Existing project checks report no new errors.
  - Git diff contains only the authorized CSS split and HTML link changes.
- Checks:
  - Run focused HTML/CSS reference and declaration-count checks.
  - Run available diagnostics for changed files.
  - Perform parent spot check of one reported command.

## Progress

- Read-only mapping completed by `gentle-ai-explore`.
- Extracted shared, home, and directory styles without deleting the legacy files.
- Updated both HTML pages to load normalize, shared, and their page-specific stylesheet in order.
- Native assessment was unavailable, so the change was treated as high risk and independently verified.
- The verifier reported a transient automatic `.engram` observation, but parent diagnosis confirmed that no such file remains in the working tree.
- Source implementation and verification are complete; the work remains uncommitted by policy.

## Verification Evidence

- Writer `git diff --check`: passed.
- Writer declaration count: shared 149, home 160, directory 130; all below 250.
- Writer stylesheet reference check: passed for both HTML files.
- Writer runtime HTTP harness: both pages loaded successfully.
- Supplemental total comparison found the expected one-declaration increase caused by splitting a mixed reduced-motion selector.
- Independent structural comparison: semantic selector/declaration multiset matched exactly; expected rule count delta was +1 from the split reduced-motion selector.
- Independent HTTP harness: both pages and all referenced local stylesheets returned HTTP 200.
- Independent diagnostics fallback: HTML parsing and CSS balance checks passed.
- Parent `lsp_diagnostics`: all five changed source files clean with zero diagnostics.
- Parent declaration-count spot check: shared 149, home 160, directory 130; all below 250.
- Parent `git diff --check`: passed.
- Residual risk: no browser screenshot comparison was performed at mobile, 48rem, and 68rem widths.

## Next Step

User may review the uncommitted diff and explicitly request a commit/push when ready.
