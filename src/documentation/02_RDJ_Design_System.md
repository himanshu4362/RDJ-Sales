---
Status: Final
Version: 1.1
Last Updated: 2026-07-19
Owner: Himanshu Raj
Purpose: To define the brand identity, visual language, and interaction principles that make the software feel like RDJ's own product.
---

# RDJ Design System v1.1

## 1. Brand Identity
* **Business Reason:** RDJ provides heavy-duty sound equipment to hard-working professionals. The software must feel like a dependable control panel, not a social media app.
* **Engineering Decision:** The UI will be Industrial, Reliable, Powerful, Professional, Straightforward, and Trustworthy. The software remains calm so the hardware can be loud.
* **Implementation Guidance:** Avoid playful interactions, soft UI styling, and excessive animations. Favor stark contrasts and solid structural elements.

## 2. Color System
* **Business Reason:** Users often operate outdoors in harsh lighting. Brand identity relies heavily on "Industrial Orange" for energy and action.
* **Engineering Decision:** Colors are defined purely by semantic purpose and automatically flip for Light/Dark modes. The semantic tokens are defined strictly as:
  * `Brand Primary` | `Brand Secondary`
  * `Surface Primary` | `Surface Secondary` | `Surface Elevated`
  * `Border`
  * `Text Primary` | `Text Secondary` | `Muted`
  * `Success` | `Warning` | `Danger` | `Info`
  * `Disabled` | `Overlay`
* **Implementation Guidance:** Create a tokenized palette. Never use raw color names (like `orange-600`) in component markup; strictly use the semantic aliases.

## 3. Typography & Hierarchy
* **Business Reason:** Non-technical users need immediate legibility. Reading specs on a mobile device requires extreme clarity.
* **Engineering Decision:** Strict two-font maximum. One condensed, industrial font for headings, and one highly readable sans-serif for UI data and forms. The typographic hierarchy is strictly defined as:
  * `Display` | `H1` | `H2` | `H3`
  * `Body Large` | `Body`
  * `Caption` | `Label`
* **Implementation Guidance:** Lock typography settings in the global configuration. Never invent new hierarchy sizes within individual components.

## 4. Spatial System (Spacing, Radius, Elevation)
* **Business Reason:** Inconsistent geometry makes an app feel fragile. Users need dependable, large tap areas.
* **Engineering Decision:** All layout spacing locks to a strict mathematical grid. The allowed spacing rhythm is: `4`, `8`, `12`, `16`, `24`, `32`, `48`, `64`. Elements use a medium border radius to feel manufactured, not rounded.
* **Implementation Guidance:** Restrict the spacing scale configuration to the allowed rhythm. Enforce standard padding for all cards and containers based on these integers.

## 5. Motion & Iconography
* **Business Reason:** Icons must be universally understood. Motion must communicate state, never decorate the interface.
* **Engineering Decision:** A single icon library (Lucide) will be used exclusively. Transitions are short (100–150ms).
* **Implementation Guidance:** Standardize icon stroke width. Disable bouncy or decorative animations globally.

## 6. Navigation Principles
* **Business Reason:** A customer who is lost in the app will not place an order.
* **Engineering Decision:** Navigation must always answer three fundamental questions for the user:
  1. *Where am I?*
  2. *Where can I go?*
  3. *How do I return?*
* **Implementation Guidance:** Do not dictate specific UI components (like bottom tabs or breadcrumbs) here; those belong in the Routing Architecture. Ensure the user's current context and primary exit routes are always visible without relying on hidden menus.

## 7. Accessibility & Screen States
* **Business Reason:** Trust is built by guiding the user through every phase of data fetching and user input.
* **Engineering Decision:** Every screen must account for the four core lifecycle states: `Loading` $\rightarrow$ `Empty` $\rightarrow$ `Error` $\rightarrow$ `Success`. Minimum touch targets must be strictly enforced.
* **Implementation Guidance:** Standardize reusable layouts for these four states. Ensure all interactive buttons maintain a minimum 48x48px hit area with high contrast in both themes.

## 8. Responsive Principles
* **Business Reason:** Ravi uses a tablet; his customers use mobile phones.
* **Engineering Decision:** The application is mobile-first but strictly optimized for tablet/landscape orientations. Desktop layouts extend the tablet experience rather than becoming a separate product.
* **Implementation Guidance:** Utilize flexible grids and avoid hardcoded pixel widths. Ensure the application shell adapts seamlessly across breakpoints.

## 9. Component Philosophy
* **Business Reason:** Future developers must understand the 'why' before building a new UI element to maintain the RDJ brand identity.
* **Engineering Decision:** Components should prioritize being:
  * Predictable
  * Consistent
  * Accessible
  * Business-oriented
  * Responsive
  * Simple to understand
* **Implementation Guidance:** Prioritize these traits over clever abstractions. Reuse components only after duplication is proven, not preemptively.