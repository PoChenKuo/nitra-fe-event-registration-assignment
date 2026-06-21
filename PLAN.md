# prerequisite

## Figma style sync
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Check and syncronize the styles from my duplicated draft(url: http://127.0.0.1:3845/mcp), according to the view "Event Registration Wizard\Design Token Reference", check every style script under 'src\css\colors.scss' and 'src\css\typography.scss' are align with figma definition.
#### Step
1. list all the color style(for all components that including text, background, button, and line) and font style (family, size, bold, and other styles) from figma source.
2. override local css and related js files if actual needed.
### Result / Decision

**Figma source:** `Nitra FE Assessment - v2 (Copy)` → frame `Design Token Reference` (node `1077:896`). Values read via `get_variable_defs` (variable collection = source of truth) + `get_metadata` (token inventory) + `get_design_context` (for unbound swatches).

#### Changes applied
`src/css/colors.scss` — 4 brand-color fixes:
- `--text-brand-default`: `#2E5E60` → `#3A7679` (teal600 → teal500)
- `--text-brand-emphasis`: `#1E3C3E` → `#264D4F` (teal800 → teal700)
- `--bg-brand-muted-rest`: `#CBE5E6` → `#EEF6F7` (teal50 → teal0)
- `--bg-brand-muted-hover` / `-active`: `#A9D4D6`/`#86C2C5` → `#CBE5E6`/`#A9D4D6` (shifted to keep the muted ramp continuous: teal 0→50→100, since Figma only defines `bg/brand/muted/rest`)

`src/css/typography.scss` — added missing `body/xs` token (Figma defines it, local lacked it):
- `--font-size-xs: 11px;` / `--line-height-xs: 14px;`

`src/unocss/index.js` — added matching `xs` entries to `fontSize` and `lineHeight` maps so `text-xs` resolves.

#### Verified consistent (no change needed)
- Text (13), Background (12 bound), Border (6 bound), Divider (2): values match Figma.
- `index.js` `fontWeight` (bold 630 / semibold 610 / medium 570 / regular 485) already matches Figma's font-weight tokens exactly.
- Typography h1–h4, subtitle1/2, lg, sm sizes & line-heights already aligned.

#### Decisions / deferred
- **`text/brand/muted` (`#4A979B`)**: not defined in the Figma reference frame → left as-is.
- **`--font-size-md` (14px/20px)**: Figma has no `body/md` (only lg/sm/xs); `md` is consumed by `text-md` in code → kept to avoid breakage.
- **`bg/info/subtle/rest`, `bg/warning/subtle/rest`, `border/info/opacity`**: their Figma swatches are unbound placeholders (rendering white / neutral-muted; frame is marked `🚧 WIP - Design System`), so Figma carries no authoritative value. Token names exist and local definitions are present (`blue[0]` / `yellow[50]` / `rgba(26,126,199,0.5)`) → kept local values; re-sync once Figma binds real colors.
- **Responsive overrides** (`max-width: 1023px`): no responsive variants in the reference frame → left untouched.

**Completeness:** every color token shown in the Figma reference frame has a corresponding local definition — no missing tokens.

# System Design
## Content Definition
### header
The icon with event title("WebDev Summit 2025").
### stepper
The quasar stepper that corresponds to the current page number over 4 pages.
### mainContent(4 pages)
#### Attendee Information
1. A single-only Ticket Selector(carousel when screen width small than 1280px).
2. Information form - use quasar form input fields with conditional status 
#### Select Sessions
1. Date switcher
2. Hint for selected sessions
3. Session cards
#### Select Add-ons
1. Add-on type switcher
2. Hint for switcher types
3. Item cards
4. Order Summary displayer
#### Review Your Registration
1. Independently summarys for each page's order.
2. Error hint for details.
### footer
## Storage
Page holds states as provider for each page.
#### Attendee Information
Inject attendee information, ticket type, and hasMerchandise bool flag.
#### Select Sessions
Inject sessions selection states.
#### Select Add-ons
Inject Add-ons and selected ticket info.
#### Review Your Registration
Inject all data that presents in other pages for form check.


## Tasks 1 - build main layout
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Reference the example to build header, stepper area, main content area, and footer area.
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1069-968&m=dev
### Result / Decision

**Figma source:** frame `Step 1 — Attendee Info` (node `1069:968`). Layout regions: Header (72px) / divider / Stepper (80px) / divider / Content / divider / Action Bar (72px), all on a 1440px canvas.

#### Files added
- `src/layouts/MainLayout.vue` — `q-layout` shell (`view="hHh lpR fFf"`): fixed `q-header` (AppHeader + dividers + WizardStepper), `q-page-container` with `router-view`, fixed `q-footer` (WizardFooter). Calls `provideWizard()`.
- `src/composables/useWizard.js` — provide/inject wizard state (`currentStep`, `currentMeta`, `isFirst/isLast`, `goNext/goBack/goToStep`); the shared store the System Design calls for.
- `src/constants/steps.js` — the 4-step config (`label` + `nextLabel`), single source of truth.
- `src/components/AppHeader.vue` — header: brand emblem in a 40px `bg-brand-emphasis-rest` tile + event name (`text-h4`), data-driven from `mocks/event.js`.
- `src/components/BrandEmblem.vue` — Nitra brandmark SVG (from Figma `1116:1005`), `currentColor` fill.
- `src/components/WizardFooter.vue` — action bar: Back (`flat`, hidden on step 1) + primary Next (`color="accent"` → `#FB7429`), label from `currentMeta.nextLabel`.
- `src/components/WizardStepper.vue` — **placeholder** functional stepper (reflects/navigates steps); full Figma states are Task 2.

#### Files changed
- `src/router/routes.js` — `/` now renders `MainLayout` with `IndexPage` as child route.
- `src/pages/IndexPage.vue` — content-area placeholder driven by `useWizard()`; real step pages are Tasks 3+.

#### Decisions
- **Token-first styling:** used semantic shortcuts (`bg-brand-emphasis-rest`, `text-h4`, `bg-surface-l0`, accent button via `--q-accent`); no hardcoded hex.
- **Event name** pulled from `mocks/event.js` (`WebDev Summit 2028`) rather than the Figma sample text (`2025`) — data-driven is correct.
- **Stepper kept as a stub** to respect the Task 1/Task 2 split; Task 2 owns active/completed/inactive states + responsive.
- **Page transition:** direction-aware `<transition mode="out-in">` on the content area (keyed on `currentStep`) — forward/backward slide+fade, with `useWizard.direction` driving the name and a `prefers-reduced-motion` fallback. CSS lives in `app.scss`.
- **Verification:** `yarn build` succeeds.


## Tasks 2 - build stepper
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Reference the example and status to build stepper component.
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1099-1001&m=dev
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1101-1047&m=dev
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1076-904&m=dev

### Result / Decision

**Figma sources:** stepper states across 3 frames — `1099:1001` (step 1 active), `1101:1047` (steps completed + last active), `1076:904` (Review page showing a step in error). Container `px-120 py-24` (→ 80px), circles 32px, labels 13px, connectors `flex-1 h-2 px-16`.

#### Implemented — `src/components/WizardStepper.vue` (replaces Task 1 placeholder)
Four per-step states resolved by `stateOf(stepId)` (error has priority):
- **active** (`id === currentStep`): `bg-brand-emphasis-rest` circle + white number, label `text-neutral` semibold.
- **completed** (`id < currentStep`): `bg-brand-emphasis-rest` circle + white `check` icon, label `text-neutral` medium.
- **inactive** (`id > currentStep`): `bg-surface-l2` circle + `text-neutral-quiet` number, label `text-neutral-quiet` regular.
- **error** (`id ∈ errorSteps`): `bg-danger-emphasis-rest` circle + white `priority_high` icon, label `text-danger`.
- Connector after step `i`: `bg-brand-emphasis-rest` when `i < currentStep`, else `bg-surface-l2`.
- Steps are clickable (`goToStep`); `aria-current="step"` on the active one.

#### State wiring — `src/composables/useWizard.js`
- Added `errorSteps` (reactive `Set`) + `setStepErrors(ids)` / `clearStepErrors()`. The validation/review task populates it; the stepper consumes it. Decouples the error visual from the validation logic.

#### Decisions
- **Markup:** semantic `<ol>/<li>` progress list; each step is a `role="button"` `<div>` (not a `<button>`) so the label inherits the app font instead of the UA button font, and no button reset / focus-padding leaks in. Keyboard (Enter/Space) + `aria-current="step"` preserved. Connector matches Figma's flex layout exactly (`flex-1` wrapper with `px-16`, inner `flex-1 h-2 rounded-1` line).
- **Icons** via Quasar material-icons (`check`, `priority_high`) instead of importing the Figma swatch images — lighter, themeable, matches the "no raw assets" preference.
- **13px label** kept as literal (`text-[13px]`) — design uses 13px and there is no 13px type token; this is a size, not a color, so the no-hardcoded-hex rule is unaffected.
- **Re-verified** against all three Figma demo frames (active / completed+active / error) — circles, labels, connectors, and colors match.
- **Verification:** `yarn build` succeeds.


## Tasks 3 - build page Attendee Information
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
With mock data - src\mocks\event.js
Reference the example to build main page Attendee Information.
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1070-932&m=dev
### Result / Decision

**Figma source:** `Content` frame `1070:932` — Ticket Type selector (`1070:958`) + Attendee form (`1070:934`). Cards `p-20 rounded-6 gap-12` with `0 4px 16px / 0 1px 3px` shadow; inputs `px-12 py-10 rounded-6`.

#### State store — `src/composables/useRegistration.js` (provided in `MainLayout`)
Central reactive store (the System Design "Storage"): `attendee` (6 fields), `ticketTypeId`, `selectedAddons` (filled by the Add-ons step later), and `hasMerchandise` computed. Provided once so step pages can unmount without losing data and Review can read everything.

#### Components added
- `TicketCard.vue` — single ticket; unselected `bg-surface-l1` + 1px `border-neutral-muted`, selected `bg-brand-muted-rest` + 2px `border-brand-emphasis` + green `✓ Selected` badge (`bg-success-bold-rest`). Perks use `check_circle`. `role="button"` + keyboard.
- `TicketSelector.vue` — single-select; **equal-height row ≥1280px, scroll-snap carousel <1280px** (`useMediaQuery('(max-width: 1279px)')`).
- `FormField.vue` — label (`text-sm` medium) + Quasar `q-input` (outlined, dense), `v-model` passthrough.
- `AttendeeForm.vue` — `q-form` responsive grid (`grid-cols-1 sm:grid-cols-2`); Job Title + Shipping span full width. Shipping label flips to required-style ("Shipping Address" vs "(Optional)") via `hasMerchandise`. No inline validation (runs at Review per spec).
- `pages/steps/AttendeeInfoStep.vue` + `StepPlaceholder.vue` (steps 2–4).

#### Wiring
- `IndexPage.vue` now maps `currentStep → component` (step 1 = AttendeeInfoStep, else placeholder), inside the keyed transition.
- `MainLayout.vue` calls `provideRegistration()` alongside `provideWizard()`.
- `app.scss` — scoped `.attendee-input` tweaks so `q-input` matches Figma (6px radius, neutral-muted border, brand focus, 16px text).

#### Decisions
- **Carousel:** native scroll-snap (`snap-x snap-mandatory`, `snap-center`, `scroll-smooth`) over `q-carousel` — cards have variable heights (VIP tallest) which `q-carousel`'s fixed height can't handle. Figma has **no narrow/mobile frame** (every frame is 1440px), so the <1280px layout is a responsive addition with no Figma reference to violate.
- **Conditional shipping field** built strictly from Figma `Shipping Address — Conditional States` (`1203:587`): optional → `(Optional)` + `border-neutral-muted`; merchandise → `*` + `border-neutral-emphasis`; merchandise+empty(after submit) → red label + `border-danger-emphasis` + "required for merchandise orders". Gated by `attemptedSubmit` so nothing reddens pre-submit. `FormField` now takes `required` / `error` / `errorMessage`.
- **Input chrome:** `q-input` tuned to the Figma spec — 44px height, 6px radius, 16px text, `text-neutral-quiet` placeholder, brand focus ring; error border via Quasar `:error` (`--q-negative` = `#c71a1a`).
- **Heading** "Attendee Information" verified `text-h3` (24/28 bold) from `1070:933`.
- **Perk icon:** Quasar `check_circle` instead of the Figma duotone image — themeable, no raw asset.
- **Token-first**, no hardcoded hex (shadow is a black-alpha effect, not a color token).
- **Verification:** `yarn build` succeeds; key utilities (card shadow, snap, responsive grid, brand tokens) confirmed in generated CSS.

## Tasks 4 - build page Select Sessions
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
With mock data - src\mocks\sessions.js
Reference the example to build main page Select Sessions.
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1072-938&m=dev
### Result / Decision

**Figma source:** `Step 2 — Session Selection` content `1072:938`. Cards `p-16 gap-8 rounded-6`; date tabs `bg-surface-l2 p-4 rounded-10`; capacity bar `h-6 rounded-3`.

#### Components added
- `SessionCard.vue` — track badge (per-track scale colours: main=gray, frontend=yellow, backend=blue, devops=orange), 16px checkbox, title/speaker/time, capacity bar + spots text. States: **selected** (`bg-brand-muted-rest` + 2px brand + checked box), **unselected** (white + 1px muted + empty box w/ `border-neutral-emphasis`), **full/disabled** (`bg-surface-l2`, `text-neutral-disabled`, no box, "Sold Out"). `role="checkbox"` + keyboard.
- `DateSwitcher.vue` — segmented control (`role="tablist"`/`tab`), active = `bg-brand-emphasis-rest` white, inactive = `text-neutral-muted`.
- `pages/steps/SessionsStep.vue` — groups sessions by day, date switcher + "N sessions selected" hint + 2-col responsive grid.
- `utils/datetime.js` — UTC-based time/date formatting (timestamps are `…Z`; format in UTC so wall time matches the design).

#### State — `useRegistration`
- Added `selectedSessionIds` + `toggleSession` / `isSessionSelected` (System Design "sessions selection states").

#### Capacity bar tone (matches Figma examples)
full → `bg-red-500` / "Sold Out"; ≥75% → `bg-orange-600` + `text-orange-700`; ≥50% → `bg-yellow-800` + `text-warning`; <50% → `bg-brand-emphasis-rest` + `text-brand-emphasis`.

#### Decisions
- **Capacity vs conflict:** per the README (authoritative), only **capacity-full** sessions are disabled; **time conflicts stay freely selectable** and are flagged at Review. The Figma mock greys a *conflicting* (not full) session — I followed the README and noted the divergence.
- **Checkbox** is a 16px custom box (not `q-checkbox`) to hit the exact Figma `rounded-2` + brand fill.
- **Colours** use the project's scale utilities (`bg-orange-600`, etc.) — verified in generated CSS to equal the Figma raw scale refs exactly.
- **Verification:** `yarn build` succeeds.

## Tasks 5 - Add-ons
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
With mock data - src\mocks\addons.js
Reference the example to build main page Add-ons.
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1073-925&m=dev
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1149-595&m=dev
### Result / Decision

**Figma sources:** `Step 3 — Add-ons` (`1073:925`, Workshops) + `Step 3 — Add-ons (Merchandise)` (`1149:595`). Two-column layout: list (flex-1) + 380px Order Summary.

#### Components added
- `AddonCard.vue` — workshops & meals (toggle select). Header (name + brand-coloured price), description, optional time line, optional status. Workshop status: "N spots remaining" / "Sold Out" / conflict (danger). Selected = `bg-brand-muted-rest` + 2px brand.
- `MerchCard.vue` — `rounded-8`, 1px brand border when in cart; `SizeSelect` (if `sizes`) + `QuantityPicker` (0..`maxQuantity`) + "max N" + green "✓ Added to order".
- `QuantityPicker.vue` (±, 28px, min/max-disabled), `SizeSelect.vue` (q-menu dropdown, "Select" placeholder).
- `OrderSummary.vue` — line items, VIP workshop-discount line (brand), divider, total; `$X,XXX.XX` via `utils/currency.js`.
- `ShippingBanner.vue` — info banner (info-subtle bg + info-muted border), shown on Merchandise tab when cart has merch.
- `SegmentedTabs.vue` — generic segmented control; **replaces `DateSwitcher`** (SessionsStep refactored to it, DateSwitcher deleted).

#### State / logic
- `useRegistration`: `workshopIds`, `mealIds`, `merch` (id→{qty,size}) + toggles/setters; `hasMerchandise` now derives from merch quantities. Removed the old `selectedAddons` stub.
- `useOrderSummary.js` — shared computed (lines, VIP 10% workshop discount, total); reused by Review later.
- **Workshop conflict:** workshops overlapping a Step-2 selected session are disabled (per README, which *does* require inline workshop-conflict blocking — distinct from session conflicts which defer to Review).

#### Decisions
- **Pricing:** workshop shown at full price with a separate "Workshop discount (VIP 10%)" line (matches Figma); merch as "Name × qty".
- **Shipping banner** placed on the Merchandise tab when merch is in cart (matches Figma; README only says "when merchandise added").
- **Order summary names** use full mock names (e.g. "Developer Sticker Pack × 3") vs the Figma mock's shortened "Sticker Pack" — data-driven is correct.
- **Meals** have no Figma card reference → styled consistently with workshop cards (brand price, no time/status).
- **Verification:** `yarn build` succeeds; info/success/surface tokens + `rounded-8` confirmed in generated CSS.



## Tasks 6 - Review Your Registration
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Reference the example to build main page Review Your Registration
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1074-897&m=dev
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1076-904&m=dev

The Validator for each steps' data should be placed on this page and list errors to present.



* For Step 1 — Attendee Info
**Fields:**
| Field            | Type  | Validation                                                                 |
| ---------------- | ----- | -------------------------------------------------------------------------- |
| Full Name        | text  | required                                                                   |
| Email            | email | required, valid email format                                               |
| Phone            | tel   | required, valid phone format                                               |
| Company          | text  | required                                                                   |
| Job Title        | text  | required                                                                   |
| Shipping Address | text  | optional — becomes **required** when any merchandise is selected in Step 3 |


* For Step 2 — Session Selection
**Time-conflict detection** — If conflicts are detected, the relevant step should be indicated with errors.

* For Step 3 — Add-ons
**Workshop time conflicts** — Since the page are freely moving, the incoming error due from async states changing should check again in page 4.
**Merchandise options** — some items have `sizes` (size selector) and `maxQuantity` (quantity picker), please make sure both attributes are assigned with value in step4.

### Result / Decision

**Figma sources:** `Step 4 — Review & Submit` (`1074:897`), `Validation Error State` (`1076:904`), `Success State` (`1075:903`). Section cards `bg-surface-l1 p-20 gap-12 rounded-6`; error banner `bg-danger-muted-rest`; success `text-h2 text-success`.

#### Validation — `composables/useValidation.js` + `utils/validators.js`
Unified, reactive, evaluated on Review:
- **Step 1**: full name / company / job title required; email required + format; phone required + format; ticket required; shipping required when merchandise in cart.
- **Step 2**: pairwise time-overlap among selected sessions.
- **Step 3**: re-check workshop↔session conflicts (async state may have changed); sized merch with qty>0 must have a size.
- Exposes `errorsByStep`, flat `errorList` (banner), `errorStepSet` (stepper), `isValid`.

#### Submission — `composables/useSubmission.js`
`submit()` sets `attemptedSubmit`; if invalid, stays (errors surface); if valid, records `confirmationId` (`TC<year>-#####`) and flips `submitted`. `canSubmit` disables the button after a failed attempt until fixed.

#### Components
- `ReviewStep.vue` — title, error banner, 3 review sections (Attendee / Sessions / Add-ons) + Pricing Summary (Grand Total). Per-field red `— (required)` / `— (invalid)` in the Attendee section; section gets red border/header when its step has errors.
- `ReviewSection.vue` (card + `Edit → Step N` link via `goToStep`), `ErrorBanner.vue`, `SuccessScreen.vue` (green check, confirmation #, data-driven thank-you, Back to Home → `reset()` + step 1).

#### Wiring
- `useRegistration`: `submitted`, `confirmationId`, `reset()`.
- `WizardFooter`: on the last step the primary button calls `submit()` (disabled when `!canSubmit`).
- `MainLayout`: hides stepper + footer when `submitted` (success is full-screen under the header).
- `IndexPage`: maps step 4 → `ReviewStep`, renders `SuccessScreen` when submitted, and a `watchEffect` keeps the stepper's error marks in sync with live validation after a submit attempt (persists while editing). Removed the obsolete `StepPlaceholder`.

#### Decisions
- **Stepper errors driven reactively** (not set once) so red marks clear live as the user fixes fields via the Edit links.
- **Review add-on/ticket values** use whole-dollar `($149)` per Figma; the Pricing Summary uses `$X,XXX.XX`.
- **Global `button { font-family: inherit }`** so the text `Edit` link (a real `<button>`) matches the app font.
- **Verification:** `yarn build` succeeds; danger/success tokens + `text-h2` confirmed in generated CSS.



## Tasks 7 - Card type solid border fix
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Currently components:
Ticket card
AddonCard
MerchCard
SessionCard

For the card types, they do not set border width and style, and please set the box-sizing - content-box for cards to prevent page shaking when selecting status change.

Reference object:
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1172-625&m=dev
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1172-609&m=dev
### Result / Decision

#### Root cause (verified in the built CSS)
- `border-2` is **not a generated utility** in this UnoCSS config (no `border-width:2px` anywhere). With a global `border-style: solid` (preflight) and no `border-width:0` reset, selected cards using `border-2` fell back to the browser default `medium` (~3px). So selecting flipped the border `1px → ~3px`, changing the card's box size → layout shake.
- `box-sizing: border-box` is already applied globally by Quasar.

#### Fix — 1px-margin compensation (keeps Figma's 1px-unselected / 2px-selected look, no shake)
All cards declare `border-solid` in the base class. State classes then keep the **total outer offset constant** at 2px per side:
- **Selected**: `border-[2px]` + no margin (note: `border-2` is replaced with the arbitrary `border-[2px]`, which actually generates `border-width:2px`).
- **Unselected / disabled / full**: `border` (1px) + `m-[1px]` (1px margin).

Since `(1px border + 1px margin) == (2px border + 0)`, the margin-box never changes when toggling selection → no shake, while the **2px-selected emphasis from Figma is preserved**.
Applies to `TicketCard`, `SessionCard`, `AddonCard`. `MerchCard` keeps a constant **1px** border (its Figma selected state is 1px, not 2px) — it was the reference object.

#### Decision on `box-sizing: content-box`
Not applied. With **auto-height** cards the border always adds to the outer height regardless of `box-sizing`, so content-box would **not** fix the shake; worse, overriding Quasar's `border-box` would break the flex/grid + padding sizing the cards rely on. The margin-compensation above is what removes the shake.

**Verification:** `yarn build` succeeds; `border-[2px]` emits `border-width:2px` and `m-[1px]` emits `margin:1px` (the old `border-2` generated nothing).


## Tasks 8 - Selected badge width and layout shift fix
### Status
#### Done
true
#### Pending
false
#### Deprecated
false

### Description
Currently in the page Attendee Information's Select Ticket Type section, the selected badge inside the ticket card may affect the card layout when switching between ticket types.

For the ticket cards, the selected badge should always reserve its layout space in every card to prevent page or card shaking when selection changes.

The selected badge should not be conditionally rendered or hidden with `display: none`.  
Each ticket card should always contain the selected badge element, but use `visibility: hidden` when the card is not selected and `visibility: visible` when selected.

The selected badge width should fit its text content instead of stretching across the card width.  
The correct selected badge should be compact and aligned with the `Selected` text length.

Expected behavior:
- Every ticket card has the selected badge element.
- Unselected cards keep the badge invisible with `visibility: hidden`.
- Selected card shows the badge with `visibility: visible`.
- Badge width is based on content length, not full card width.
- Switching selected ticket type should not cause layout shaking.
- Card height and inner spacing should remain stable between selected and unselected states.
### Result / Decision

**Files:** `src/components/TicketCard.vue`, `src/components/TicketSelector.vue`, `src/components/SessionCard.vue`, `src/components/AddonCard.vue`, `src/components/MerchCard.vue`.

#### 1. Selected badge — `TicketCard.vue`
- The `✓ Selected` badge is **always rendered** (removed `v-if="selected"`). Every card now reserves the badge row + its `gap-12`, so the tallest-card height no longer changes when selection moves between General / VIP / Student → no card/page shake.
- Visibility toggled via **`:style="{ visibility: selected ? 'visible' : 'hidden' }"`** (kept in flow, just invisible) instead of `display:none`.
- Added **`self-start`** (`align-self: flex-start`) so the badge sizes to its `✓ Selected` text instead of stretching to the full card width.
- `:style` used (not a `visible` / `invisible` class pair) because this UnoCSS config doesn't generate `.invisible` (same gap that made `border-2` a no-op in Task 7).

#### 2. Stray bottom space in the equal-height row — `TicketSelector.vue`
- Added **`[align-content:start]`** to the `flex gap-[16px] items-stretch` row. Keeps the Figma equal-height layout (`items-stretch`) but stops stretched cards from gaining extra bottom space. (Used the arbitrary form because `content-start` also isn't generated by this UnoCSS config.)

#### 3. Stray space below paragraphs — `TicketCard` / `SessionCard` / `AddonCard` / `MerchCard`
- Quasar's base `p { margin: 0 0 16px }` was adding 16px under every `<p>` on top of the flex `gap`. Added **`m-0`** to each card `<p>` (description / title / speaker / time / spots / status / "Added to order") so inner spacing is driven purely by `gap`, matching Figma. **Scoped to the card components — no global `p` reset** (to avoid affecting other copy).

**Verification:** `yarn build` succeeds.

## Tasks 9 - Session Availability, Disabled State, and Tag Style Fix
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Currently in the **Select Sessions** section, some session card states appear inconsistent with the expected behavior and the assignment requirements.
According to the requirements, time conflict validation should happen in a later step. Therefore, during the session selection step, a session should not be disabled only because its time overlaps with another selected session.
For example, `Database Performance Tuning` has available spots, so it should remain selectable in the session selection step even if its time overlaps with another selected session. The time conflict should be handled later by validation logic.
At the same time, sold-out sessions should be treated as unavailable. A sold-out session should not be selectable unless the requirements explicitly define it as a reserved or preselected state.
The visual style of disabled sessions should also be consistent. When a session card is disabled, its category tag should not keep the active category color. The tag color should be visually muted and aligned with the disabled card background/state.
#### Expected Behavior
1. Sessions with available spots should remain selectable during the session selection step.
2. Time conflict validation should not disable session cards in this step.
3. Time conflicts should be checked in the later validation step as required.
4. Sold-out sessions should be disabled and unselectable.
5. Sold-out sessions should not be counted as selected unless there is an explicit reserved/preselected state.
6. Disabled session cards should use a clearly disabled visual style.
7. Category tags inside disabled cards should also appear disabled.
8. Disabled category tags should use a muted/background-aligned color instead of the active category color.
9. The same category should use consistent active styling across available cards.
10. The UI should clearly distinguish between:
    * available sessions
    * selected sessions
    * sold-out sessions
    * disabled sessions
### Result / Decision
* Written requirements are treated as the source of truth when screenshots and behavior appear inconsistent.
* Time conflict validation is deferred to the later validation step.
* Available sessions remain selectable in the session selection step.
* Sold-out sessions are unavailable and cannot be newly selected.
* Disabled cards should visually mute their inner elements, including category tags.
* Category tag colors should be normalized by category when the session is active or selectable.

#### Implementation — `src/components/SessionCard.vue`
- **Availability already correct** (from Task 4): disabling is driven **only** by `isFull` (`registered >= capacity`). There is no conflict/overlap logic in `SessionCard` or `SessionsStep`, so time-overlapping-but-available sessions (e.g. *Database Performance Tuning*) stay selectable; conflicts are validated later in the Review step (Task 6). Sold-out cards can't be toggled (`onToggle` guards on `isFull`) and nothing is preselected, so they're never counted as selected.
- **Fix applied:** `badgeClass` now returns **`bg-surface-l3 text-neutral-disabled`** when `isFull`, instead of the track colour — so a sold-out card's category tag is muted and aligned with the disabled (faded) card text, rather than keeping the active category colour. Available/selected cards still use the per-track `TRACK_BADGE` map (consistent active styling).
- **State distinction:** available (white bg, coloured tag, empty checkbox, "N spots left") / selected (`bg-brand-muted-rest` + brand border + checked box) / sold-out (`bg-surface-l2`, muted tag + faded text, no checkbox, red bar + "Sold Out").

- **Disabled tag colour** finalised to the Figma values **`bg-gray-50 text-gray-700`** (gray/50 + gray/700), matching the disabled card in the design (replacing an earlier too-faint `text-neutral-disabled`).
- **Capacity bar + spots-left `tone`** (final): sold-out → `bg-danger-emphasis-rest` / `text-danger-emphasis`; ≥75% → `bg-orange-600` / `text-orange-700` (kept the Figma orange-600/700 split); ≥50% → `bg-yellow-800` / `text-yellow-800` (normalised so text == bar); <50% → `bg-brand-emphasis-rest` / `text-brand-emphasis`.
- **"Sold Out"** is **bold + `text-danger-emphasis`**; other spots stay `font-medium`. `--text-danger-emphasis` is defined in `:root` (`#991414`), so the `var(..., #000)` fallback never applies (no black text).

**Verification:** `yarn build` succeeds; `bg-gray-50` / `text-gray-700` / `text-yellow-800` / `text-danger-emphasis` (+ `--text-danger-emphasis: #991414`) present in generated CSS.

> Note: weights still render heavier than the design tokens (e.g. `font-medium` 570 → ~700) because the Inter variable font isn't loaded yet — a global Inter import is the proper fix (deferred).

## Tasks 10 - Replace hardcoded step numbers in Review validation
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
`src/pages/steps/ReviewStep.vue` (and `useValidation`) reference steps with bare
magic numbers — e.g. `:edit-step="2" :error="sectionError(2)"` and
`errorsByStep = { 1, 2, 3 }`. Hardcoded indices are brittle and unclear from an
engineering perspective: the link between a review section, its validation
bucket, and its wizard step is implicit.

Replace the magic numbers with a single named step constant (source of truth in
`src/constants/steps.js`) used by `STEPS`, `useValidation.errorsByStep`, and the
`ReviewStep` sections.
### Result / Decision

- `src/constants/steps.js`: added a named **`STEP`** enum (`ATTENDEE: 1`, `SESSIONS: 2`, `ADDONS: 3`, `REVIEW: 4`) as the single source of truth; `STEPS[].id` now references it.
- `src/composables/useValidation.js`: `errorsByStep` keyed by `[STEP.ATTENDEE]` / `[STEP.SESSIONS]` / `[STEP.ADDONS]` instead of `1/2/3`.
- `src/pages/steps/ReviewStep.vue`: each `ReviewSection` now uses `:edit-step="STEP.X"` / `:error="sectionError(STEP.X)"` — no bare indices.

Now the review section ↔ validation bucket ↔ wizard step link is explicit and renaming/reordering is centralised. (`useWizard`'s initial `ref(1)` and `SuccessScreen`'s `goToStep(1)` are plain "go to first step" — left as-is; could also adopt `STEP.ATTENDEE` for full consistency.)

**Verification:** `yarn build` succeeds; no bare `sectionError(N)` / `edit-step="N"` remain.

## Tasks 11 - Automatic workshop de-selection upon session conflict
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Address the desync issue where a user selects a workshop, goes back to Step 2, and selects a conflicting session. Since the specification document does not state that selecting a workshop prevents selecting overlapping sessions in the future, the session selection should remain free, and any conflicting workshops should be automatically deselected.

### Result / Decision

#### Implementation — `src/composables/useRegistration.js`
- Moved the auto-filter logic directly into the `toggleSession` action.
- When `toggleSession` is called to add/remove a session, it immediately filters the `workshopIds` array to remove any conflicting workshops.
- This adheres strictly to the evaluation criteria "Preference for computed derived state over manual watch updates" by avoiding an global reactive `watch` effect and handling state mutations purely inside the triggering action.

**Verification:** `yarn build` succeeds.

## Tasks 12 - Fix ReviewSection border style on error
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Ensure ReviewSection container styling dynamically changes to a 2px red border (`border-[2px] border-danger-emphasis`) on error states instead of remaining a 1px border.

### Result / Decision

#### Implementation — `src/components/ReviewSection.vue`
- Changed border configuration to dynamically toggle between `border-[2px] border-danger-emphasis` (on error, no margin) and `border border-neutral-muted m-[1px]` (on non-error, margin 1px) to enforce the correct 2px styling.
- Employed margin compensation (no margin on error state, `m-[1px]` on normal state) to keep layout offsets aligned.

**Verification:** `yarn build` succeeds.

## Tasks 13 - Refactor ReviewSection Edit button to span
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Refactor the Edit button in ReviewSection from a `<button>` tag to a custom styled `<span>` with proper keyboard accessibility. This prevents default browser and framework button styles from leaking in and causing CSS styling differences.

### Result / Decision

#### Implementation — `src/components/ReviewSection.vue`
- Changed the `<button>` element to a `<span>` element.
- Added `role="button"`, `tabindex="0"`, and key handlers (`@keydown.enter.prevent`, `@keydown.space.prevent`) to maintain full accessibility (a11y) while avoiding HTML button style pollution.

**Verification:** `yarn build` succeeds.

## Tasks 14 - Remove H1 H2 H3 margins via mt-0 mb-0 classes
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
In multiple pages, native `h1`, `h2`, and `h3` heading elements had default top and bottom margins. These margins should be cleared to 0 by applying `mt-0 mb-0` utility classes, without adding or modifying any global CSS files.

### Result / Decision

#### Implementation — Heading Margin Fixes
We identified all native Heading tags inside the Vue templates and ensured they explicitly declare `mt-0 mb-0` utility classes to zero out margins:

- **src/components/OrderSummary.vue**: Updated `h3` class list to include `mb-0` (`mt-0 mb-0`).
- **src/components/ReviewSection.vue**: Updated `h3` class list to include `mb-0` (`mt-0 mb-0`).
- **src/components/TicketSelector.vue**: Added both `mt-0` and `mb-0` to the `h3` class list.
- **src/pages/steps/AddonsStep.vue**: Updated `h2` class list to include `mb-0` (`mt-0 mb-0`).
- **src/pages/steps/AttendeeInfoStep.vue**: Updated `h2` class list to include `mb-0` (`mt-0 mb-0`).
- **src/pages/steps/ReviewStep.vue**: Updated both `h2` (Review Title) and `h3` (Pricing Summary) class lists to include `mb-0` (`mt-0 mb-0`).
- **src/pages/steps/SessionsStep.vue**: Updated `h2` class list to include `mb-0` (`mt-0 mb-0`).

#### Decisions
- Direct inclusion of `mt-0 mb-0` in Vue templates was preferred over modifying CSS files or `uno.config.js` to strictly follow the "no new global CSS" constraint.
- This ensures all heading tags maintain layout stability and align exactly with the layout gap specifications without being polluted by browser or Quasar default margins.

**Verification:** Verified via `grep` that all `h1`-`h6` occurrences inside the workspace templates now correctly utilize the `mt-0 mb-0` utilities.

## Tasks 15 - Fix WizardFooter goBack button styling
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Modify the `goBack` button in `WizardFooter.vue` to resolve style inconsistencies with the Figma design. The button should use an unelevated secondary button style with a background, border-radius, and specific text color, and should not contain a back arrow icon.

Figma spec:
- border-radius: `var(--border-radius-default, 0.625rem)`
- background: `var(--components-button-secondary-bg-muted-rest, #E3E6E8)`
- color: `var(--components-button-secondary-text-on-muted, rgba(0, 0, 0, 0.6))`
- no icon.

### Result / Decision

#### Implementation — `src/components/WizardFooter.vue`
- Changed the `goBack` button's styling in [WizardFooter.vue](file:///D:/startup/nitra-fe-event-registration-assignment/src/components/WizardFooter.vue) from `flat` to `unelevated`.
- Removed `icon="arrow_back"` to match Figma design.
- Replaced the text color class `text-neutral-muted` and applied inline style for `border-radius`, `background`, and `color` matching the Figma design variables and fallbacks.

**Verification:** `yarn build` succeeds.

## Tasks 16 - Fix AppHeader title margin (chore)
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Clear default margins of the event name paragraph in `AppHeader.vue` by applying the `m-0` class, resolving minor styling alignment issues in the header.

### Result / Decision

#### Implementation — `src/components/AppHeader.vue`
- Added `m-0` to the `<p class="text-h4 ...">` tag in [AppHeader.vue](file:///D:/startup/nitra-fe-event-registration-assignment/src/components/AppHeader.vue).

**Verification:** `yarn build` succeeds.

## Tasks 17 - Replace TicketSelector carousel with Quasar Carousel
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Replace the native scroll-snap carousel in `TicketSelector.vue` with Quasar's Carousel component (`q-carousel`) for screen widths below 960px. Ensure the carousel supports swipe, animation, navigation, and arrows without auto-selecting on transition.

### Result / Decision

#### Implementation — `src/components/TicketSelector.vue`
- Replaced native horizontal scroll wrapper with `<q-carousel>` and `<q-carousel-slide>`.
- Set `carouselSlide` ref and synced it using a `watch` on `ticketTypeId.value` to ensure the carousel slides to the active selection when clicked.
- Omitted auto-selection logic on swiping (no watch in the reverse direction), so swiping/transitioning the carousel does not automatically select the ticket type.
- Styled `q-carousel-slide` with `px-[48px] pb-[40px] pt-[8px]` and set `max-w-[400px]` on the card to prevent overlap with the carousel controls/arrows.

**Verification:** `yarn build` succeeds.

## Tasks 18 - Make layout padding responsive on small viewports and limit max-width
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
On viewport widths below 768px, set the horizontal padding of `IndexPage.vue` to 24px (from 120px) to prevent layout squishing on mobile and tablet screens. For alignment consistency, apply the same responsive padding to `WizardStepper.vue` and `WizardFooter.vue`. Additionally, limit the maximum layout width of the page container, stepper, and footer to 1280px and center them.

### Result / Decision

#### Implementation — Responsive Padding and Max-Width
- **src/pages/IndexPage.vue**: Changed `px-[120px]` to `px-[24px] md:px-[120px]` on the main container div, and set the maximum width constraint to `max-w-[1280px]` (from `max-w-[1440px]`).
- **src/components/WizardStepper.vue**: Changed `px-[120px]` to `px-[24px] md:px-[120px]` on the step list container, wrapped it in a full-width background div, and added `max-w-[1280px] mx-auto` to the list container.
- **src/components/WizardFooter.vue**: Changed `px-[120px]` to `px-[24px] md:px-[120px]` on the action footer container, wrapped it in a full-width background div, and added `max-w-[1280px] mx-auto` to the inner flex container.

**Verification:** `corepack yarn build` succeeds.



## Tasks 19 - Responsive Stepper Layout (<1024px)
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
On viewport widths below 1024px, modify the `WizardStepper.vue` layout to stack step icons on top of their labels ("ICON在上 文字在下") and completely hide the horizontal transition progress lines. For widths 1024px and above, the layout should remain unchanged (horizontal icon-next-to-label alignment with visible connector lines).

### Result / Decision

#### Implementation — Responsive Stepper Layout
- **src/components/WizardStepper.vue**:
  - Updated the list item (`li`) container's layout class to `flex flex-col lg:flex-row items-center`, adjusting flex behaviors so they expand evenly on mobile/tablet and behave as inline items on desktop (`flex-1 lg:flex-none` for the last item).
  - Configured the step interaction button container to stack vertically on small viewports with a 6px gap, and horizontally on desktop screens with a 10px gap: `flex flex-col lg:flex-row items-center text-center lg:text-left gap-[6px] lg:gap-[10px]`.
  - Used `lt-lg:hidden` (less-than-lg viewport size) on the transition line containers to avoid styling collision with Quasar's default `.hidden` class which uses `!important`, ensuring connector lines are correctly visible on viewports >= 1024px.

**Verification:** `corepack yarn build` succeeds.




## Tasks 20 - Standardize phone format with E.164 validation
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
The phone field used a lenient `isPhone` check (any digits + separators), so the
expected phone presentation was undefined. Define the phone format standard as
**E.164** and design a dedicated validator `isValidE164Phone`.
### Result / Decision
- `src/utils/validators.js`: replaced the lenient `isPhone` with **`isValidE164Phone`**:
  ```js
  (v) => /^\+[1-9]\d{1,14}$/.test(String(v).replace(/ /g, ''))
  ```
  - **Normalize:** every space is removed first (`replace(/ /g, '')`), so the user may type grouped digits like `+1 555 1234567`.
  - **Pattern `^\+[1-9]\d{1,14}$`:** a leading `+`, a country-code digit `1–9` (no leading zero), then `1–14` more digits → **2–15 digits total** (E.164 max).
  - **Accepts:** `+15551234567`, `+1 555 1234567`, `+442079460958`. **Rejects:** `+1 (555) 123-4567` (parens/dashes), `5551234567` (no `+`), `+0555…` (leading zero), empty.
- Consumers updated: `useValidation.js` (Step-1 phone error), `ReviewStep.vue` (per-field `— (invalid)`), `AttendeeForm.vue` (inline placeholder hint).
- **Presentation standard = E.164**: the input hint guides to `+15551234567`; the value is stored/validated as E.164 and shown as-is in the Review summary.

## Tasks 21 - Force vertical scrollbar on body
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
To prevent layout jitter/shift (page layout shifting horizontally) when navigating between steps of different heights, enforce a persistent vertical scrollbar on the viewport.

### Result / Decision

#### Implementation — Persistent Scrollbar
- **src/css/app.scss**: Added `html { overflow-y: scroll; }` to force the vertical scrollbar to be always visible.

**Verification:** `corepack yarn build` succeeds.


## Tasks 22 - Responsive padding for SegmentedTabs (<480px)
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
On viewport widths below 480px, reduce the horizontal padding (`px`) of the tabs inside `SegmentedTabs.vue` to 10px (from 20px) to prevent layout overflow on small screens.

### Result / Decision

#### Implementation — Responsive Padding
- **src/components/SegmentedTabs.vue**: Configured responsive padding using UnoCSS utility class `max-[480px]:px-[10px]` (less than 480px viewport width) on the tab items, eliminating the need for scoped CSS styles.

**Verification:** `corepack yarn build` succeeds.


## Tasks 23 - Correct the positioning of validation error alerts
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Correct the positioning of the validation error alerts in [ReviewStep.vue].
Reference Figma design: https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1076-904&m=dev

### Result / Decision

#### Implementation — Correct Error Banner Positioning
- **src/pages/steps/ReviewStep.vue**: Moved the `<ErrorBanner>` component declaration above the `<h2>` page title tag, matching the vertical positioning (y=40 vs y=183) shown in the Figma validation error mock layout (node `1076:904`).


## Tasks 24 - Import and set Inter font globally
### Status
#### Done
true
#### Pending
false
#### Deprecated
false
### Description
Import the Inter variable font globally to match the Figma design's text weights and typography.

### Result / Decision

#### Implementation — Global Font Import
- **index.html**: Added the Google Fonts link for the Inter font (`wght@400;500;600;700`).
- **src/css/app.scss**: Set `font-family: 'Inter', sans-serif;` on the `body` selector to apply the font globally.

**Verification:** `corepack yarn build` succeeds.



