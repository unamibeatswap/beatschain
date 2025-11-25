# Livepeer → IPFS Upload Flow (analysis) — 2025-11-10

Purpose
- Describe secure, Chrome-Web-Store-compliant upload flow integrating Livepeer for transcoding/streaming and IPFS for canonical storage/pinning.

Relevant code and artifacts
- Front-end: `popup/popup.js` (upload UI calls into `processFile()` and `extractAudioMetadata()`)
- Scaffolding: `tools/backend-sample/index.js` (demo server for auth/wallet-link)
- IPFS managers: `lib/ipfs-asset-manager.js`, `lib/radio-ipfs-manager.js`, `lib/radio-ipfs-manager.js` (client-side pinata keys set to null — uploads disabled client-side)

Key constraints from Livepeer
- To upload: server must call `POST /asset/request-upload` with Livepeer Bearer token (server-side). The response contains `url` (direct PUT) or `tusEndpoint` (resumable).
- Clients may upload to the returned URL (direct or tus) without being given the Livepeer secret — server brokers the upload link.

Recommended secure flow (server-heavy, Chrome-compliant)
1. Client selects file and calls `POST /api/upload` on your server (multipart + metadata + sponsor choice). Include Authorization header (extension sign-in token).
2. Server validates user & sponsor, enforces limits and optionally charges/escrows sponsor funds.
3. Server calls Livepeer `POST /api/asset/request-upload` with `LIVEPEER_API_KEY` from env and either uploads the file itself or returns the `tusEndpoint/url` to a server-controlled broker.
4. Once Livepeer asset ready, server pins chosen canonical file (or metadata) to IPFS using Web3.Storage / NFT.Storage / Pinata server-side (env keys stored securely).
5. Server composes metadata JSON (ISRC, livepeer playbackUrl, ipfs audioCid, metadataCid, sponsor info, royalties) and pins metadata JSON to IPFS.
6. Server returns metadata URI and playbackUrl to the extension. The extension uses server-provided playbackUrl for in-extension playback and minting.

Why choose this design
- Keeps Livepeer and pinning keys off the extension (required by Chrome Web Store policies).
- Keeps extension bundle small (no tus-js-client or large libs required) — only basic fetch/multipart logic.
- Centralizes sponsor accounting, provenance records and error handling on the server.

Client-assisted alternative (lighter server bandwidth)
- Server issues `request-upload` and returns `tusEndpoint` to extension; extension uses `tus-js-client` to upload direct to Livepeer.
- Tradeoffs: smaller server bandwidth, but increases extension size (adds tus-js-client) and more complexity for resuming across restarts.

Pinning strategy
- Pin canonical asset or selected canonical MP4 output from Livepeer.
- Always pin metadata JSON (contains livepeer playback reference and ipfs cid) for provenance.

Action items for implementation
1. Scaffold `/api/upload` (server-heavy) in `tools/backend-sample` (do not commit secrets; use `.env.example`).
2. Update `popup/popup.js` upload handler to POST to `/api/upload` and handle progress / playbackUrl returned.
3. Provide endpoint `/api/asset/request-upload` if you want client-assisted uploads later.

Checklist
- [x] Confirmed client uploads disabled in IPFS managers
- [ ] Scaffold server upload endpoints (optional — I can implement on request)
- [ ] Update extension upload handler to call server upload endpoint

Generated: 2025-11-10
