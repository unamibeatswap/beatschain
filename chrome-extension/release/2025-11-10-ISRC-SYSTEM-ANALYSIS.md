# ISRC System Analysis — 2025-11-10

This document summarizes the ISRC manager and ISRC-related flows found in the BeatsChain extension. Use as a reference for reviewers and engineers.

Files inspected
- `lib/isrc-manager.js` — authoritative ISRC generation, storage (chrome.storage.local), validation and UI wiring
- `popup/isrc-minting-section.html` — ISRC generation UI, sponsor placement, registry preview, minting checklist
- `popup/popup.js` — integration points: initialization of `ISRCManager`, calls to `generateISRC`, UI updates and validation flows

Behavior and responsibilities
- Generates ISRCs in the format `ZA-80G-YY-NNNNN` (territory ZA, registrant 80G).
- Persists a registry to `chrome.storage.local` under `isrcRegistry` with fields: lastDesignation, codes, year, userRange.
- Validates generated ISRC strictly with regex `^ZA-80G-\d{2}-\d{5}$` before returning.
- Exposes methods: `initialize()`, `generateISRC(trackTitle, artistName)`, `validateISRC(isrc)`, `markISRCAsUsed(isrc)`.
- UI hooks: gallery/reg list, generate/validate buttons, persistent display and field coloring, triggers sponsor display after generation.

Key observations
- Defensive programming: the manager performs many defensive checks (ensure registry.codes exists, sanitize inputs, fallback registry on load failure).
- Persistence: uses `chrome.storage.local` — good for extension-only persistence, but not globally authoritative.
- Legal note: ISRC issuance in real-world requires registry agency; current system issues "professional" local ISRCs (OK as provisional). Documentation and UX must not claim official issuance.

Risks & mitigations
- Race conditions on registry updates: current code relies on chrome.storage local set/get; consider server-side canonicalization if multi-device consistency required.
- Storage loss: `saveRegistry()` errors are caught and flow continues in-memory — consider showing user a warning and exporting registry as backup.
- Claiming official status: Make UI language explicit about "provisional/internal ISRC" vs. registered ISRC to avoid legal/Store reviewer confusion.

Recommended next steps
1. Add a README section describing ISRC semantics (provisional vs official) and guidance for reviewers.
2. Add an export/import flow (already present in UI) and test persistence across browser profiles.
3. (Optional) Implement an optional server validation/authoritative registry endpoint for users that opt into official issuance (partner flow).

Checklist
- [x] Identified code locations
- [x] Verified generation and validation logic
- [ ] Add clear UI text explaining provisional status
- [ ] Consider server-backed registry for canonical issuance

Generated: 2025-11-10
