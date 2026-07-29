---
Status: Final
Version: 1.1
Last Updated: 2026-07-19
Owner: Himanshu Raj
Purpose: To define how business workflows map to application boundaries, ensuring users navigate the RDJ platform intuitively without hitting dead ends, losing work, or losing context.
---

# 04_Routing_and_Navigation.md

## 1. Business Journeys (The Navigation Map)
Routing is the technical translation of a user's business journey. The system divides these journeys into distinct domains:
* **The Discovery Zone (Public):** Catalog, Categories, Brands, Product Details, and Cabinet Configurator. This is where trust is built.
* **The Action Zone (Protected):** Cart/Draft Orders, Order History, Open Payments Ledger, Repairs & Diagnostics. This is where business is executed.
* **The Authentication Journey:** Authentication is a flow, not a destination. (Guest $\rightarrow$ Trigger Auth $\rightarrow$ Authenticate $\rightarrow$ Resume Intended Workflow).
* **The Communication Zone (Future):** Chat, Business Updates, and Consultations. This is where relationships are maintained.

## 2. Authorization Boundaries & Session Management
Navigation must strictly enforce business access rules without confusing or frustrating the user.
* **Public Access:** Any user can browse the Discovery Zone.
* **Protected Access:** Entering the Action Zone without authentication seamlessly redirects the user to the login flow, passing their intended destination as state to ensure they are returned exactly where they left off.
* **Role-Based Access (The Team):** Administrative workflows (e.g., approving a Trusted Customer) are strictly segregated. Customers must never see these routes or UI elements.
* **Session Expiration Contract:** If a session expires mid-action (e.g., while submitting a payment), the infrastructure must pause the workflow, enforce re-authentication, and seamlessly return the user to their exact previous state to preserve intent.

## 3. Structural Hierarchy (The Application Shell)
The navigation infrastructure is built on a persistent shell that surrounds the active business context.
* **The Global Header:** Contains the brand identity and the entry point to the user profile/auth. It remains fixed.
* **Mobile Primary Navigation (Bottom Nav):** The most critical business workflows (Home, Catalog, Orders, Payments) are anchored to a fixed bottom bar, requiring a maximum of one tap to switch contexts.
* **Desktop/Tablet Enhancement:** On larger screens, the bottom navigation transitions into a persistent side drawer or top navigation bar, maximizing horizontal screen space.

## 4. The "Never Get Lost" & Work Preservation Contract
The navigation system must continuously answer: *Where am I? Where can I go? How do I return?*
* **Breadcrumbs:** Deep hierarchical journeys must display breadcrumbs. The user must always see their exact depth and be able to jump back multiple levels instantly.
* **Predictable Back Stack:** The system's "Back" action must mirror the user's mental model, returning to the logical parent rather than repeating form submissions.
* **Contextual Overlays:** Secondary actions (like filters) use side drawers or bottom sheets rather than new URLs, preserving the primary context.
* **Work Preservation:** Navigation must never silently destroy user work. Attempting to navigate away from an unsaved form (like a complex repair request) must trigger an interception (confirmation dialog) or automatically save as a draft before route transition.

## 5. URL Design (Deep Linking)
URLs are a UI element. They must be human-readable and represent business entities, allowing customers and Ravi to share links effortlessly.
* **Business Identity over Database Identity:** URLs expose stable business identifiers rather than internal database implementation details (e.g., UUIDs or sequential IDs when possible).
* **Good:** `/catalog/amplifiers/ati-pro-1200`
* **Bad:** `/category/1?item=245`

## 6. Route Taxonomy
The routing infrastructure is composed of distinct route types, each with specific structural responsibilities:
* **Public Routes:** Accessible universally; highly cacheable.
* **Protected Routes:** Require active user session; block rendering until verified.
* **Administrative Routes:** Require elevated roles; excluded from standard client bundles if possible.
* **Modal/Overlay Routes:** Routes that render *over* the current context (e.g., `/orders/123/pay`) so the background state is not unmounted.
* **Error Routes:** Fallbacks for system failures or unauthorized access.
* **Future Communication Routes:** Reserved for distinct navigational physics (e.g., a Video Call route that persists as a Picture-in-Picture overlay while the user navigates the catalog).

## 7. Dead Ends & Failure Routing
The system must gracefully handle navigation failures to maintain trust.
* **The 404 (Not Found):** Outdated links route to a branded "Product Not Found" empty state that suggests browsing the active Catalog.
* **Obsolete Protected Routes:** If an authenticated user lands on an entity that no longer exists (e.g., a deleted order), the system prioritizes returning them to the nearest logical parent (e.g., Order History) rather than a dead-end 404.
* **Unauthorized Access:** Blocked attempts route to a secure dashboard with a clear, non-technical explanation.

## 8. Current Product Map (Active Topology)
This maps the currently implemented business contexts to physical routing zones.

**Discovery Zone (Public: `/`)**
*   `/catalog` - Public inventory browsing and product details.
*   `Overlay: Opportunity Drawer` - Customer intake for sales requests.

**Operations Zone (Protected: `/admin`)**
*   `/admin` - Workspace Hub (The central nervous system).
*   `/admin/catalog` - Catalog Management (Products, pricing, stock).
*   `/admin/opportunities` - Sales Pipeline (Lead dossiers and pre-sales communication).
*   `/admin/orders` - Operations Queue (Confirmed commercial agreements and fulfillment).
*   `/admin/repairs` - Repair Desk (Diagnostic and service workflows - *Pending Implementation*).