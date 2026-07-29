---
Status: Draft (Pending Freeze)
Owner: Himanshu Raj
Purpose: To define the business rules, data requirements, and architectural boundaries for the Orders vertical.
---

# 31_Orders_Scope.md

## 1. Vertical Name
Order Management (Commercial Agreement Context)

## 2. Business Problem
After a Sales Opportunity is successfully negotiated, Ravi needs a formal record of the commercial agreement (what the customer is buying, at what price, and the delivery status) that acts as the single source of truth for the business, independent of how it is built or paid for.

## 3. Core Architectural Definition
**An Order strictly represents the commercial agreement between Rana Sales and the customer.** 
It is explicitly decoupled from:
*   **Billing:** How or when the customer pays (Advance, Credit, Full).
*   **Fulfillment/Workshop:** How the product is acquired or manufactured.
*   **Inventory:** The physical stock count.

## 4. The Order Lifecycle (V1)
`CONFIRMED` (Agreement made) → `READY` (The goods have been physically prepared and are available to hand over to the customer) → `DELIVERED` (Customer possesses the goods) | `CANCELLED`

## 5. Version 1 Scope
* **Creation Snapshot Rule:** Order creation explicitly copies the required business snapshot (customer details, product details, agreed prices) from the originating Opportunity. An Order never queries the Opportunity or Product catalog for live data after creation. This guarantees the Order remains a historically accurate commercial agreement even if catalog prices change or the Opportunity is modified.

## 6. Architectural Constraints (Out of V1)
* **NO Payment Gateways or Tracking:** Payment ledgers belong in a future Billing vertical.
* **NO Inventory Deduction:** Stock management remains manual in V1.
* **NO Workshop Routing:** Custom manufacturing tickets belong in a future Workshop/Repairs vertical.
* **NO GST Invoicing:** PDF generation and tax logic are excluded.

## 7. Explicit Business Assumptions
* **Assumption 1 (Trigger):** In Version 1, an Order represents a confirmed commercial agreement. Payment processing, procurement, and inventory reservations are intentionally modeled as separate future business capabilities. 
* **Assumption 2 (Creation):** Customers cannot create Orders directly (No e-commerce checkout). Only the Admin can instantiate an Order.

## 8. Relationship to Sales Opportunity
* A Sales Opportunity represents a *potential* commercial agreement.
* An Order represents a *confirmed* commercial agreement.
* A Sales Opportunity may be associated with exactly one *active* Order. 
* Cancelled Orders do not prevent a new Order from being created from the same Opportunity if the commercial discussion resumes. 
* Once an Order is created, it becomes a distinct aggregate; it does not transform the Opportunity, it only references it.