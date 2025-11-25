# BeatsChain QA & Chrome Web Store Publishing Checklist

This checklist helps ensure the extension is ready for Chrome Web Store submission and local unpacked testing.

## OAuth & Manifest
- [ ] `manifest.json` contains the correct `oauth2.client_id` for the Chrome Extension client registered in Google Cloud Console.
- [ ] The OAuth client in Google Cloud Console is type **Chrome App / Chrome Extension** and lists the published Extension ID.
- [ ] `manifest.json` does not include `activeTab`/`tabs` unless strictly required.

## Privacy & Store Listing
- [ ] Privacy policy URL is live and included in the store listing and manifest (`homepage_url`).
- [ ] Support contact email is present in the Store listing.
- [ ] Store description does not advertise unrestricted guest-mode admin features.

## Permissions & Scopes
- [ ] Permissions are minimal. Current: `storage`, `identity`.
- [ ] OAuth scopes limited to `email`, `profile`, `openid`.

## Security & Data Handling
- [ ] Private keys are not stored in plaintext in `chrome.storage.local`.
- [ ] Wallet private keys are encrypted (AES-GCM) and protected by user passphrase or stored raw only as legacy fallback.
- [ ] No secrets (client secrets, private keys) are embedded in the repository.
- [ ] Backend `/auth/verify` endpoint exists and validates Google tokens server-side for authoritative role mapping.

## UI & UX
- [ ] Partner consent modal appears and is awaited before any sign-in attempt.
- [ ] Admin-only UI elements are hidden by default and revealed only after server-side role verification.
- [ ] Keyboard focus styles present for admin tabs and modals (accessibility).

## Testing
- [ ] Fresh install -> Accept consent -> Sign in with non-admin -> Admin UI should not be visible.
- [ ] Sign in with admin (server-verified) -> Admin dashboard visible and admin-only features enabled.
- [ ] Sign-in failure -> extension does not silently enable guest-mode or privileged features.
- [ ] Wallet export requires passphrase when passphrase flow is enabled.
- [ ] Radio/nft ZIP packaging flow produces a valid ZIP per `2025-10-22-09-58-ZIP-RULES-COMPREHENSIVE.md`.

## Local Unpacked Testing
- [ ] If testing unpacked, ensure extension ID matches the OAuth client mapping or use a test OAuth client associated with the unpacked extension ID.
- [ ] Use `tools/zip-packager.sh` to validate packages locally before upload.

## Post-Publish Monitoring
- [ ] Monitor OAuth error reports (bad client id / invalid_client) after publishing.
- [ ] Monitor support contact inbox for user sign-in issues and track via analytics.

