# Design System Documentation: Industrial Precision & Editorial Depth

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Blueprint"**

This design system moves beyond the "industrial spreadsheet" trope to create a high-performance digital environment for **Grupo Pedreira Um Valemix**. The goal is to balance the raw power of heavy industry with the surgical precision of modern engineering. 

We achieve this through **Editorial Industrialism**: a layout philosophy that treats technical asset data with the same reverence as a high-end architecture magazine. By rejecting standard "boxed" UI in favor of intentional asymmetry, massive typographic contrast, and layered tonal surfaces, we communicate that the assets cataloged here are not just machines—they are the backbone of a high-performance operation.

### Key Principles
*   **Structured Breathing Room:** High-density technical data must be balanced by expansive white space.
*   **Authority through Scale:** Use the `display-lg` scale to anchor pages, creating a sense of "monolithic" stability.
*   **The "Blueprint" Grid:** Alignment is our primary decorative element. Objects should feel "snapped" into a rigorous invisible grid.

---

## 2. Colors: The Tonal Machine
Our palette is rooted in the high-contrast environment of a construction site: the stark white of a plan, the deep charcoal of structural steel, and the high-visibility yellow of safety and action.

### The "No-Line" Rule
**Lines are a failure of layout.** To create a premium feel, designers are prohibited from using 1px solid borders to define sections. Boundaries must be established through:
1.  **Tonal Shifts:** Placing a `surface_container_low` (#f6f3f2) card against a `surface` (#fcf9f8) background.
2.  **Negative Space:** Using the `24` (5.5rem) spacing token to separate distinct functional areas.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials.
*   **Level 0 (Base):** `surface` (#fcf9f8) – The foundation.
*   **Level 1 (Sections):** `surface_container_low` (#f6f3f2) – Large structural zones.
*   **Level 2 (Cards/Interaction):** `surface_container_lowest` (#ffffff) – Primary interactive elements like asset cards. This creates a "lifted" effect without heavy shadows.

### The "Glass & Gradient" Rule
To prevent the "Industrial Yellow" from looking flat or "cheap," use a subtle linear gradient on primary CTAs:
*   **Start:** `primary_container` (#f2b705)
*   **End:** `primary` (#785900) at 15% opacity overlay.
*   **Glassmorphism:** For floating navigation or status "snackbars," use `surface_container_lowest` at 80% opacity with a `backdrop-filter: blur(12px)`.

---

## 3. Typography: Robust Technicality
We utilize a dual-font strategy to balance character with legibility.

*   **Display & Headlines (Manrope):** A geometric sans-serif that feels engineered. Use `display-lg` for asset categories. These should be set with tight letter-spacing (-0.02em) to feel like stamped steel.
*   **Body & Labels (Inter):** The "workhorse." Inter is used for all technical specifications (engine hours, load capacity, VIN). It provides maximum readability at small sizes (`body-sm`).
*   **Typographic Hierarchy:** Always lead with a `headline-lg` in `on_background` (#1c1b1b) followed immediately by a `label-md` in `primary` (#785900) for a "Serial Number" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "soft" for an industrial brand. We use **Tonal Layering** to define the Z-axis.

*   **Ambient Shadows:** If a floating element (like a modal) is required, use a shadow with a `20px` blur, `0%` spread, and `4%` opacity of the `on_surface` color. It should feel like an atmospheric occlusion, not a "glow."
*   **The "Ghost Border" Fallback:** If high-density data requires a container (e.g., a table), use the `outline_variant` (#d3c5ac) at **10% opacity**. It should be felt, not seen.
*   **Material Interaction:** When a user hovers over an asset card, transition the background from `surface_container_lowest` to `surface_bright` and apply a `sm` (0.125rem) "Ghost Border."

---

## 5. Components: The Industrial Kit

### Buttons
*   **Primary:** `primary_container` (#f2b705) fill, `on_primary_container` (#644a00) text. Corner radius: `sm` (0.125rem) for a sharp, mechanical feel.
*   **Secondary:** `surface_container_high` fill, no border.
*   **Tertiary:** Text-only, using `label-md` in all-caps with `2px` letter-spacing.

### Asset Cards & Lists
*   **Rule:** Forbid divider lines. 
*   **Structure:** Use a `surface_container_lowest` (#ffffff) card. Separate the "Asset Image" from "Technical Specs" using a background shift to `surface_container_low` on the bottom half of the card.
*   **Status Indicators:** Use a `full` roundedness (pill shape) for status chips (e.g., "In Maintenance"). Use `tertiary_container` for "Active" and `error_container` for "Alert."

### Input Fields
*   **Style:** Minimalist. No bottom line or box. Use a `surface_container_highest` background with `none` border. 
*   **Focus State:** A `2px` solid border using `primary` (#785900) only on the left side of the input, mimicking a "marker" on a blueprint.

### Technical Data Tables
*   Instead of lines, use "Zebra Striping" with `surface` and `surface_container_low`. 
*   Column headers must be `label-sm` in all-caps using the `secondary` (#5f5e5e) color.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins. For example, a left-aligned headline with a right-aligned data-table creates a sophisticated, "designed" feel.
*   **Do** use `primary_fixed_dim` (#f9bd14) for icons that represent mechanical movement or warnings.
*   **Do** utilize the `20` (4.5rem) spacing token between unrelated content blocks to maintain the "Editorial" vibe.

### Don't
*   **Don't** use `lg` or `xl` roundedness. Large rounded corners feel "consumer/soft." Stick to `none`, `sm`, or `md`.
*   **Don't** use pure black (#000000). Always use `on_background` (#1c1b1b) to keep the "Charcoal" industrial tone.
*   **Don't** use standard "Warning Yellow." Use our specific `primary_container` (#f2b705) to ensure the brand feels premium, not generic.
*   **Don't** use icons with rounded "organic" ends. Use sharp, stroke-based icons that match the `outline` (#817660) weight.

---
*Document Version: 1.0.0 | Context: Grupo Pedreira Um Valemix Industrial Asset Catalog*