# BhumiDisha (ভূমিদিশা) — LandTech 2026 Hackathon Prototype

> **“জমির তথ্য, যাচাই ও সহায়তা—এক প্ল্যাটফর্মে।”**
> *Land Information, Verification and Assistance — One Platform.*

BhumiDisha is an accessible, bilingual (Bengali-first & English) land-technology platform built for Bangladeshi citizens, prospective land buyers, landowners, lawyers, and bank review teams. It provides a complete frontend prototype tackling Hackathon Problem Statement **P3: Catch Inconsistencies & Over-Allocation Risks**.

The project focuses on explainable ownership-share calculations, transaction-history visualization, record-mismatch screening, and organized land-document management. It is designed as a decision-support prototype, not as an official government verification service.

---


## 1. Problem Statement

Land transactions may involve complex ownership histories, multiple transfers, incomplete records, inconsistent document references, and uncertainty about the remaining ownership share.

BhumiDisha focuses on **P3: Catch Fraud & Double-Selling**, with particular emphasis on identifying potential transaction conflicts and ownership-share over-allocation using explainable rules.

The prototype aims to make relevant information easier to review by presenting record relationships, chronological transaction histories, calculated ownership balances, and evidence-linked findings in a user-friendly interface.

The system flags potential inconsistencies for human review. It does not conclusively determine fraud or guarantee legal ownership.

## 2. Project Objectives

- Visualize parcel ownership and transaction history in an understandable format.
- Identify potential ownership-share over-allocation and conflicting transfer records.
- Compare available record fields and flag inconsistencies or missing information.
- Support pre-transaction what-if analysis using proposed transfer details.
- Organize sample land parcels and related documents in a parcel-oriented wallet interface.
- Demonstrate client-side file-integrity checking using SHA-256.
- Provide Bengali-first navigation and accessible English-language support.
- Establish a prototype architecture that could support future authorized integration with relevant systems.

## 3. Core Modules

### Module 1 — জমি কেনার আগে যাচাই
*Pre-Purchase Land Verification*

This module demonstrates how available land-record information can be organized and screened before a proposed transaction.

**Key capabilities**

- **Ownership Graph:** Visualizes seller-to-buyer transfer relationships, ownership shares, deed references, and related record identifiers.
- **Transaction Timeline:** Displays relevant historical events in chronological order, with a tabular alternative where available.
- **Evidence-Linked Screening:** Applies deterministic rules and explains why a potential inconsistency has been flagged.
- **Pre-Transaction What-If Analysis:** Allows a user to test a proposed transfer against the available synthetic ownership balance.
- **CSV Export:** Supports exporting available screening information.
- **Evidence Report:** Presents the relevant records, calculations, findings, and limitations for review.
- **Bengali Voice Summary:** Uses browser speech synthesis where supported.

**Synthetic screening scenarios**

1. Ownership-share over-allocation.
2. Conflicting or overlapping transfer records.
3. Missing mutation information or incomplete records.
4. A consistent baseline scenario.

**Example calculation**

- Initial recorded ownership share: 100%.
- Previous transfers: 30% + 40%.
- Calculated remaining share: 30%.
- Proposed new transfer: 40%.
- Potential over-allocation: 10 percentage points.

This example demonstrates a mathematical ownership-share inconsistency. It is not, by itself, conclusive evidence of double-selling or fraud.

The screening outcomes are:

- `CONFLICT DETECTED`
- `REVIEW REQUIRED`
- `NO CONFLICT FOUND IN AVAILABLE DATA`

The last outcome means that no conflict was found within the records and rules available to the prototype. It does not guarantee that the land is legally safe or free from disputes.

### Module 2 — আমার ভূমি-ওয়ালেট
*My Land Wallet*

The Wallet provides a parcel-oriented interface for organizing land information and associated document examples.

**Current prototype scope**

- Parcel cards using fictional land identifiers.
- Sample land-record and document information.
- Document completeness checklist.
- Client-side SHA-256 file-integrity demonstration.
- View-only sharing interface with simulated expiry and revocation controls.

