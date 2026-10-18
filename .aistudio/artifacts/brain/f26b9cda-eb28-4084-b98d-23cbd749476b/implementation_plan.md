# BhumiDisha (ভূমিদিশা) — Hackathon-Ready Frontend Prototype (Final Approved)

BhumiDisha is an accessible, bilingual (Bengali/English) land-tech platform designed for Bangladeshi citizens, prospective land buyers, landowners, lawyers, and bank review teams. It provides an intuitive frontend prototype for pre-transaction conflict screening (P3: Catch Inconsistencies & Over-Allocation Risks), a personal parcel-wise document vault ("আমার ভূমি-ওয়ালেট") with local SHA-256 integrity comparisons, and a grounded land information assistant ("ভূমিসাথী") citing official public Ministry guidelines.

---

## Approved Final Specifications

- **100% Synthetic Data Compliance**:
  - Personas: "Demo Citizen 01" (`নাগরিক ডেমো ০১`) and "Demo Institution 01" (`সংস্থা ডেমো ০১`).
  - Parcel Identifiers: `DEMO-PARCEL-001` (Mouza: `SYNTHETIC-MOUZA-A`, Dag: `DEMO-DAG-402`, Khatian: `DEMO-KHATIAN-88`), `DEMO-PARCEL-002` (Mouza: `SYNTHETIC-MOUZA-B`, Dag: `DEMO-DAG-118`).
  - Masked demo numbers only (`+880 1700-000001`, NID: `DEMO-NID-XXXX-XXXX`). No real personal or government data.
- **Accurate P3 Scenarios**:
  - **Scenario 1 (Default)**: *Ownership-Share Over-Allocation Risk* (Recorded initial 100%, historical transfers 30% + 40% = 70% sold, 30% remaining balance. Proposed transfer 40% exceeds recorded balance by 10 percentage points. Labeled as over-allocation risk, not definitive fraud).
  - **Scenario 2**: *Conflicting Transfer / Overlapping Sale Risk* (Conflicting deed recorded for overlapping share of the same parcel to different buyers).
  - **Scenario 3**: *Missing Records / Mutation Gap (Review Required)* (Mutation reference not registered in demo ledger).
  - **Scenario 4**: *Consistent Baseline (No Discrepancy Found in Synthetic Data)*.
- **Dual-View Ownership History**: Interactive React Flow Graph + Synchronized Chronological Timeline + Accessible Tabular View.
- **Report Export**: CSV download and clean, print-friendly Evidence Report with `window.print()` / PDF capability and synthetic watermarks.
- **Wallet & Hash Integrity**: Web Crypto SHA-256 calculator, demo QR code & time-limited view-only sharing link, Document Completeness Checklist.
- **BhumiSathi Grounded Assistant**: FAQ cards citing `minland.gov.bd` / `land.gov.bd`, sample clause inspector, citizen checklists.
- **Storage & Privacy**: Safe `localStorage` strictly for theme and language; demo state in memory. Zero remote document upload.
- **Bilingual & Light/Dark Mode**: Complete 100% Bengali and English translation toggle and persistent dark mode.
