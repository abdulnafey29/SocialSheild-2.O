# SocialShield 2.0
### Social Engineering Detection & Cybersecurity Awareness Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite + SQLAlchemy](https://img.shields.io/badge/Database-SQLite%20%2B%20SQLAlchemy-003B57?logo=sqlite&logoColor=white)](https://www.sqlalchemy.org/)
[![Pytest](https://img.shields.io/badge/Testing-Pytest-0A9EDC?logo=pytest&logoColor=white)](https://pytest.org/)

---

## 1. Project Overview

**SocialShield 2.0** is an interactive, full-stack cybersecurity defense platform designed to detect, analyze, and train users against human-centric social engineering attacks. Developed as a college capstone cybersecurity project, SocialShield 2.0 bridges technical detection tooling with behavioral cyber defense training.

Rather than relying on opaque "black box" claims or superficial mockups, SocialShield 2.0 implements **deterministic, explainable rule-based heuristic engines**, **offline lexical URL decomposition**, **RFC 822 email authentication parsing**, and an **interactive simulated phishing lab** backed by a persistent SQLite database.

### Key Objectives
1. **Explainable Threat Detection:** Provide numerical risk scoring (0–100) paired with granular linguistic indicator explanations rather than arbitrary binary flags.
2. **Offline Safety & SSRF Resilience:** Inspect submitted URLs and email headers completely offline without visiting malicious infrastructure or downloading payloads.
3. **Behavioral Cyber Defense:** Deliver an interactive 6-scenario simulator and 8-module awareness curriculum with immediate tactical feedback.
4. **Local Incident Operations:** Provide an internal educational reporting and SOC triage workflow with lifecycle status management.

---

## 2. Technology Stack & Architecture

### Frontend
- **Framework:** React 18 with Vite and TypeScript (strict typing).
- **Styling:** Tailwind CSS with a professional SOC cyber dark theme and responsive light mode support.
- **Visualizations:** Recharts (Area charts, Bar charts, Donut distribution charts).
- **Iconography:** Lucide React.
- **Client Networking:** Typed fetch client with graceful API error interception and health monitoring.

### Backend
- **Framework:** Python FastAPI (asynchronous ASGI framework).
- **Database:** SQLite 3 via SQLAlchemy ORM (parameterized queries, relationship models).
- **Validation:** Pydantic v2 schemas for strict input/output contract enforcement.
- **Testing:** Pytest with HTTPX TestClient covering all detectors and API routes.

### System Architecture & Data Flow

```
+-------------------------------------------------------------------------+
|                          BROWSER FRONTEND (React)                       |
|   +-------------------+  +------------------+  +--------------------+   |
|   | Phishing Detector |  | URL Analyzer     |  | SE Simulator Lab   |   |
|   +-------------------+  +------------------+  +--------------------+   |
|   +-------------------+  +------------------+  +--------------------+   |
|   | Header Inspector  |  | Training Academy |  | Incident Portal    |   |
|   +-------------------+  +------------------+  +--------------------+   |
+------------------------------------+------------------------------------+
                                     |  REST API / JSON
                                     v
+-------------------------------------------------------------------------+
|                         FASTAPI BACKEND (Python)                        |
|                                                                         |
|  [ API Router Layer ]                                                   |
|    - /api/analyze/*    - /api/training/*    - /api/incidents/*          |
|    - /api/dashboard/*  - /api/analytics/*                               |
|                                                                         |
|  [ Detection Engines ]                                                  |
|    - MessageDetector (7 Rule Families + Synergy Synergy Correlation)    |
|    - UrlDetector (Offline Syntactic, Subdomain & TLD Heuristics)        |
|    - HeaderDetector (From/Reply-To, Return-Path, SPF/DKIM/DMARC)        |
|                                                                         |
|  [ SQLAlchemy ORM Layer ]                                               |
|    - AnalysisRecord    - ScenarioAttempt    - IncidentReport            |
|    - UserProgress                                                       |
+------------------------------------+------------------------------------+
                                     |
                                     v
                 +---------------------------------------+
                 |          SQLite 3 Database            |
                 |  (Parameterized, Local Storage)       |
                 +---------------------------------------+
```

---

## 3. Module Breakdown

### Module A: Phishing Message Detector (`/messages`)
- **Text Engine:** Inspects emails, SMS, and chats up to 10,000 characters.
- **7 Modular Rule Families:**
  1. *Urgency & Coercive Deadlines* (e.g. "within 2 hours", "account terminated")
  2. *Credential & Authentication Harvesting* (e.g. passwords, PINs, OTP codes)
  3. *Financial Demands & Gift Cards* (e.g. wire transfers, gift cards, payroll modifications)
  4. *Authority Impersonation* (e.g. IT helpdesk, Microsoft 365, executive travel)
  5. *Secrecy & Process Circumvention* (e.g. "keep confidential", "do not call")
  6. *Unrealistic Lures & Rewards* (e.g. lottery prizes, unclaimed grants)
  7. *Suspicious Link Patterns* (e.g. IP addresses, shorteners, low-reputation TLDs)
- **Contextual Synergy Scoring:** Multi-indicator combinations (such as urgency paired with credential prompts) escalate the threat score disproportionately.
- **Output:** Numerical score (0–100), Risk classification (LOW, MEDIUM, HIGH), exact matched snippets, plain-language explanations, actionable next steps, and SHA-256 content tracking.

### Module B: Suspicious URL Analyzer (`/urls`)
- **Offline Lexical Inspection:** Evaluates URLs safely without sending outbound network requests, eliminating SSRF (Server-Side Request Forgery) risks.
- **Heuristic Indicators:**
  - Raw IPv4 / IPv6 addresses as hosts
  - Misleading brand subdomains (e.g. `paypal.com.verify-account.xyz`)
  - Character substitutions / Typosquatting (e.g. `paypa1`, `micr0soft`)
  - Known link shorteners (`bit.ly`, `tinyurl.com`, `t.co`)
  - High-abuse TLDs (`.xyz`, `.top`, `.tk`, `.ml`, `.buzz`)
  - URL authority tricks utilizing user info before `@` symbol
  - Cleartext HTTP vs. TLS/HTTPS encryption status
  - Executable payload targets (`.exe`, `.scr`, `.bat`, `.apk`)
- **Core Security Advisory:** Clear explanation in UI that HTTPS encrypts connection transit but does **not** authenticate site trustworthiness.

### Module C: Interactive Social Engineering Simulator (`/simulator`)
- **6 Realistic Scenario Labs:**
  1. *IT Infrastructure Upgrade & MFA Reset* (Email phishing)
  2. *Postal Courier Unpaid Customs & Fee Exception* (Smishing SMS)
  3. *Bank Fraud Monitor & Transaction Cancellation* (SMS / Call trap)
  4. *Inbound Technical Support Remote Access Trap* (Voice vishing)
  5. *High-Paying Remote Internship Equipment Check* (Employment advance-fee scam)
  6. *CEO Urgent Gift Cards for Client Meeting* (Executive pretexting / BEC)
- **Interactive Mechanics:** Multi-step option selection, instant scoring, red flag dissection, tactical manipulation explanations, running score tracker, and performance rating summary.

### Module D: Email Trust & Header Analyzer (`/headers`)
- **RFC 822 / 5322 Parsing:** Standard email parser extracting headers.
- **Authentication Analysis:**
  - `From:` vs. `Reply-To:` domain discrepancy detection
  - `From:` vs. `Return-Path:` bounce-back address alignment
  - SPF (Sender Policy Framework) result evaluation (`pass`, `fail`, `softfail`, `none`)
  - DKIM (DomainKeys Identified Mail) cryptographic signature status
  - DMARC policy alignment status
  - `Received:` hop chain inspection tracing intermediate relay MTAs
- **Honest Evidence Principle:** Absence of headers is reported transparently without inventing fictitious verdicts.

### Module E: Cybersecurity Awareness Training (`/training`)
- **8 Interactive Micro-Modules:**
  1. Phishing & Spear Phishing
  2. Smishing & Vishing
  3. Pretexting & Impersonation
  4. Baiting & Quid Pro Quo Attacks
  5. Business Email Compromise (BEC)
  6. Psychological Manipulation Techniques (Cognitive Biases)
  7. Password & Multi-Factor (OTP) Safety
  8. Incident Reporting & Incident Recovery
- **Curriculum Architecture:** Conceptual anatomy, fictional case studies, warning signs, defensive checklists, and 2-question knowledge check quizzes with database tracking.

### Module F: Security Incident Reporting Portal (`/incidents`)
- **Standardized Incident Submission:** Category, channel, approximate date/time, exposure checklist (clicked link, entered credentials, financial loss), and optional sanitized evidence.
- **Reference Tracking:** Generates unique tracking identifier (e.g. `INC-2026-A101`).
- **Simulated SOC Triage Queue:** Filterable status list (`Submitted`, `Under Review`, `Investigating`, `Resolved`, `False Positive`) with modal for updating status and entering triage notes.

### Module G: Reports & Learning Analytics (`/analytics`)
- **Visual Intelligence:**
  - Activity & Threat Trends over time (Area chart)
  - Risk Distribution breakdown (Donut chart)
  - Quiz Mastery across training modules (Horizontal Bar chart)
  - Threat Incidents by Channel (Bar chart)
- **Forensic CSV Export:** 1-click export of non-sensitive forensic records (ID, type, category, score, risk level, finding count, timestamp) omitting raw passwords or private text.

---

## 4. Setup and Installation

### Prerequisites
- **Python:** 3.10 or higher (Python 3.15 supported)
- **Node.js:** 18.0 or higher (Node v20+ recommended)
- **Package Managers:** `pip` and `npm`

---

### Step 1: Clone or Navigate to the Project

```bash
cd /Users/nafey/.gemini/antigravity/scratch/socialshield
```

---

### Step 2: Set Up Backend

1. Navigate to the backend directory and create a virtual environment:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

The backend starts at `http://localhost:8000`. Database tables and initial sample data will be automatically created in `socialshield.db` on first boot.

API documentation (Swagger UI) is available at:
👉 **`http://localhost:8000/docs`**

---

### Step 3: Set Up Frontend

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd /Users/nafey/.gemini/antigravity/scratch/socialshield/frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   👉 **`http://localhost:5173`**

---

## 5. Running the Test Suite

SocialShield 2.0 includes a comprehensive automated test suite built with Pytest.

To execute the test suite:
```bash
cd /Users/nafey/.gemini/antigravity/scratch/socialshield/backend
source venv/bin/activate
pytest
```

**Test Coverage Highlights:**
- `test_message_detector.py`: Validates high-risk phishing detection, BEC detection, benign email scoring, and empty string handling.
- `test_url_detector.py`: Verifies IP host extraction, brand subdomain spoofing, shortener detection, executable path detection, and auth trick syntax.
- `test_header_detector.py`: Tests SPF/DKIM/DMARC fail conditions, From vs. Reply-To divergence, and valid authentic headers.
- `test_api_endpoints.py`: Tests API health check, message analysis endpoint, URL analysis endpoint, header analysis endpoint, training quiz submissions, incident creation, status updating, and CSV report export.

---

## 6. API Endpoint Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/dashboard/summary` | Consolidated dashboard metrics & security tip |
| `POST` | `/api/analyze/message` | Analyzes text message with explainable rules |
| `POST` | `/api/analyze/url` | Safely evaluates URL syntax offline |
| `POST` | `/api/analyze/email-header` | Inspects raw RFC 822 email headers |
| `GET` | `/api/analysis/history` | Paginated forensic analysis log |
| `GET` | `/api/training/scenarios` | Retrieves 6 interactive SE scenarios |
| `POST` | `/api/training/submit-answer` | Grades scenario answer & updates score |
| `GET` | `/api/training/modules` | Retrieves 8 awareness lessons & quizzes |
| `POST` | `/api/training/submit-quiz` | Grades lesson quiz & tracks progress in DB |
| `GET` | `/api/training/progress` | Retrieves user curriculum completion state |
| `POST` | `/api/training/reset` | Resets training & simulator progress |
| `POST` | `/api/incidents` | Submits new incident report |
| `GET` | `/api/incidents` | Lists reported incidents with filters |
| `PATCH` | `/api/incidents/{id}` | Updates incident triage status & notes |
| `GET` | `/api/analytics` | Telemetry aggregation for charts |
| `GET` | `/api/analytics/export/csv` | Generates non-sensitive CSV export |

---

## 7. Security and Privacy Principles

As a cybersecurity academic platform, SocialShield 2.0 enforces defensive programming best practices:

1. **Zero Credential Collection:** The platform never requests, stores, or logs real user passwords, MFA codes, or financial cards.
2. **SSRF Mitigation:** URL analysis is 100% lexical and static. No outbound sockets, HTTP requests, or DNS queries are executed by the server.
3. **Data Redaction & Sanitization:** Message contents are stored with email addresses and telephone numbers redacted. Previews are limited to the first 110 characters.
4. **Transparent Heuristic Disclaimers:** Every detector explicitly communicates the limitations of rule-based scoring to prevent false confidence.
5. **Safe Content Rendering:** All user inputs are sanitized and rendered using React DOM escaping to eliminate Cross-Site Scripting (XSS).

---

## 8. Live Demonstration Script (College Presentation)

Follow this 5-minute walkthrough during your project demonstration:

### Part 1: Architecture & Dashboard (1 min)
1. Navigate to **Main Dashboard** (`http://localhost:5173`).
2. Point out the live connectivity pill in the top navbar (`API CONNECTED`).
3. Highlight the consolidated telemetry: total messages analyzed, threat distribution donut chart, and security tip of the day.

### Part 2: Phishing Detector (1.5 min)
1. Click **Phishing Detector** in the sidebar.
2. Under "LOAD FICTIONAL TEST SCENARIO", click **1. High Risk (IT MFA Reset)**.
3. Click **Analyze Message**.
4. Show the resulting radial **Risk Score (92)** and **HIGH RISK** badge.
5. Review the **Exact Indicators Detected** cards: show how the engine matched *"within 2 hours"* and *"verify your credentials"*.
6. Now click **5. Low Risk (Weekly Sprint Sync)** and run analysis to demonstrate that benign messages receive a Low Risk rating without false positives.

### Part 3: Suspicious URL Analyzer (1 min)
1. Click **URL Analyzer** in the sidebar.
2. Select sample: **Brand Subdomain Spoofing** (`paypal.com.account-verification-portal.xyz`).
3. Click **Analyze URL**.
4. Explain how the engine detected that `paypal` is in a subdomain while the registered root domain is `account-verification-portal.xyz`.
5. Emphasize the educational disclaimer: *"HTTPS encrypts the connection, but does not prove the site is safe."*

### Part 4: Interactive SE Simulator (1 min)
1. Click **SE Simulator Lab** in the sidebar.
2. Select **Scenario 1: Mandatory IT Infrastructure Upgrade**.
3. Choose the unsafe option (Clicking the link) to demonstrate the immediate red feedback and psychological tactic breakdown (Urgency / Fear).
4. Advance to **Scenario 6: Executive Impersonation (CEO Gift Cards)**. Choose the verified out-of-band response to demonstrate safe organizational behavior.

### Part 5: Incident Triage & Forensic Export (0.5 min)
1. Click **Incident Portal** to display the triage queue.
2. Click any incident to open the **Admin Triage Modal**, change status from `Submitted` to `Investigating`, and save.
3. Navigate to **Reports & Analytics** and click **Export CSV Report** to demonstrate compliant data export.

---

## 9. Academic Project Credits

- **Application Name:** SocialShield 2.0
- **Domain:** Social Engineering Detection & Cybersecurity Awareness
- **Target Audience:** College Students, Enterprise Employees, SOC Analysts
- **License:** MIT License (Open for Academic & Research Evaluation)