Parcel creation and editing, plot-image upload, document upload, and persistence should be considered implemented only to the extent that they are available and tested in the current build. The prototype is not connected to production cloud document storage.

A matching SHA-256 hash indicates consistency with a stored reference hash. It does not establish government authenticity, legal ownership, or document validity.

### Module 3 — ভূমিসাথী
*BhumiSathi Assistant*

BhumiSathi is designed to help users understand land-related information and follow relevant administrative steps.

**Demonstration capabilities**

- Bengali-first land-information assistance with optional English.
- Frequently asked questions and guided explanations.
- Example document-question workflows.
- Step-by-step citizen action checklists.
- References to selected public official sources.

Responses that rely on predefined or synthetic examples are demonstrations, not live government verification or professional legal advice. Live AI inference and document-processing services should not be claimed unless they are actually connected and tested.

---

## 4. How the Prototype Works

The current frontend demonstrates the following general workflow:

1. **Select or review a parcel:** Open an example land record.
2. **Explore the history:** Review the ownership graph, transaction timeline, and relevant record details.
3. **Run screening rules:** Evaluate the available synthetic data for potential inconsistencies.
4. **Test a proposed transaction:** Enter the proposed transfer details where the simulator is available.
5. **Review the result:** Inspect calculations, explanations, and relevant record references.
6. **Export or organize information:** Use available report, CSV, Wallet, and document-management demonstrations.

### High-Level Architecture

```text
React + TypeScript Frontend
             |
             v
       BhumiDisha UI
             |
       +-----+----------------+
       |                      |
       v                      v
Land Verification       Land Wallet and
Module                  BhumiSathi Module
       |                      |
       v                      v
Synthetic Records       Mock Document Data
       |
       v
Explainable Rule Engine
       |
       v
Findings, Timeline,
Calculations and Reports
```

The current prototype uses sample data and frontend-side logic. It does not claim to access nationwide land transactions or live government databases.

---

## 5. Proposed Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface and reusable components |
| TypeScript | Typed application logic |
| Vite | Development server and production build |
| Tailwind CSS | Styling and responsive layouts |
| `@xyflow/react` | Interactive ownership graph |
| Web Crypto API | Client-side SHA-256 demonstration |
| Web Speech API | Browser-based voice summary where supported |
| Mock services and synthetic datasets | Frontend demonstrations and rule evaluation |
| GitHub | Source-code repository and version control |
| Vercel | Frontend hosting and deployment |

The architecture is intended to support later integration of a database, authenticated document storage, and authorized external data sources. Such integrations are not claimed to be active in the current prototype.

---

## 6. Data Sources

### Public Official References

The following publicly available sources inform land-related terminology, record-field mapping, administrative workflow design, and rule development.

