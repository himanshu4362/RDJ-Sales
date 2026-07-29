---
Status: Frozen (V1 Scope - Blockers Resolved)
Owner: Himanshu Raj
Purpose: To define the lifecycle, data classification, event origins, and ledger projections for Commercial Order Management.
---

# 40_Commercial_Order_Management.md

## 1. Business Triggers & Event Origins
All origins (Opportunity, Direct Call, Walk-in) converge onto a single business event: **Commercial Agreement Reached**. This event generates the Commercial Order.

## 2. Data Classification (The Triad)
*   **Immutable (The Snapshot):** Customer details, equipment specifications, negotiated unit prices, and quantities at the exact moment of agreement.
*   **Mutable (The Workflow State):** Internal workshop notes, active production step, and logistics progress.
*   **Derived (The Projections):** Order Total, Outstanding Balance, Payment Completion %, and Production Progress %. These are never stored as static facts; they are computed dynamically from the ledger and workflow events.

## 3. The Proposal vs. Agreement Lifecycle
> Proposal Generated → Revision Requested → Proposal Updated → Accepted (Agreement Reached) → Commercial Order Generated

## 4. The Financial Ledger (V1 Scope)
Financial state is derived entirely from an append-only ledger of business events.
*   **V1 Event Types:** Advance Received, Balance Received.
*   *(Future Event Types: Refund, Forfeit, Adjustment, Credit Note).*

## 5. Production Steps (Workflow)
Orders are assigned a dynamic array of Production Steps rather than rigid tracks.
*   **Example (Off-the-Shelf):** Inventory Reserved → QC → Ready.
*   **Example (Cabinet Build):** Material Sourcing → Carpentry → Painting → Assembly → QC → Ready.

## 6. The Customer Activity Timeline
The customer experiences a unified, chronological projection of their intent, shielding them from internal database aggregates:

> Request Received → Reviewing Requirements → Commercial Proposal Ready → Awaiting Advance → In Production → Ready for Delivery → Completed