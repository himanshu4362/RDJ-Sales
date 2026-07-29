---
Status: Immutable
Owner: Himanshu Raj
Purpose: To define the absolute engineering laws and mantras of the RDJ Business Platform. These override any technical trend or convenience.
---

# 99_Project_Principles.md

## I. The Ultimate Filter
Every feature, refactor, or architecture decision must answer one question:
**"Does this create measurable value for Rana Sales or its customers?"**
If the answer is no, it does not belong in Version 1.

## II. Product & Workflow Principles
1. **Documentation Before Memory:** Every finalized engineering rule, architectural decision, workflow, naming convention, or project standard must be written into the project documentation before it is considered frozen. The repository—not conversations or memory—is the single source of truth.
2. **Visible Business Progress:** Every work session should end with a genuine improvement that is visible in the browser and advances the real product. Never implement temporary features solely for presentation. Every visible change should be intended to survive into production unless explicitly marked as a development-only placeholder.
3. **The Placeholder Lifecycle:** Every UI placeholder must document: Why does it exist? What replaces it? When is it removed? This prevents placeholder accumulation.
4. **Brand Consistency:** The business is "Rana Sales". The brand is "RDJ". The owner is Ravi. The application must consistently use this professional business terminology (e.g., "Rana Sales Workspace") to ensure it feels like a custom business platform, not a generic website.
5. **Complete the Vertical Slice:** Once a bounded context enters implementation, complete it to an agreed Version 1 definition and freeze it before beginning another business domain, unless a documented dependency requires otherwise. Define what "Version 1 complete" means, reach it, freeze it, move on.
6. **Version 1 First:** We are building a digital workshop, not a tech demo. Get to a complete, usable V1 before polishing the pixels.
7. **Server is Authoritative:** The frontend hides UI; the backend hides data. Security and data visibility (e.g., `ACTIVE` products only) are enforced exclusively by the backend.

## IV. Engineering & Ownership Laws
8. **One Responsibility → One Owner:** Never distribute a single logical decision across multiple layers.
9. **Page owns Orchestration:** Pages read URLs, invoke hooks, and route traffic. Zero business logic.
10. **Hook owns State:** Hooks answer "what data do I need?" and "what happens on submit?"
11. **API owns Transport:** The data layer fetches, caches, and invalidates. Zero UI knowledge.
12. **Mapper owns Translation:** Mappers explicitly translate backend realities into frontend domains.
13. **DTO Never Leaks:** A backend Data Transfer Object must never cross the mapper boundary into the UI.

## V. Implementation Laws
14. **Never Duplicate Business Rules:** A business invariant (e.g., "Active products need images") exists in exactly one place (validation schema).
15. **No Speculative Abstraction:** Do not create generic providers, global query managers, or empty folder structures for features that do not exist yet. Build it when it is needed.
16. **No Ghost Data:** Never pretend ephemeral browser state (like a blob URL) is permanent persistence. Be honest about architectural limits during the mock phase.

## VI. Design & Journey Laws
17. **Rule #9: Design Ahead, Build One:** We may design systems (Identity, Payments, Chat) months in advance to ensure architectural stability, but we strictly implement only one vertical at a time.
18. **Rule #10: Every Business Event Has Two Perspectives:** Every business action must be reviewed from both Ravi's perspective (The Business) and the Member's perspective (The Customer) before implementation. The customer does not need the same controls; they need the result of Ravi's decisions.
19. **Rule #13: Preserve Business Context:** Authentication is an interruption, not a destination. After authentication, the user must be returned to the exact business context (URL) that required the interruption.
20. **Rule #14: Preserve User Intent:** Returning to a URL is insufficient. The authentication flow must capture and restore the user's specific *action intent* (e.g., `intent='open_order_drawer'`) so the application can automatically resume the interrupted workflow.