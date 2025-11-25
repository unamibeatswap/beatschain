# BeatsChain — Chrome Web Store Listing (Finalized)

Short description
-----------------
BeatsChain: create and manage music NFTs on Solana with metadata, ISRC support, and secure wallet linking. Sign-in is required for account features and cloud sync.

Long description
----------------
BeatsChain helps musicians and publishers mint music NFTs with accurate metadata and secure wallet linkage.

Key features
- Mint NFTs on Solana with ISRC, title, and metadata
- Securely link an external wallet (Phantom) to your BeatsChain account via a signed nonce
- IPFS-hosted assets (production uploads are handled server-side)
- Local passphrase-based wallet encryption for added security
- Role-based dashboards (admin vs artist) after verified sign-in

Important privacy & sign-in notes
- Signing in with Google is required for personalized features, cloud sync, and role verification. Some features (viewing public assets) may be available without signing in, but minting, wallet linking, and admin tools require authentication.
- Guest/fallback modes are for development/testing only and do not grant admin or privileged access in published builds.
- We do not embed third-party API keys in the extension. Pinning uploads to IPFS are performed by secure server endpoints (server holds Pinata or other pinning provider credentials).

Permissions and data usage
- Permissions requested: storage (for local settings) and identity (Google sign-in). No unnecessary hosts are requested in the published build.
- We use Google OAuth to obtain an ID token for authentication and minimal profile info (email, name). We do not transmit private wallet keys off the device.

Support and privacy
- Privacy policy: https://www.unamifoundation.org/legal/beatschain-privacy-policy
- Support: Add your support contact in the Chrome Web Store developer dashboard (not in this file).

Guidance for reviewer
- This package contains no embedded API keys. Client-side Pinata usage is disabled — uploads must be performed via server-side endpoints. Development bypass flags are forcibly disabled in production via `lib/production-lock.js` and should not be enabled in published builds.

Screenshots & assets
- Include screenshots showing the signed-in dashboard, wallet-link UI, and the mint flow. Do not include screenshots that claim admin or privileged access is available without authentication.

Release notes
- v2.2: security fixes — removed client-side API keys, added production locks for dev-bypass flags, and implemented server-side wallet linking scaffold.