- [Ministry of Land — Manuals](https://land.gov.bd/manual)
- [e-Mutation — Official Instructions](https://mutation.land.gov.bd/nirdeshika)
- [e-Mutation — Public Query and Record-Field Information](https://mutation.land.gov.bd/query)
- [Land Development Tax — Manuals](https://ldtax.gov.bd/manual)
- [Land Development Tax — Official Portal](https://ldtax.gov.bd/)
- [State Acquisition and Tenancy Act, 1950](https://bdlaws.minlaw.gov.bd/act-print-241.html)
- [Land Crimes Prevention and Remedy Act, 2023](https://bdlaws.minlaw.gov.bd/act-print-1454.html)
- [Immovable Property Acquisition and Requisition Act, 2017](https://bdlaws.minlaw.gov.bd/act-print-1220.html)

These sources are reference materials. They do not provide the prototype with access to live land transactions or a nationwide government dataset.

No government website is claimed to be scraped or bulk-downloaded for this project.

### Prototype and Evaluation Data

The demonstration uses fictional or synthetic examples, including:

- Parcel and dag identifiers.
- Khatian and deed references.
- Owner personas.
- Transfer events and ownership shares.
- Mutation-status examples.
- Incomplete-record and conflict scenarios.
- Sample documents and document metadata.

No real citizens' NID numbers, personal phone numbers, or real land records should be used in the demonstration.

Synthetic records are designed to illustrate the screening mechanism; they must not be confused with official government records.

---

## 7. AI Tools Used
- **Google Flow:** Used to generate the Bangladesh countryside hero video.
- **ChatGPT & Claude:** Used for project planning, requirements refinement,  documentation, and design/code-review assistance.

AI tools supported the development process. The team remains responsible for reviewing, understanding, testing, and presenting the submitted implementation.

---

## 8. Local Development

### Prerequisites

- Node.js 18 or later.
- Bun or npm.
- Git, if cloning the repository.

The repository contains a `bun.lock` file, so Bun is a suitable package-manager option.

### Option A — Bun

Install Bun if it is not already installed. Then run:

```bash
bun install
bun run dev
```

Open the local URL printed in the terminal.

To create a production build:

```bash
bun run build
```

### Option B — npm

Alternatively, if you use npm and the corresponding scripts are available in `package.json`:

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

Check `package.json` for the exact available scripts before running optional commands such as linting or type checking.

Do not create or commit real API keys, passwords, or credentials in the repository. Check `.env.example` for any project-specific configuration requirements.

---

## 9. Deploy to Vercel

The frontend can be deployed using the GitHub repository and Vercel's Git integration.

1. Push the project to GitHub.
2. Open [Vercel](https://vercel.com/dashboard).
3. Select **Add New Project**.
4. Import the BhumiDisha repository.
5. Confirm that Vercel detects the correct frontend framework.
6. Verify the build command and output directory against the project's actual configuration.
7. Deploy the project.
8. Open the generated deployment URL and test the public homepage, authentication simulation, dashboard, three modules, and report actions.

For a standard Vite configuration, the build command is usually `npm run build` or `bun run build`, and the output directory is commonly `dist`. Confirm these values against the current project before deployment.

### Live Demo

Add the actual Vercel URL after deployment:

`[Add deployed Vercel URL here]`


---

## 10. Privacy, Safety and Limitations

- **Synthetic data:** The prototype uses fictional examples and is not an official source of land-record information.
- **Human review:** Screening identifies possible inconsistencies; it does not conclusively establish fraud, title validity, or legal ownership.
- **No live government integration:** Nationwide records, official verification APIs, and live government data access are not claimed.
- **SHA-256 limitations:** File-integrity comparison does not prove document authenticity or legal validity.
- **Simulated sharing:** View-only links, expiry, revocation, and access history are demonstrations unless enforced by a secured backend.
- **Prototype storage:** Frontend data and files are not equivalent to persistent, secure cloud storage. Do not use the demo for real confidential land documents.
- **Authentication:** Any frontend-only authentication or judge-demo access is simulated and is not production-grade access control.
- **Legal limitations:** BhumiDisha does not replace official record checks, professional legal advice, or verification by the relevant authorities.

### Data Declaration

All information, names, parcel identifiers, and deed references presented in this prototype are fictional and synthetic. They are not government records and must not be treated as legal documents. Future data integration may be considered only when authorized access, required permissions, and appropriate security safeguards are available.

---

## 11. Team and Mentors

Complete this section before submission with the verified information.

- **Team Name:** Khatian Squad
- **Team Members:** 
  Md Jitu Mia - Leads the Team, Researcher & Backend Developer.
  Jahid Hasan Joni - Frontend Developer & UI UX Designer
- **Mentor:** Md. Ferdouse Ahmed Foysal- Lecturer, Department Of CSE, Daffodil International University.

---

## 12. Hackathon Submission

- **Project:** BhumiDisha (ভূমিদিশা)
- **Competition:** LandTech 2026 — LandTech Innovation Hackathon
- **Selected Problem:** P3 — Catch Fraud & Double-Selling also working on P1 & p5
- **Code Repository:** This GitHub repository
- **Live Demo:** Add the actual Vercel URL after deployment

The concept note, source repository, README, deployed prototype, and demo video should describe the same project scope and avoid claiming features or integrations that have not been implemented and tested.

---

**BhumiDisha — জমির তথ্য, যাচাই ও সহায়তা—এক প্ল্যাটফর্মে।**
