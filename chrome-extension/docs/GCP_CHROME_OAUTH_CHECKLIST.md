# Google Cloud Console & Chrome Extension OAuth Checklist

Follow these steps to verify your OAuth client is correctly configured for the published Chrome extension and avoid `bad client id` / `invalid_client` errors.

1. Find your extension ID
   - Chrome Web Store Developer Dashboard → your extension → note the Extension ID.
   - Or in a local Chrome: chrome://extensions → enable Developer mode → load unpacked with the same private key to preserve ID.

2. Google Cloud Console
   - Open: https://console.cloud.google.com/apis/credentials
   - Under OAuth 2.0 Client IDs, find the client used in `manifest.json` (match by client ID string).
   - Confirm the client is of type **Chrome App** / **Chrome Extension** (it should not be a Web application client for extension flows).
   - Ensure the **Application ID / Extension ID** field contains your extension ID (the published one for production).
   - If it does not, create a new OAuth client with the correct extension ID and replace the `client_id` in `manifest.json`.

3. OAuth Consent Screen
   - Ensure the consent screen is configured and published.
   - Required fields: Support email, Application name, Privacy policy URL (must match Chrome Web Store listing), Authorized domains.
   - Scopes: Only request `email`, `profile`, `openid` (you currently request these — good).

4. Chrome Web Store listing
   - Set Privacy policy URL (manifest `homepage_url`) in the store listing and ensure it is accessible.
   - Provide a support contact email.
   - Update the Store description to not promise unrestricted guest-mode access unless you intentionally provide it.

5. Local testing notes
   - If testing locally with unpacked extension, you must keep the same extension ID as the published client or use a dedicated OAuth client listing the unpacked extension ID.
   - To keep the same ID locally, pack the extension with the original private key.

6. Verify at runtime
   - Load the extension (published or unpacked with correct ID) and perform sign-in.
   - If `chrome.identity.getAuthToken` returns `chrome.runtime.lastError` with `bad client id` or `invalid_client`, re-check the mapping in step 2.

7. Security reminders
   - Do NOT embed client secrets in the extension.
   - Ensure private keys are not transmitted to third parties.
   - Use a backend `/auth/verify` endpoint for authoritative role mapping.
