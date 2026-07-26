---
Status: Final
Version: 2.0
Owner: Himanshu Raj
Purpose: To define the engineering culture, coding standards, architectural principles, review process, and quality expectations for the RDJ Business Platform.
---

# 00_Engineering_Standards.md

# Engineering Philosophy

Every technical decision must improve at least one of the following:

- Business clarity
- User experience
- Maintainability
- Scalability
- Reliability

If it improves none of them, it should not be added.

The RDJ platform is not merely a software application—it is a Business Operating System. Engineering decisions must always serve Ravi's business before serving technology.

---

# 1. Architectural Convention

- Domain-Driven Structure: All business logic belongs inside `src/features/[domain]/`.
- Business First: Folder structure represents business domains, not technical patterns.
- No Premature Abstraction: Components remain inside their feature until genuinely reused.
- Strict Colocation: Every feature owns its components, hooks, validation, models, and API integrations.
- Cross-cutting concerns belong only inside infrastructure (`app/`, `common/`, `store/`).

---

# 2. Naming Conventions

- React Components → PascalCase (`ProductCard.tsx`)
- Hooks & Functions → camelCase (`useCatalog.ts`)
- Types & Interfaces → PascalCase (`Product.ts`)
- Redux Slices → camelCase (`catalogSlice.ts`)
- Files/Folders → kebab-case unless representing React Components or Types

---

# 3. Component Rules

- One component per file.
- Components are presentation-first.
- Business logic must not live inside UI components.
- Explicit Props interface.
- Never use `any`.
- Semantic Tailwind tokens only.

---

# 4. State Management Rules

Use Local State for:

- Temporary UI state
- Forms before submission
- Dialog visibility

Use Redux for:

- Authentication
- Shared application state
- Cross-feature state
- Server cache ownership via RTK Query

---

# 5. Git Convention

- feat:
- fix:
- ui:
- refactor:
- chore:

Follow Conventional Commits.

---

# 6. Formatting & Linting

- Prettier
- ESLint
- 2-space indentation
- 100-character maximum line length
- Consistent import ordering

---

# 7. Error Handling (Ravi's Workshop Principle)

Users must never receive technical errors.

Every error shown to users must answer:

1. What happened?
2. Why?
3. What should they do next?

Unexpected failures should always be logged.

---

# 8. Documentation

Every major feature should document:

- Business Goal
- User Flow
- Engineering Notes
- Known Constraints

---

# 9. Accessibility

- Minimum 48×48 touch targets
- Keyboard accessibility
- Semantic HTML
- Visible focus states
- High contrast
- Light & Dark theme compatibility

---

# 10. Performance Philosophy

- Measure before optimizing.
- Readability over micro-optimization.
- Follow the 80% readability rule.
- Never sacrifice maintainability for insignificant performance gains.

---

# 11. The Six-Gate Feature Review

Every feature must pass all six gates.

## Gate 1 — Business

Why does Ravi need this?

## Gate 2 — Architecture

Does it respect architectural ownership?

## Gate 3 — Engineering

Can it evolve safely?

## Gate 4 — User Experience

Will users understand it immediately?

## Gate 5 — Future

If Ravi's business doubles, will this still work?

## Gate 6 — Operations

Can engineers monitor, diagnose and support it?

---

# 12. Architectural Freeze Rule

Approved slices are frozen.

Refactor ONLY if:

- Business requirements change
- Security demands it
- Performance/scalability demands it

Never refactor because of a prettier idea.

---

# 13. Emotional UI Standard

The application must feel like an industrial-grade business product.

Never like a college project.

Every UI review must verify:

- Visual hierarchy
- Typography
- Spacing
- Alignment
- Loading state
- Empty state
- Error state
- Success state
- Responsive behavior
- Accessibility

---

# 14. Backend Tomorrow Test

Before approving any frontend contract, ask:

> If I implemented the backend tomorrow, would this still make sense?

If not,

the frontend contract is wrong.

---

# 15. Product-First Principle

Architecture exists to serve the product.

Technology decisions are never made because they are fashionable.

Every implementation must ultimately improve Ravi's business operations.