---
Status: Final
Version: 1.0
Owner: Himanshu Raj
Purpose: To lock in the implementation tooling that fulfills the architectural contracts.
---
# 06_Technology_Decisions.md

| Architectural Need | Selected Technology | Engineering Reason |
| :--- | :--- | :--- |
| **Core Framework** | React (Latest) + TypeScript | Component architecture with strict static typing to eliminate runtime UI bugs. |
| **Build Tooling** | Vite | Instant HMR and optimized production builds. |
| **Styling Layer** | Tailwind CSS v4+ | Utility-first CSS resolving semantic tokens without leaving the component file. |
| **Global Infrastructure State** | Redux Toolkit (RTK) | Predictable, debuggable state management strictly for cross-cutting concerns (Auth, Session). |
| **Data Fetching/Caching** | RTK Query | Tightly integrated with Redux; handles the caching, invalidation, and deduplication lifecycles defined in Doc 05. |
| **Routing Infrastructure** | React Router (v6+) | Standardized nested routing, loaders, and layout hierarchies. |
| **Icons** | Lucide React | Consistent stroke widths and industrial aesthetic required by the Design System. |