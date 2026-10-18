# BhumiDisha (ভূমিদিশা) — LandTech 2026 Hackathon Prototype

> **“জমির তথ্য, যাচাই ও সহায়তা—এক প্ল্যাটফর্মে।”**
> *Land Information, Verification and Assistance — One Platform.*

BhumiDisha is an accessible, bilingual (Bengali-first & English) land-technology platform built for Bangladeshi citizens, prospective land buyers, landowners, lawyers, and bank review teams. It provides a complete frontend prototype tackling Hackathon Problem Statement **P3: Catch Inconsistencies & Over-Allocation Risks**.

---

## 🌟 Core Modules

### 1. জমি কেনার আগে যাচাই (Pre-Purchase Land Verification)
- **Synchronized Dual-View**: Interactive node-graph built with `@xyflow/react` showing Seller $\rightarrow$ Buyer transfers, transfer percentages, deed references, and survey khatian links, side-by-side with an interactive chronological transaction timeline and tabular alternative.
- **Evidence-Linked Conflict Screening**: Evaluates 4 deterministic synthetic scenarios:
  - *Case 1 (Default)*: **Ownership-Share Over-Allocation Risk** (100% initial $\rightarrow$ 30% sold + 40% sold leaving 30% balance; proposed 40% transfer triggers a 10 percentage-point deficit warning).
  - *Case 2*: **Conflicting Transfer / Overlapping Sale Risk** (conflicting deeds issued for the same 50% plot share).
  - *Case 3*: **Missing Records / Mutation Gap** (mutation khatian record not indexed in digital database).
  - *Case 4*: **Consistent Baseline** (all ledger math is balanced).
- **Pre-Transaction What-If Simulator**: Allows testing proposed buyer shares to evaluate mathematical surplus or deficit before committing funds.
- **Audit Export & Bengali Voice Playback**: Downloadable CSV report, print-friendly Evidence Report (PDF), and native browser Web Speech voice summary in Bengali.

### 2. আমার ভূমি-ওয়ালেট (My Land Wallet)
- **Parcel-Organized Vault**: Catalog of deeds, survey khatians, mutation orders, and tax DCR receipts labeled `DEMO_ONLY`.
- **In-Browser Web Crypto SHA-256 Check**: Uses `window.crypto.subtle.digest('SHA-256')` to compute real cryptographic hashes locally in the browser with zero server upload.
- **Controlled View-Only Sharing**: Generates time-limited view tokens and QR codes with optional passcodes and read-only preview watermarks.
- **Document Completeness Checklist**: Audits vault presence for essential transaction documents without claiming official legal perfection.

### 3. ভূমিসাথী (BhumiSathi Assistant)
- **Grounded Information**: Suggested FAQs citing official Ministry circulars (`land.gov.bd`, `minland.gov.bd`, `mutation.land.gov.bd`, `ldtax.gov.bd`).
- **Document Clause Inspector**: Highlights key clauses (dag numbers, schedules, transfer declarations) from sample registered deeds.
- **Guided Citizen Action Checklists**: Interactive step-by-step guides for Pre-Purchase Due Diligence and E-Mutation filing.

---

## 🔒 Privacy, Safety & Hackathon Compliance

1. **100% Synthetic Demo Data**:
   - Uses fictional personas ("Demo Citizen 01", "Demo Institution 01") and synthetic parcel IDs (`DEMO-PARCEL-001`, `SYNTHETIC-MOUZA-A`, `DEMO-DAG-402`).
   - Zero real names, NIDs, phone numbers, or real government records.
2. **Non-Authoritative Framing**:
   - The prototype does not claim to "stop all fraud" or "guarantee title". It flags discrepancies and calculations for human legal review.
3. **Storage Discipline**:
   - Only UI preferences (`theme` and `locale`) are stored in `localStorage`.
   - All demo sessions and documents reside strictly in memory/session.

---

## 🚀 Local Development & Build

### Prerequisites
- Node.js 18+ or Bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory.

### 4. Type Check / Lint
```bash
npm run lint
```

---

## 🌐 Deploy to Vercel

This repository is pre-configured for instant zero-configuration deployment to [Vercel](https://vercel.com):

1. Push this repository to GitHub or GitLab.
2. Log in to Vercel and click **Add New Project**.
3. Select your repository.
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

No environment variables or API keys are required for the frontend demonstration.

---

## 📋 Current Prototype Limitations
- Backend authorization and persistent cloud databases (e.g. Supabase) are isolated behind service interfaces (`src/services/*`) and will be connected in Round 2.
- Web Crypto SHA-256 verification confirms digital file integrity against stored references, not official legal validity.
- View-only sharing disables downloads and printing in the browser, but cannot prevent external camera photography or device screenshots.
