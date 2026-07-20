---
Status: Final
Version: 1.0
Owner: Himanshu Raj
Purpose: To define the standard internal architecture that every business capability must follow throughout the RDJ Business Platform.
---

# 08_Business_Module_Blueprint.md

## Engineering Philosophy

Every business capability (Catalog, Orders, Repairs, Payments, CRM, etc.) must follow one identical internal architecture.

The purpose of this blueprint is to ensure:

- Consistency across all business modules
- Strong encapsulation
- Maintainability
- Predictable development
- Scalability
- Independent feature evolution

The Product Catalog serves as the **Reference Implementation**. Every future module must follow this blueprint unless a documented architectural decision explicitly states otherwise.

---

# Standard Module Structure

```
src/features/[module]/

│── README.md
│── index.ts
│
├── api/
│   ├── [module].api.ts
│   ├── [module].dto.ts
│   └── [module].mapper.ts
│
├── domain/
│   └── [module].types.ts
│
├── validation/
│   └── [module].schema.ts
│
├── hooks/
│
├── components/
│
├── pages/
│
├── constants/        (Optional)
│
├── utils/            (Optional)
│
└── tests/            (Future)
```

---

# Module Responsibilities

## README.md

Every feature must contain its own documentation.

Minimum contents:

- Business Goal
- User Flow
- Responsibilities
- Public API
- Dependencies
- Known Constraints

---

## api/

Implements the Anti-Corruption Layer.

Responsibilities:

- Inject RTK Query endpoints
- Define Backend DTOs
- Map DTOs into Frontend Domain Models

Contains:

- `[module].api.ts`
- `[module].dto.ts`
- `[module].mapper.ts`

The UI must never consume DTOs directly.

---

## domain/

Defines the business language used throughout the frontend.

Contains:

- Business entities
- Business types
- Pure domain representations

The remainder of the application only consumes these types.

---

## validation/

Defines the shared business validation specification.

Examples:

- Zod schemas
- Regular expressions
- Length constraints
- Business rules

Validation rules must never be duplicated inside UI components.

---

## hooks/

Encapsulates business orchestration.

Responsibilities include:

- Calling RTK Query hooks
- Managing UI state
- Combining business logic
- Preparing data for presentation

Hooks act as the bridge between infrastructure and presentation.

---

## components/

Contains private presentation components.

Rules:

- Presentation only
- No business logic
- No direct API interaction
- Reusable only within the module

Components promoted to multiple modules must move into:

```
src/common/components/
```

---

## pages/

Contains routable views.

Responsibilities:

- Read route parameters
- Invoke module hooks
- Compose presentation components

Pages should contain minimal business logic.

---

## constants/ (Optional)

Reserved for feature-specific constants.

Examples:

- DEFAULT_PAGE_SIZE
- FILTER_OPTIONS
- MAX_SELECTION

Avoid magic values throughout the feature.

---

## utils/ (Optional)

Contains feature-specific pure helper functions.

Examples:

- calculateDiscount()
- groupVariants()
- formatVariantName()

Helpers shared by multiple modules should be promoted to common utilities.

---

## tests/ (Future)

Reserved for future:

- Unit Tests
- Integration Tests
- Component Tests

---

## index.ts

### The Module Firewall

This file is the only public entry point of the module.

Only explicitly exported members may be consumed by the rest of the application.

Typical exports include:

- Pages
- Domain Types
- Public Hooks (when appropriate)

Everything else remains private implementation.

---

# Module Rules

## Rule 1 — Module Firewall

External modules must never import directly from:

- api/
- hooks/
- components/
- validation/
- utils/
- constants/

Imports must always go through:

```
features/[module]
```

---

## Rule 2 — Feature Independence

Every module must answer:

> Could another engineering team build and maintain this module using only its public API and documentation?

If not,

the module is too tightly coupled.

---

## Rule 3 — No Backend Leakage

Presentation code must consume only Domain Models.

Backend DTOs must never cross the Mapper boundary.

Required flow:

```
Backend DTO
        ↓
Mapper
        ↓
Domain Model
        ↓
Hook
        ↓
Component
        ↓
Page
```

---

## Rule 4 — Presentation Isolation

Pages and Components must not:

- Perform raw API calls
- Contain complex business logic
- Duplicate validation rules

Business orchestration belongs inside Hooks.

---

## Rule 5 — Validation Centralization

Validation must originate exclusively from:

```
validation/
```

No inline validation logic may be duplicated inside forms or components.

---

# Reference Module Rule

The Product Catalog is the Reference Implementation.

Every future business capability must mirror its architecture unless an approved Architectural Decision explicitly states otherwise.

This ensures:

- Consistent engineering practices
- Faster feature development
- Easier onboarding
- Predictable maintenance

---

# Success Criteria

A business module is considered architecturally complete only when:

- ✅ Module Firewall enforced
- ✅ Feature Independence achieved
- ✅ DTOs isolated behind Mappers
- ✅ Domain Models exposed to UI
- ✅ Validation centralized
- ✅ Business orchestration isolated in Hooks
- ✅ Presentation components remain pure
- ✅ Feature documentation completed