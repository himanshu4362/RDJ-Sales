---
Status: Accepted
Version: 1.1
Owner: Himanshu Raj
Purpose: To define the structural, routing, and data boundaries between the Customer (Public) experience and the RDJ Team (Administrative) operational workspace.
---

# 10_Admin_Public_Experience_Boundary.md

## 1. Context & Business Reality
The RDJ Business Platform serves two fundamentally different audiences interacting with the same underlying business domains (e.g., Product Catalog):
*   **The Customer Experience:** Requires high-trust, mobile-optimized, visually driven discovery. Customers must only see publicly validated data (e.g., `ACTIVE` products, display pricing).
*   **The Administrative Workspace:** Requires dense, fast, tablet/desktop-optimized operational control. The RDJ team must see the entire data lifecycle (e.g., `DRAFT`, `DISCONTINUED`, inventory counts, and internal metadata).

Mixing these concerns within single components or endpoints creates severe risks of data leakage and UX degradation.

## 2. Architectural Decisions

### Rule 1: Strict Route Taxonomy
*   **Administrative Zone:** All operational workflows must reside under the `/admin/*` path hierarchy. This zone is strictly protected by the `AuthorizationBoundary`.
*   **Public Zone:** Customer-facing workflows reside at the root hierarchy (e.g., `/`, `/catalog`, `/catalog/:slug`). These routes are publicly accessible unless a specific public workflow explicitly requires authentication. Public read models should be designed to support safe caching where appropriate.

### Rule 2: Structural Workflow Separation
Shared business domains do not imply shared UI. Inside any feature module (e.g., `src/features/catalog`), the presentation layer must be physically separated by audience:
*   `features/[module]/admin/pages/`
*   `features/[module]/admin/components/`
*   `features/[module]/public/pages/`
*   `features/[module]/public/components/`

### Rule 3: Component Promotion
UI Components must not be placed in a shared `features/[module]/components/` directory preemptively. A component remains isolated within `admin` or `public` until cross-audience reuse is explicitly demonstrated.

### Rule 4: Data Projection & API Semantics
The backend integration must respect audience context. 
*   Public API endpoints (e.g., `GET /products`) must only return safe, projected data (omitting margins, internal status metadata, and audit information). 
*   The frontend must never rely on CSS or client-side JavaScript to hide sensitive operational data from public payloads.

### Rule 5: Domain Reusability & Contract Isolation
Domain concepts and genuinely audience-independent business types may remain centralized within the module. Transport DTOs, mappers, query contracts, and validation schemas must be audience-specific whenever their data exposure, permissions, or use cases differ. Sharing is permitted only when semantics are genuinely identical.

### Rule 6: Server-Side Authorization Is Authoritative
Frontend `AuthorizationBoundary` exists for navigation and UX protection only. Every administrative backend endpoint must independently authenticate the caller and authorize the required role/permission. No administrative capability may rely on route hiding or frontend state for security.

### Rule 7: Public Visibility is Server-Determined
Public product visibility is determined server-side. Public Catalog APIs must never accept client input capable of expanding visibility into administrative lifecycle states (e.g., forcing `status=ACTIVE` internally rather than trusting a `status` query parameter supplied by the browser).