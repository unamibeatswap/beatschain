# Google OAuth setup for BeatsChain Chrome extension

This short README explains the exact steps required in Google Cloud Console and in the extension `manifest.json` so the Chrome `chrome.identity` OAuth flow works for the published extension.

Use this as a checklist before publishing the extension and for verifying the OAuth redirect configuration.

---

## 1) Overview

- The Chrome extension uses `chrome.identity` which relies on an OAuth client in Google Cloud and a redirect URI that includes the Chrome extension ID.
- The required redirect URI format is:

  `https://<EXT_ID>.chromiumapp.org/`

  where `<EXT_ID>` is the 32-character extension ID assigned by Chrome Web Store for the published extension.

  Note: `chrome.identity.getRedirectURL()` will return the exact redirect URL that your extension will use at runtime. Use that exact string when adding the redirect URI in Google Cloud Console.

## 2) Steps in Google Cloud Console

1. Open Google Cloud Console → APIs & Services → Credentials.
2. Create an OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: BeatsChain Chrome Extension (or similar)
3. Under "Authorized redirect URIs" add the exact redirect URL returned by chrome.identity.getRedirectURL() for your published extension ID. Example:

   `https://abcdefghijklmnopabcdefghijklmnop.chromiumapp.org/`

   - If you don't yet know the final extension ID, you have two options:
     - Publish the extension (unlisted/private if needed) to the Chrome Web Store to get the final ID, then add the redirect URI and update the client. OR
     - Use an existing OAuth client and update it after you have the published ID.

4. Save the client and copy the `client_id` string.

5. (Optional but recommended) Configure the OAuth consent screen (APIs & Services → OAuth consent screen):
   - Select an appropriate user type (Internal/External)
   - Add required scopes: at minimum `email` and `profile` for basic sign-in. If you request sensitive/scoped scopes (drive, youtube, etc.) follow the verification process.

## 3) Update `manifest.json`

In your extension's `manifest.json`, confirm the `oauth2` section uses the `client_id` copied from Google Cloud and includes the required scopes. Example:

```json
"oauth2": {
  "client_id": "<YOUR_CLIENT_ID>.apps.googleusercontent.com",
  "scopes": [
    "email",
    "profile",
    "openid"
  ]
}
```

And ensure `identity` permission is declared:

```json
"permissions": [
  "identity",
  "storage",
  "activeTab",
  "scripting"
]
```

After updating `manifest.json`, rebuild your extension package for the Chrome Web Store.

## 4) Publishing and extension ID

- The extension ID is stable for a given Chrome Web Store item. If you need the exact redirect URI to register in Google Cloud you can:
  1. Publish the extension (private/unlisted) to get the assigned extension ID, or
  2. Use a developer key to get a stable ID before publishing (advanced; requires using a signing key when packaging) — for most workflows it's easier to publish privately then add the redirect in Google Cloud and re-publish if necessary.

## 5) Verifying the flow locally (testing tips)

- While developing locally, you may use the guest-mode fallback for quick testing. To enable it temporarily in the popup console:

```js
window.__DEV_GUEST_MODE__ = true;
```

- But note: the real OAuth flow will only work with the registered redirect URI. To test the real OAuth flow you need the published extension ID registered in Google Cloud.

- To view the redirect URL programmatically from the extension page (console):

```js
console.log('Redirect URL:', chrome.identity.getRedirectURL());
```

## 6) Common pitfalls & troubleshooting

- Wrong redirect URI: The most common error. Use the exact string from `chrome.identity.getRedirectURL()` and place it in Google Cloud Console.
- Wrong client type: Use "Web application" client in Google Cloud (not "Desktop" or "Other").
- Mismatched client_id: Ensure the `client_id` in `manifest.json` matches the Google client exactly.
- Consent screen not configured: If you're requesting profile/email scopes, ensure the consent screen is at least configured to avoid errors.
- OAuth verification: If requesting sensitive scopes you may need to submit the app for verification which takes time.
- CORS vs OAuth: The IPFS/pin gateway CORS error you saw earlier is unrelated to OAuth. Use the server proxy (we added `/api/ipfs/:hash`) or a gateway that returns Access-Control-Allow-Origin for extension origin.

## 7) Quick verification checklist

1. Publish extension (private/unlisted) and get the extension ID.
2. In Google Cloud Console create/update OAuth client and add redirect URI `https://<EXT_ID>.chromiumapp.org/` (use chrome.identity.getRedirectURL() to confirm exact string).
3. Update `manifest.json.oauth2.client_id` with the client ID.
4. Rebuild and upload extension ZIP to Chrome Web Store (or update existing item).
5. Install the published extension and attempt sign-in. Monitor DevTools console for `chrome.identity` success or `chrome.runtime.lastError` messages.

## 8) Notes about production readiness

- Do not enable `window.__DEV_GUEST_MODE__` in production builds.
- Ensure your OAuth consent screen and scopes are set appropriately and that you have a support email configured for the consent screen.
- If you need help with the Google Cloud side, provide the extension ID and I can produce the exact redirect URI and a one-line checklist to paste into the console.

---

File: `OAUTH-SETUP.md` has been added to the repo root for quick reference.
