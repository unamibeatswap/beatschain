# Playback Strategy & Chrome Compliance — 2025-11-10

Goal
- Provide playback inside the extension without bundling large media assets into the extension package and remain Chrome Web Store compliant.

Findings
- The extension already streams and references IPFS/Livepeer assets rather than bundling audio.
- `popup/popup.js` expects `playbackUrl` to be returned by server/asset manager for playback.

Recommended playback approaches
- Server-provided MP4 (preferred): Server exports MP4 from Livepeer and returns a direct MP4 URL for the extension to play using a native HTML5 audio/video element — this avoids bundling `hls.js` and keeps extension small.
- HLS via Livepeer: If adaptive streaming required, use HLS with `hls.js` loaded lazily only when needed (dynamic import) to avoid bundle size increase.
- Short preview clips: For fast UX, server should produce and return a short (10s) preview clip that the extension can quickly play.

Permissions & host permissions
- Minimize `host_permissions` in `manifest.json` — prefer a single trusted API domain (your backend) and only add playback CDNs if strictly necessary.

Accessibility & UX
- Provide native controls (play/pause, seek) and fallbacks when HLS is unavailable.
- Show playback buffering and source origin (Livepeer/IPFS) in the UI for transparency.

Checklist
- [x] Confirmed extension does not bundle audio files
- [ ] Implement server export to MP4 and return MP4 playback URL
- [ ] If HLS is used, implement lazy-load for `hls.js`

Generated: 2025-11-10
