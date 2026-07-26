---
Status: Final
Version: 1.2
Last Updated: 2026-07-19
Owner: Himanshu Raj
Purpose: To define the technical infrastructure for theming, ensuring components consume design tokens deterministically without hardcoding values or relying on specific tooling.
---

# 03_Theme_Architecture.md

## 1. Theme Ownership & State Management
* **Where does state live?** Theme state is managed globally via a dedicated Theme Provider context.
* **Mounting Location:** The Theme Provider must be mounted at the absolute root of the application.
  * *Hierarchy:* `Application Entry` → `Theme Infrastructure (Provider)` → `Application Router` → `Application Shell`
* **Who owns it?** The application shell owns the theme infrastructure. State management libraries are strictly bypassed because the theme is a UI infrastructure concern, not business domain data.

## 2. Theme Lifecycle
The complete sequence of theme resolution from startup to user interaction follows this deterministic path:
1. **Application Starts:** The environment begins initialization.
2. **Theme Resolution:** The system checks local persistence; if empty, it falls back to the OS-level preference.
3. **Theme Applied:** The resolved theme is injected into the root document object model before the first paint.
4. **User Changes Theme:** The user interacts with a theme toggle.
5. **Persist Preference:** The new choice is immediately written to local persistence.
6. **Next Session Restores Preference:** Subsequent application loads skip the OS fallback and apply the persisted preference.

## 3. Theme Persistence & Initialization (Preventing FOIT)
* **Initialization Timing:** To prevent a Flash of Incorrect Theme (FOIT) before the application framework hydrates, a synchronous, blocking script must execute before the application bundle loads.
* **Initialization Logic:**
  1. **Local Override Check:** The script checks local persistence for a saved preference.
  2. **System Fallback:** If empty, it queries the OS-level color scheme preference.
  3. **DOM Injection:** It immediately injects a data attribute (e.g., `data-theme="dark"`) onto the root node, ensuring the browser's first paint is accurate.

## 4. Token Consumption
* **The Component Contract:** Components never request concrete visual values (e.g., `color="red"` or `bg-orange-600`).
* **Semantic Intent:** Developers choose semantic intent rather than visual values. Components consume design tokens exposed through the styling layer.
* **Tool Agnosticism:** The underlying architecture assumes only that a styling layer resolves a semantic token into a rendered pixel. It is completely independent of specific CSS frameworks or libraries.

## 5. Theme Boundaries
* **What Theme Controls:**
  * Color palettes (Backgrounds, Surfaces, Text, Borders).
  * Elevation intensities (Shadow depth, border opacities).
* **What Theme NEVER Controls:**
  * Theme does not define typography hierarchy. Typography hierarchy belongs to the Design System.
  * Spacing and rhythm.
  * Border radius and component geometry.
  * Motion timings.
  * Layout decisions (e.g., compact vs. comfortable mode).
  * Business logic, component behavior, routing, or user permissions.

## 6. Theme Switching Execution
* **Mechanism:** When the toggle is clicked, the infrastructure updates the root data attribute and the local persistence store.
* **Scope of Change:** Only variables explicitly allowed by the Theme Boundaries (colors and elevation) will swap their values. No layout shifts or geometry changes are permitted during a theme switch.

## 7. Scalability (The "Festival Theme" Test)
* **Architecture Support:** The infrastructure inherently supports an infinite number of themes without rewriting any components.
* **Implementation:** Adding a new theme requires zero changes to application components. A new styling block is defined for the target theme attribute, and the styling layer resolves the existing semantic tokens against the new definitions.

## 8. Failure Cases & Fallbacks
* **Corrupted State:** If the local persistence store contains an invalid or unknown value, the initialization script must gracefully reject it and fall back to the OS System Theme.
* **Unknown Theme Selection:** If a theme attribute is applied but the corresponding styling block does not exist, the browser falls back to the root variables, defaulting to the baseline theme.
* **Missing Token:** If a specific theme accidentally omits a token definition, it inherits the baseline value from the root declaration.

## 9. Dependency Flow
The infrastructure strictly follows a one-way dependency flow to ensure separation of concerns and framework agnosticism:

```text
     User Preference
            │
            ▼
   Theme Infrastructure
            │
            ▼
     Theme Resolution
            │
            ▼
      Styling Layer
            │
            ▼
   Component Rendering