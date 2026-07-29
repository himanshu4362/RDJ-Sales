---
Status: Frozen (V1 Scope - Blockers Resolved)
Owner: Himanshu Raj
Purpose: To define the absolute business boundaries, decoupled Identity vs Profile architecture, session restoration rules, and dynamic role-aware UI for Batch 02.
---

# 35_Account_and_Authentication_Scope.md

## 1. Decoupled Architecture (Identity vs. Profile)
*   **Identity Aggregate:** Manages core authentication credentials (`phone`, `password`, `role`, `session`).
*   **Profile Aggregate:** Manages operational context (`displayName`, `cityDistrict`, `isVerifiedByRavi`).
*   **Registration Scope (V1):** Limited strictly to Name, Phone, Password, and City/District. Community fields (usernames, avatars) are deferred.

## 2. Session Restoration Contract
The application must never drop a user's session on a browser refresh. The auth infrastructure must attempt silent session restoration from local persistence on initial app load.

## 3. Out of Scope (V1)
*   Social / Community / Public Usernames
*   Reviews & Posts
*   Two-Factor Authentication (2FA) / Google Login
*   Administrative Account Provisioning (Admin accounts are pre-provisioned in V1)

## 4. Rule #13: Business Context Preservation
Authentication is an interruption, not a destination. 
*   The `AuthorizationBoundary` must capture the exact intended destination (`location.pathname` + `search` + `hash`).
*   Upon successful authentication (Sign In or Registration), the Account Workspace MUST prioritize routing the user back to their intended destination over default role-based dashboards.

## 5. Session Restoration Contract
The application attempts silent session restoration using the configured session persistence mechanism.
*   **Found & Valid:** Hydrate Redux state, continue workflow.
*   **Expired:** Clear local persistence, demote user to Guest.
*   **Invalid:** Clear local persistence, require manual login.

## 6. The Identity Lifecycle & Claim Architecture
*   **Creation via Admin:** An Identity can be created without a Member Session if Ravi manually enters a lead (e.g., Sales Opportunity).
*   **Claiming via Registration:** If a customer registers with a phone number already existing as an admin-created lead, the system **claims and upgrades** that Identity to a full Member, preventing duplicate records.
*   **Lifecycle:** `Guest` → `Identity Created/Claimed` → `Authenticated` → `Member Session Issued` → `Logout` → `Session Ends` → `Identity Persists`.

## 7. Session Restoration State Machine (Anti-Flicker)
To prevent unauthorized UI flashing on browser refresh, the application strictly adheres to this state machine:
*   `Initializing` (Blocks UI rendering, displays branded loader)
*   `Evaluating Persistence` (Validating tokens)
*   `Resolved` (State hydrated, UI unblocked)