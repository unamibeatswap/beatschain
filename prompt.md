You are the Copilot Agent for the BeatsChain ecosystem — an integrated Chrome Extension + PWA music monetization and submission platform built on Web3 and Web2 hybrid infrastructure.

Your task is to read and understand the entire BeatsChain plan below, analyze the current repository structure, and propose a **non-breaking implementation plan** that aligns with it. Additionally, you should plan for **educational guide pages** for each relevant feature, so users and admins can learn how to use the extension and dashboards effectively.

---

### 🔗 OVERVIEW

BeatsChain is a decentralized music monetization tool that enables creators to:
- Manage their artist profiles
- Mint music NFTs with ISRC and metadata
- Run promotional campaigns
- Prepare radio submission packages
- Track assets, campaigns, and radio submissions via a connected PWA

The system consists of:
1. **BeatsChain Chrome Extension** (creator tool)
2. **BeatsChain PWA** (assets viewer + radio submission system + guides)
3. **Shared infrastructure** — Google Auth + Thirdweb + Solana + Livepeer + Supabase

---

### 🧩 CORE ARCHITECTURE

#### **1. Chrome Extension (Manifest V3)**
- Acts as the **creator dashboard** for minting and campaign management.
- Must remain **lightweight** and **Chrome Store–compliant**.
- Primary features:
  - Google authentication (via auth2)
  - Wallet linking (Thirdweb Embedded Wallet, Solana)
  - Radio subscriptions (stream & manage)
  - NFT minting (Livepeer upload via TUS → IPFS pin → Solana mint)
  - Campaign management UI
  - Split sheet generation (JSON only, no signatures)
  - Radio submission ZIP preparation:
      - Includes song file, cover art, metadata.json, splitsheet.json
      - Upload to Livepeer/IPFS
      - Generates deep link to PWA for final submission

✅ The extension **does not** sign PDF documents or submit radio packages.

---

#### **2. PWA (assets.beatschain.app)**
- Public-facing and compliant with Chrome’s privacy policy requirements.
- Acts as **asset hub**, **radio submission system**, and **educational guide hub**.
- Uses same Google + Wallet auth for seamless session continuity.

**PWA pages:**
- `/` — Asset dashboard  
  - Displays all user-minted songs and NFTs  
  - Integrates Livepeer playback (via IPFS CID)  
  - Allows users to share or embed assets  
- `/radio-submission` — Radio submission workflow  
  - Imports ZIP or metadata from extension  
  - Displays and verifies metadata  
  - Loads official **SAMRO split sheet** PDF template  
  - Auto-fills contributor info and allows e-signatures  
  - Generates and stores `splitsheet_signed.pdf` on IPFS  
  - Creates submission receipt (CID + timestamp + wallet hash)
- `/guides` — Educational user manual pages  
  - Guide for **each tab** in the extension: Profile, Minting, Campaigns, Radio Submission prep  
  - Guide for **Admin Dashboard**: managing campaigns, tracking metrics, approving submissions  
  - Guide for **Artist Dashboard**: managing assets, viewing statistics, sharing content  
  - Optional “getting started” guide for first-time users
- `/privacy-policy` — Required for Chrome Web Store compliance

**PWA stack:**
- Next.js (PWA-ready)
- Livepeer (upload, transcoding, IPFS pinning)
- Thirdweb SDK (Solana wallet + signature)
- Supabase (optional for analytics + submission metadata)
- pdf-lib or DocuSign API for split sheet signing
- Resend/Firebase for notifications

---

### 🔐 Auth & Wallet Layer
- Primary auth: **Google OAuth (Firebase)**
- Secondary: **Thirdweb Embedded Wallet** (auto-generated, linked to Google)
- Wallet: **Solana** (used for minting + verification)
- Cross-session token sharing between Extension and PWA
  - Use Firebase ID token or JWT stored in localStorage
  - Rehydrated when user opens PWA → no re-login needed

---

### ⚙️ Data & Media Flow
**Minting (extension):**
1. Upload via Livepeer TUS
2. Livepeer returns IPFS CID
3. Mint NFT on Solana via Thirdweb
4. Push metadata + CID to Supabase (optional)
5. Display in PWA (auto-synced)

**Radio Submission (PWA):**
1. Import ZIP/JSON from Livepeer/IPFS
2. Render metadata and contributors
3. Generate & sign SAMRO split sheet PDF
4. Re-upload signed PDF to IPFS
5. Produce `submission_receipt.json`
6. Optionally notify SAMRO or store submission record in Supabase

---

### 🎯 OBJECTIVES FOR YOU (Copilot Agent)

1. Analyze the current repository and **identify where the above architecture fits**.
2. Suggest a **non-breaking incremental plan** to:
   - Move the Asset Hub functionality from the extension to a new PWA.
   - Add the radio submission system (SAMRO split sheet signing, PDF generation, and upload).
   - Maintain seamless Google + Wallet authentication between extension and PWA.
3. Outline potential **refactors** or **module separations** (auth, livepeer utils, IPFS handlers, campaign logic).
4. Ensure full **Chrome Web Store compliance** (manifest permissions, privacy policy links, limited API usage).
5. Maintain **data interoperability** between the extension and PWA using shared token + Livepeer CID.
6. Create **educational guide pages** in the PWA:
   - One guide for each extension tab (Profile, Minting, Campaigns, Radio Submission prep)
   - Admin dashboard guide
   - Artist dashboard guide
   - Optional getting started guide
7. Propose testing, deployment, and environment variable strategies (for Codespaces + Vercel).

---

### 🧭 OUTPUT FORMAT EXPECTATION

When you respond:
- Present a **step-by-step non-breaking implementation plan**.
- Highlight which modules/files can be safely refactored or extracted.
- Suggest where new features (PWA radio submission, PDF signing, guide pages) should live.
- Include migration notes if dependencies or SDK versions must change.
- Use markdown sections like `## Phase 1`, `## Phase 2` for clarity.
- Include guide page structure recommendations (routes, tabs, content placeholders).

---

**End of plan. Begin analysis now.**
