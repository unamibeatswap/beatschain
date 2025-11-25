# Audio Tagging & Metadata Analysis — 2025-11-10

Summary
- The extension performs client-side audio metadata extraction and AI-enhanced tagging, with ISRC embedding extraction and provisional ISRC generation.

Files inspected
- `lib/audio-tagging-manager.js` — MP3/WAV parsing for ISRC, `enhanceAudioMetadata()` that merges extracted ISRC and capabilities
- `lib/image-tagging-manager.js` — JPG/PNG parsing for embedded ISRC in EXIF/IPTC/tEXt
- `popup/popup.js` — `extractAudioMetadata()` pipeline, AI enhancement (`enhanceMetadataWithAI`) and the `generateLicense()` flow which consumes enhanced metadata

What the system does
- Extracts technical metadata (duration, bitrate, format) via `AudioManager.extractAudioMetadata`.
- `AudioTaggingManager` augments metadata by extracting embedded ISRCs from ID3v2 (TSRC frame) and WAV BWF 'bext' chunks.
- `ImageTaggingManager` extracts ISRC from JPEG EXIF/IPTC and PNG text chunks; can auto-populate ISRC field from cover art.
- AI enrichment (Chrome AI integration) further annotates metadata (mood, subgenre, instruments, tempo) — called from `popup.extractAudioMetadata`.

Security and privacy notes
- AI enhancement uses Chrome AI APIs — ensure user consent and privacy policy clearly state what audio metadata (and possibly audio fingerprints) is sent to AI services.
- All tagging runs client-side on the user's machine; this avoids sending raw audio to external services unless user opts into server uploads (recommended server-side flow for Livepeer/pinning).

Limitations and edge cases
- Extraction reads limited bytes (8KB for MP3 ID3 scan; 16KB for WAV bext; 64KB for JPEG) — works in most cases but large/odd tag placements may be missed. Consider full-file parsing for robust extraction when needed.
- MP3 ID3v2 parsing is manual and minimal: may not handle extended frames or uncommon encodings; using a tested ID3 library (browser-compatible) would improve robustness.
- AI enhancement is best-effort and must be validated before being used in legal artifacts (licenses, public metadata).

Recommendations
1. Keep client-side extraction for UX, but move heavy analysis (full tagging, embedding ISRC into files, AI calls that use audio content) to a server path for users who opt-in — avoids extension bloat and centralizes AI/credit usage.
2. Add explicit consent text before any AI enrichment and a toggle in settings to disable AI calls.
3. Consider using a small, well-tested browser ID3 library to improve MP3 parsing reliability.

Checklist
- [x] Located audio & image tagging managers
- [x] Verified extraction limits and AI usage points
- [ ] Add UI consent for AI enrichment
- [ ] Optional: server-side analysis path for advanced tagging

Generated: 2025-11-10
