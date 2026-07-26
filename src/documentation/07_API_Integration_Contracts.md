---
Status: Final
Version: 1.1
Owner: Himanshu Raj
Purpose: To define the strict communication protocols, error formats, and data mapping boundaries between the RDJ Frontend and Backend systems.
---

# 07_API_Integration_Contracts.md

## 1. The Anti-Corruption Layer (DTOs & Mappers)
The frontend UI will never consume backend JSON directly. Every business module must implement a strict mapping layer to insulate the UI from backend schema changes.

**Required Module Structure:**
`src/features/[module]/api/`
* `[module].api.ts` (RTK Query endpoint injection)
* `[module].dto.ts` (TypeScript interfaces defining the exact Backend JSON shape)
* `[module].mapper.ts` (Pure functions translating DTOs into Frontend Domain Models)

## 2. Standardized Error Contracts
Backend services must never return generic string errors. All client-facing errors must follow a strict, predictable schema so the frontend can handle them programmatically (using codes) and display them humanely (using messages).

**The Error Schema:**
```json
{
  "error": {
    "code": "VALIDATION_FAILED", 
    "message": "The provided input is invalid.",
    "details": [
      { 
        "field": "phone", 
        "code": "PHONE_INVALID", 
        "message": "Must contain exactly 10 digits." 
      }
    ],
    "traceId": "req-987654321" 
  }
}