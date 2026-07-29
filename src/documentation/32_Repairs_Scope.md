---
Status: Draft (Pending Freeze)
Owner: Himanshu Raj
Purpose: To define the business rules, lifecycle, and scope for the Repairs & Diagnostics vertical.
---

# 32_Repairs_Scope.md

## 1. Vertical Name
Repair Management (Diagnostic & Service Context)

## 2. Business Problem
Customers trust Rana Sales for post-sale support and general equipment maintenance[cite: 1]. The business needs to track customer issues from intake through diagnosis, estimate approval, repair execution, and final collection without losing track of physical hardware in the workshop.

## 3. Core Architectural Definition
**A Repair strictly represents a diagnostic and service workflow for a piece of Equipment.**
*   It is completely independent of Orders. Walk-in external repairs are fully supported.
*   It focuses on the "Equipment" (Type, Brand, Model), not specifically an "Amplifier".
*   It represents two distinct sequential commitments: 1. Diagnosis, 2. Authorized Service.

## 4. The Business Lifecycle
`RECEIVED` (Intake complete) 
  → `UNDER_DIAGNOSIS` (Workshop inspecting) 
  → `WAITING_FOR_APPROVAL` (Estimate provided to customer) 
  → `APPROVED` (Customer accepted cost) OR `DECLINED_BY_CUSTOMER` (Customer rejected cost)
  → `REPAIR_IN_PROGRESS` (Workshop fixing)
  → `READY_FOR_PICKUP` (Service complete)
  → `COMPLETED` (Handed back to customer)

## 5. Version 1 Scope
*   **Creation:** Manual intake by Admin at the Repair Desk.
*   **Data Payload:**
    *   **Customer Context:** Name, Phone (Optional: Dealer/Company reference).
    *   **Equipment Context:** Type (e.g., Amplifier, Mixer), Brand, Model, Serial Number (Optional).
    *   **Issue Context:** Customer's reported problem.
    *   **Diagnostic Context:** Workshop notes, estimated cost, actual cost.
*   **Workspace:** Operations Queue (prioritizing items needing diagnosis/repair) and a Repair Desk workspace.

## 6. Business Assumptions Ledger
| Assumption | Status | Impact / Reasoning |
| :--- | :--- | :--- |
| Repairs can exist without Orders | **Strong Inference** | Workshop accepts external walk-ins. Decoupling prevents architectural lock-in. |
| Admin is the only user in V1 | **Strong Inference** | No complex role management yet. Ravi acts as the single proxy for the workshop. |
| Diagnostic precedes Repair | **Strong Inference** | Customers must approve estimates before work begins. Fixes cannot be assumed at intake. |
| Ownership vs. Customer | **Temporary Assumption** | V1 treats the person dropping it off as the "Customer". Dealer/Fleet ownership hierarchies deferred to V2 CRM. |