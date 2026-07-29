---
Status: Frozen (V1)
Owner: Himanshu Raj
Purpose: To define the business rules, data requirements, and customer journey for the Sales Opportunity vertical.
---

# 30_Sales_Opportunity_Scope.md

## 1. Vertical Name
Sales Opportunity Management (Customer Opportunity Pipeline)

## 2. Business Problem
High-intent customers currently discover products but have no structured way to request a quote or check availability. Leads get lost in WhatsApp, and Ravi's team wastes time gathering basic context (which product, where is the customer located) before they can begin selling.

## 3. Desired Digital Workflow
Customer views product → Triggers Request → Fills minimal context form → Request drops into Rana Sales Workspace → Admin views structured request and updates pipeline status.

## 4. The Customer Journey
`Browsing Products` → `Interested` → `Starts Request` → `Provides Minimal Info` → `Confirmation/Success State` → `Rana Sales Contacts Customer`

## 5. Version 1 Scope
* **Implementation Note:** V1 goal is to capture and organize sales opportunities—not to automate the sales process.
* **Customer Input:** Name, Phone Number, City/District, Quantity (Optional), Message (Optional).
* **Auto-Captured Context:** `ProductID`, `ProductName`, `ProductSlug`.
* **Admin Workspace:** A simple, well-designed table/list view. 
* **Pipeline Statuses:** `NEW` → `IN_PROGRESS` → `COMPLETED` | `CANCELLED`.

## 6. Business Lifecycle Policy
The status of a Sales Opportunity is a strict business policy, not just a UI string. The intended lifecycle is:
*   `NEW`: Uncontacted lead.
*   `IN_PROGRESS`: Communication established.
*   `COMPLETED`: **Deal Won / Commercial Agreement Reached.** This indicates the sales phase is over and an Order has been generated. It does NOT indicate physical delivery of goods.
*   `CANCELLED`: Lead lost or invalid.

## 7. Client Validation (Next Sync)
* Ask Ravi: *"When a customer contacts you about a product, what information do you wish they had already given you?"* (Adjust form fields based on this answer later if needed).

## 8. Business Assumptions (Pricing)
* **Visibility Toggle:** The current V1 assumes public display of `sellingPrice`. In consultative B2B sales, pricing is often hidden or negotiated. 
* **Future Proofing:** If Rana Sales requests "Call for Price", this will be implemented as a server-side business configuration (e.g., `product.hidePricing = true`), NOT a UI code rewrite. The Opportunity Form must gracefully handle products passed to it without a price.

## 9. Future Roadmap & Enhancements (V2+)
*   **Status Update Feedback:** V1 updates status instantly. V2 must implement visual feedback (a toast notification or inline spinner) so the user explicitly knows if the network request succeeded or failed.