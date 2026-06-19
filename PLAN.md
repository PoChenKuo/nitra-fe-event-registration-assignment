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
- **Verification:** `yarn build` succeeds.


## Tasks 2 - build stepper
### Status
#### Done
false
#### Pending
true
#### Deprecated
false
### Description
Reference the example and status to build stepper component.
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1099-1001&m=dev
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1101-1047&m=dev
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1076-904&m=dev

### Result / Decision


## Tasks 3 - build page Attendee Information
### Status
#### Done
false
#### Pending
true
#### Deprecated
false
### Description
Reference the example to build main page Attendee Information.
https://www.figma.com/design/pvfYMvJjMiDfJwe6zDrPCZ/Nitra-FE-Assessment---v2--Copy-?node-id=1070-932&m=dev
### Result / Decision
