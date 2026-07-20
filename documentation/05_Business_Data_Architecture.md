---
Status: Final
Version: 1.1
Last Updated: 2026-07-19
Owner: Himanshu Raj
Purpose: To define how business data is classified, owned, transported, synchronized, and protected throughout the application lifecycle, independent of specific frameworks or libraries.
---

# 05_Business_Data_Architecture.md

## 1. Data Categories & Ownership
Business data must be strictly categorized to determine its source of truth and lifecycle rules.
* **Reference Data (Server-Owned):** Data that changes infrequently and is read-heavy (e.g., Catalog, Brands). The server is the absolute source of truth.
* **Transactional Data (Shared Ownership):** Data representing a business exchange (e.g., Orders, Payments, Repair Tickets). The client initiates mutations, but the server holds the final authoritative state.
* **Real-time Data (Server-Pushed):** High-velocity or time-sensitive data. Ownership belongs to the server, but the client must reflect updates instantly.
* **Session Data (Client-Owned, Security-Bound):** Identifying credentials for the user's current operating context (e.g., Auth Tokens). This data is strictly tied to the authentication lifecycle and is purged on logout.
* **Application Preferences (Client-Owned, Persistent):** User display choices (e.g., Theme, Language). This data survives the authentication lifecycle.
* **Temporary UI Data (Component-Owned):** Ephemeral state (e.g., expanded accordions). This data never leaves the component boundary and dies when the component unmounts.

## 2. Data Boundaries & Layer Isolation
To prevent entanglement, the application strictly enforces a unidirectional data dependency flow:

`Presentation Layer` $\rightarrow$ `Business Data Layer` $\rightarrow$ `Transport Layer` $\rightarrow$ `Remote Services`

**Architectural Rules:**
1. **No Direct Remote Access:** Presentation components must never communicate directly with remote services (no raw `fetch()` calls in the UI).
2. **Abstracted Consumption:** Components consume business data abstractions (e.g., `useOrder()`), ignorant of where the data originates.
3. **Dumb Transport:** Transport mechanisms execute requests and handle network protocols but contain zero business rules.
4. **Transport-Agnostic Business:** Business logic and data caching must not depend on the underlying transport implementation (REST, GraphQL, etc.).

## 3. Data Ownership Transfer
For transactional data, ownership shifts dynamically as the business process advances:
* **Draft Stage (Client Dominant):** The user is building an entity (e.g., adding to Cart, filling a Repair form). The client owns this data entirely.
* **Submitted Stage (Shared):** The client transmits the intent. Both systems acknowledge the data, but it is pending authoritative validation.
* **Confirmed Stage (Server Authoritative):** The server has processed the transaction. The client yields ownership and relies entirely on the server's synchronized response.

## 4. The Data Lifecycle
All server-owned and transactional data flows through a strict, predictable sequence:
1. **Fetch:** Data is requested from the remote source.
2. **Cache:** The response is stored locally to prevent redundant network requests and enable instant navigation.
3. **Validate Intent:** The infrastructure verifies business rules (e.g., "Cannot pay an already paid invoice") before attempting a remote mutation.
4. **Mutate:** The client issues the intent to change the data.
5. **Invalidate:** The local cache is explicitly marked as stale based on the mutation.
6. **Synchronize:** The system automatically re-fetches the invalidated data to restore consistency with the server.

## 5. Consistency Rules
The system enforces consistency based on the business impact of the data:
* **Immediate Consistency (Authoritative):** For financial transactions and order confirmations. The UI blocks and waits for a definitive server response before proceeding.
* **Optimistic Consistency:** For low-risk, high-frequency actions (e.g., sending a chat). The UI updates immediately assuming success, but seamlessly rolls back if the background request fails.
* **Eventual Consistency:** For reference data like Catalog lists. Background re-fetching ensures the UI is eventually correct without blocking the user.

## 6. Transport Layer Infrastructure
The architecture supports multiple data transport mechanisms based on capability, abstracted away from the UI:
* **Request / Response:** Discrete business operations and standard fetching/mutation.
* **Persistent Connection:** Continuous message exchange and event-driven updates.
* **Streaming:** Continuous media delivery.

## 7. Cross-Cutting Infrastructure
The data layer centrally handles infrastructure concerns before data reaches the UI layer:
* **Authentication Injection:** Every outbound request to a protected domain automatically includes the current session credentials.
* **Timeouts & Cancellation:** Every request has a maximum time-to-live. Navigating away from a page cancels pending requests tied to that context to prevent memory leaks.
* **Retry Logic:** Idempotent requests automatically retry on transient network failures before reporting an error.
* **Infrastructure Logging:** All mutations and critical network failures are logged at the transport layer for debugging.

## 8. Failure & Recovery Strategy
The data architecture protects business integrity when systems fail:
* **Network Loss:** Offline clients retain access to read-only caches. Optimistic mutations are queued locally and executed when the connection is restored.
* **Conflict Resolution:** If a client mutates an authoritative record that has changed on the server, the server rejects the request. The client must refresh its local cache to show the current authoritative state.
* **Expired Session Interception:** A 401/Unauthorized response freezes all pending data mutations, triggers the authentication routing flow, and gracefully suspends or discards the failed requests.
* **Partial Success:** If a multi-step transaction fails midway, the infrastructure must not leave the UI in a corrupted state, guiding the user to resume or rollback safely.