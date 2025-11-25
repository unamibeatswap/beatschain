# Sponsor Financing & Minting Flow — 2025-11-10

Overview
- The extension supports sponsor-financed minting (ads fund mint costs). The ISRC generation step is a natural breakpoint for sponsor placement and UX.

Files & codepaths
- `popup/isrc-minting-section.html` — UI for sponsor opt-in and messaging
- `popup/popup.js` — sponsor display triggers after ISRC generation and before mint; initialization calls: `initializeMintingSponsorIntegration()` and sponsor-trigger points
- `lib/campaign-manager.js` — campaign placement configuration and hooks to update IPFS manifests

Flow summary
1. User generates an ISRC or uploads a file.
2. UI displays sponsored content (modal/banner) offering to finance minting for a fee/benefit.
3. If user accepts, server-side sponsor accounting should lock/confirm funds and reduce/waive minting fee.
4. Server prepares the canonical asset (Livepeer + IPFS pinning) and proceeds to minting.

Important considerations
- Sponsorship must be transparent in metadata and UI (disclose sponsored financing in metadata attributes and UI labels) for compliance.
- Billing/escrow accuracy: record sponsor impressions and acceptance server-side — client-side analytics are fine for UX but unreliable for billing.
- Ensure sponsor content does not mislead reviewers (describe in `STORE_LISTING.md` and privacy policy how sponsors interact with the mint flow).

Recommendations
1. Implement server-side sponsor confirmation endpoint `/api/sponsor/confirm` that performs payment authorization/escrow and returns a sponsorship token used during upload/mint.
2. Record sponsor acceptance in the minted metadata JSON under `sponsors` with `sponsorId`, `contribution`, `placement` and `timestamp`.
3. Add a small audit log in the admin dashboard for sponsor redemptions and accounting.

Checklist
- [x] Found sponsor hooks in UI and popup logic
- [ ] Add server-side sponsor endpoints (payment/escrow)
- [ ] Add metadata field for sponsor provenance

Generated: 2025-11-10
