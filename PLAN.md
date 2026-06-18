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

