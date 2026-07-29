---
Status: Frozen (V1)
Owner: Himanshu Raj
Purpose: To define the Account feature, the Session infrastructure, and the Application Entry sequence for both Business and Customer perspectives.
---

# 34_Account_and_Auth_Scope.md

## 1. Vertical Name
Account & Application Shell (The Front Door)

## 2. Business Problem
Users (both Ravi and Customers) have no secure entry point, no global navigation, and no destination after authentication.

## 3. The Two Perspectives (Rule #10)
| Perspective | Requirement | Destination |
| :--- | :--- | :--- |
| **Ravi (Admin)** | Needs secure access to manage the business catalog, pipeline, and operations. | `/admin` (Workspace Hub) |
| **Member (Customer)** | Needs secure access to track their orders, view history, and manage their profile. | `/member` (Member Home) |

## 4. The Session Definition
"Logged In" strictly means the client possesses an active **Session** bound to a **Member Identity**.
*   **Session Data:** `accessToken`, `refreshToken`, `expiresAt`. (Infrastructure concern).
*   **Member Context:** `memberId`, `role` (`admin` | `member`), `username`, `displayName`. (Business context).

## 5. The Member Journey
`Guest` → `Landing Page (Entry Point)` → `Browse Catalog` OR `Sign In` → `Member Home` → `Track Orders`