---
Status: Final
Version: 1.0
Owner: Himanshu Raj
Purpose: To define the implementation philosophy and specific React/UI rules that emerged during Phase 2B. This governs how we actually write the code defined by the architecture.
---

# 09_Frontend_Implementation_Guide.md

## 1. The Component Ownership Rule
Business logic and feature-specific context must never leak into generic UI components.
*   **Primitives (`common/components/ui/`):** Dumb components. They only know about the Design System (Tailwind, spacing, interaction). Example: A `Badge` knows its color, but does not know what a `ProductStatus` is.
*   **Assemblies (`features/[module]/components/`):** Smart presentation components. They compose primitives and apply business rules. Example: `ProductCard` decides which `Badge` color to use based on the product's status.

## 2. Primitive vs. Assembly UI Evolution
Do not build a massive Design System of unused primitives upfront. 
Build vertically:
1. Build a complete feature (e.g., Catalog List).
2. Create only the primitives required for that feature.
3. Combine them using Compound Components (e.g., `<Card><CardContent/></Card>`) to eliminate "Tailwind soup" in the feature files.

## 3. The Page Ownership Rule
A Page component (`features/[module]/pages/`) is a traffic controller. It may only do five things:
1. Read URL parameters.
2. Invoke feature Hooks (Layer 4).
3. Implement the UI State Machine (choose what to render).
4. Compose feature components (Assemblies).
5. Handle navigation intents.
*Pages must contain zero business logic or complex styling.*

## 4. The UI State Machine
Pages do not use deeply nested ternaries for loading/error states. They use flat, early returns based on mutually exclusive states:
1. `if (isLoading) return <LoadingState />`
2. `if (isError) return <ErrorState />`
3. `if (isEmpty) return <EmptyState />`
4. `return <SuccessState />`

## 5. The Feature Hook Consistency Rule
Hooks inside `features/[module]/hooks/` orchestrate user intent. They must not contain business math, data mapping, or validation logic. A hook answers only four questions:
1. What data do I need?
2. What form/state do I manage?
3. What happens on submit?
4. What should the UI know? (e.g., `isEditMode`, `isSaving`)

## 6. The Feature Acceptance Rule (Avoiding the "Amazon Trap")
Before adding a premium feature, it must pass this test:
1. Does Ravi actually do this today in his consultative sales workflow?
2. Does it reduce taps, increase trust, or increase sales?
3. Can Ravi explain it to a customer in one sentence?
4. Will Ravi use it every week?
*We are building a digital workshop for heavy-duty audio, not a flash-sale e-commerce site.*

## 7. The 🔴 / 🟡 / 🔵 Review System
To maintain engineering velocity without sacrificing quality:
*   🔴 **Blocker:** Must fix before moving on (architecture, business correctness, security).
*   🟡 **Recommended:** Worth fixing immediately as it clearly improves the product/code.
*   🔵 **Future Enhancement:** Mentally logged for later; do not stop progress for it.