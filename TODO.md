rra# TODO: Responsive refactor (hacker/cybersecurity aesthetic preserved)

## Step 1 — Gather & confirm
- [x] Located existing top status banner (`.top-banner`) and navigation/header in `src/App.tsx`.
- [x] Inspected styling in `src/index.css` (includes multiple mobile/tablet breakpoints).

## Step 2 — Status bar removal
- [x] Remove the entire top banner section in `src/App.tsx` (SEC-OPS / SYS_TIME / IP).

- [ ] Remove related CSS (`.top-banner`, pulse styles, print-hide selectors, spacing adjustments) from `src/index.css`.
- [ ] Ensure header starts at top with no gap.

## Step 3 — Responsive header + mobile drawer UX
- [ ] Update `src/App.tsx` header markup to match requirements:
  - Desktop: logo left + nav right (preserve current).
  - Tablet/Mobile: hamburger left, ROBIN logo centered, hide desktop nav links.
  - Slide-in drawer from left.
  - Close drawer on outside click, nav selection, and Escape.
  - Prevent body scrolling while drawer open.
- [ ] Add drawer/open/close state + event handlers in `src/App.tsx`.
- [ ] Add/adjust CSS for centered logo, slide-in drawer animation, touch targets.

## Step 4 — Hero spacing + terminal placement
- [ ] Reduce hero top padding and bring terminal window closer to header.
- [ ] Ensure first screen fits without unnecessary scrolling.

## Step 5 — Terminal responsiveness
- [ ] Make terminal window width 100%, no horizontal scrolling, responsive font scaling.
- [ ] Keep prompt/controls aligned.

## Step 6 — Avatar optimization
- [ ] Reduce avatar size on mobile (match existing circular border + glow).
- [ ] Prevent overflow.

## Step 7 — Typography (clamp)
- [ ] Replace fixed font sizes with responsive `clamp()` for:
  - hero title/name/subtitle
  - section headings
  - paragraph text
  - terminal text

## Step 8 — Layout/cards responsiveness
- [ ] Ensure cards stack vertically on mobile with consistent padding and no overflow.

## Step 9 — Buttons (44px min)
- [ ] Enforce `min-height: 44px` on buttons.
- [ ] Expand to full width where appropriate on mobile.

## Step 10 — Images responsiveness
- [ ] Ensure all images use `max-width: 100%`, `height: auto`, no overflow.
- [ ] Add `loading="lazy"` for non-critical images.

## Step 11 — Performance tweaks
- [ ] Reduce heavy blur only if necessary (keep aesthetics).
- [ ] Avoid layout shifts (stabilize heights where applicable).

## Step 12 — Testing
- [ ] Verify no horizontal scrolling on:
  - 320/375/390/414/480/768
  - 1024+
- [ ] Sanity check animations & existing functionality after refactor.

