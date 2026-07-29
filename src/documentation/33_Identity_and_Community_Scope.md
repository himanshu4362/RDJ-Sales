---
Status: Frozen (Design Only)
Owner: Himanshu Raj
Purpose: To define the "Member" abstraction which serves as the foundational Identity for the entire RDJ Platform, enabling future social, community, and reputational features.
---

# 33_Identity_and_Community_Scope.md

## 1. The Core Abstraction: The Member
The platform does not have "Customers". It has **Members**. 
A Member is a first-class citizen of the RDJ ecosystem. A Member can be a DJ Operator, a Cabinet Builder, an Event Organizer, or an Audio Enthusiast. 

## 2. Identity Properties (The Domain Model)
Every authenticated user is represented by this core identity:
*   `memberId`: Unique system identifier.
*   `username`: Unique, human-readable handle (e.g., `@dj_ankit`).
*   `displayName`: The public name.
*   `avatar`: Profile image.
*   `phone`: Primary authentication and contact method.
*   `isVerifiedByRavi`: Boolean. Represents ultimate business trust.
*   `joinedAt`: Timestamp.

## 3. The Reputational Engine (Future Scope)
Because the Member is the root of the system, future modules will attach directly to this identity:
*   **Verification Badges:** "Verified Purchaser" (They bought this item from RDJ) or "Trusted Partner" (Given by Ravi).
*   **Reviews:** A Review belongs to a Member. Other users can view a Member's entire history of reviews to judge their expertise.
*   **Followers/Following:** Members can follow other Members (unidirectional, like Instagram) to see their setup photos or reviews.
*   **Posts:** Members can upload photos/videos of their rigs.

## 4. Architectural Rules for Future Implementation
*   **Orders & Repairs:** Belong to a Member, not just a flat text string.
*   **Communication:** Chat and Video Calls belong to a separate `Communication` vertical, which *uses* the Member identity to connect two nodes.
*   **Authentication:** The Auth vertical strictly exists to verify a phone number/password and grant access to a `Member` session.