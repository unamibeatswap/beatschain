# BeatsChain Backend Sample

This is a tiny Express server to support local testing of the extension's `/auth/verify` flow.

Usage:

1. Install dependencies (Node 18+):

```bash
cd tools/backend-sample
npm install
npm start
```

2. By default the server returns mock role mappings. To enable a demo Google verification flow,
set `GOOGLE_CLIENT_ID` in the environment (this sample will call Google's tokeninfo endpoint).

3. For easy local testing from the extension you can POST to `http://localhost:4000/auth/verify` with JSON:

```json
{ "token": "dev-admin" }
```

This will return an admin mapping for local development.

Notes:
- This is a sample/demo only — do not use in production without proper Google token verification and hardening.
- In production, verify `id_token` using the Google libraries and map emails/user IDs to your server-side role store.
