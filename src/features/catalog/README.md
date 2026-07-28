# Product Catalog Module

## Purpose
Manage the core inventory of audio equipment, pricing, and technical specifications for Ravi's daily workflow, while serving as the underlying domain for the future public storefront.

## Public API (Module Firewall)
- `AdminCatalogListPage`
- `AdminProductDetailsPage`
- `AdminCreateProductPage`
- `AdminEditProductPage`
- Domain Types (`Product`, `ProductStatus`, etc.)

## Internal Layers
- `api/`: RTK Query endpoints, DTO definitions, and data mappers (Anti-Corruption Layer).
- `hooks/`: Thin orchestration layer bridging API and Pages.
- `validation/`: Zod schemas enforcing business rules.
- `admin/`: Operational presentation layer (Pages & Assemblies) protected by Authorization.
- `public/`: (Future) Customer-facing presentation layer.

## Routes
- `/admin/catalog` (Operational Workspace)
- `/catalog` (Public Storefront)

## Business Invariants
- **Status Enforcement:** `ACTIVE` products require at least one valid image URL.
- **Selling Price:** Cannot exceed the MRP.
- **Visibility:** Public visibility is determined server-side; customer UX must never expose lifecycle internal data.