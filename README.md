# 🌾 KRISHI MITRA AI (ಕೃಷಿ ಮಿತ್ರ AI)

> **Voice-First Agricultural Government Scheme Assistant for Indian Farmers**  
> *Deterministic Decision Support • Natural Kannada & English Voice • Verified October 2026 Scheme Audits*

---

## 🚀 Overview

**KRISHI MITRA AI** is a production-grade decision-support system built for Indian farmers. Rather than an unconstrained chat wrapper, it uses a **deterministic Python eligibility engine** that maps farmer profile parameters (`district`, `land_area_acres`, `crops`, `ownership_type`, `has_irrigation`) to verified central and Karnataka state government schemes without hallucination.

### Key Capabilities
1. **Natural Kannada & English Voice Pipeline**:
   - Audio recording via browser `MediaRecorder` API.
   - Primary STT: Sarvam AI (`saarika:v2`) with editable live transcript preview.
   - Primary TTS: Sarvam AI (`bulbul:v1`) with Play/Pause/Replay audio controls.
   - **Zero-Failure Fallback**: Seamless fallback to browser-native Web Speech API (`SpeechRecognition` & `speechSynthesis`) when external API keys are unavailable.
2. **Progressive Slot-Filling Dialogue**:
   - Parses code-mixed Kannada and English farmer utterances using Google Gemini (via free Google AI Studio) with a deterministic regex/keyword fallback parser.
   - Generates targeted, non-repetitive follow-up questions for missing required slots with quick-reply action chips.
3. **Verified Government Scheme Dataset**:
   - **PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)**: ₹6,000/year DBT direct income support.
   - **PMFBY (Pradhan Mantri Fasal Bima Yojana)**: Comprehensive crop insurance with 1.5%–2% subsidized farmer premiums.
   - **3 Watermarked Prototype Schemes**: *Demo Micro-Irrigation Support*, *Demo Farm Mechanization*, *Demo Soil Improvement Support*, clearly tagged with prototype watermarks.
   - Includes official application URLs, toll-free helplines, audit check dates (*October 2026*), and required document checklists (Pahani/RTC, Aadhaar, Bank Passbook).
4. **Deterministic Python Eligibility Engine**:
   - Computes explicit status for each statutory rule: `satisfied`, `not_satisfied`, `unknown`, `not_applicable`.
   - Returns overall scheme status: `eligible`, `ineligible`, `needs_more_info`.
   - Verified by 17 unit tests covering edge cases (missing data, tenant exclusions, land size ceilings, tax-payer exclusions).
5. **Centralized Internationalization**:
   - Full dictionary coverage for Kannada (`kn`) and English (`en`).

---

## 📁 Project Architecture

```
KRISHIMITRA AI/
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   └── schemes.json         # PM-KISAN, PMFBY, and 3 demo schemes
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic v2 data models
│   │   ├── services/
│   │   │   ├── eligibility.py      # Deterministic Python rules engine
│   │   │   ├── schemes_service.py  # Scheme loader and retrieval
│   │   │   ├── gemini_extractor.py # Multilingual NLU & heuristic fallback
│   │   │   ├── conversation_manager.py # Progressive slot-filling
│   │   │   └── sarvam_service.py   # Sarvam STT & TTS integration
│   │   └── main.py                 # FastAPI application & endpoints
│   ├── tests/
│   │   ├── test_eligibility.py     # Deterministic rule engine tests (11 tests)
│   │   └── test_endpoints.py       # API endpoint & fallback tests (6 tests)
│   ├── main.py                     # Root uvicorn entrypoint
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Unified mobile-first dashboard
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── Header.tsx          # Branding, language toggle & health indicator
│   │   │   ├── FarmerProfileTracker.tsx # Slot-filling progress & edit modal
│   │   │   ├── ConversationFeed.tsx # Chat & audio playback
│   │   │   ├── VoiceInputBar.tsx   # Mic recording, timer, Web Speech fallback
│   │   │   ├── SchemeCard.tsx      # Rules breakdown & status cards
│   │   │   ├── EvidenceModal.tsx   # Document checklist & helpline dossier
│   │   │   └── DisclaimerFooter.tsx# Statutory disclaimer & links
│   │   ├── lib/
│   │   │   ├── api.ts              # Backend API client
│   │   │   └── i18n.ts             # Centralized Kannada & English dictionaries
│   │   └── types/
│   │       └── index.ts            # TypeScript interfaces
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Configure Environment Variables
Copy `.env.example` to `backend/.env`:
```bash
cp .env.example backend/.env
```
Fill in your API keys (optional: app runs with full deterministic fallback even without keys):
```ini
GEMINI_API_KEY=your_gemini_api_key_here
SARVAM_API_KEY=your_sarvam_api_key_here
```

### 3. Run Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- API Documentation: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/health`

### 4. Run Tests (Pytest)
```bash
$env:PYTHONPATH="backend"
python -m pytest backend/tests/ -v
```
*Result: 17 passed in <1s.*

### 5. Run Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:3000`

---

## 🐳 Containerization (Docker Compose)

To run the entire multi-service stack with a single command:
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

---

## 🛡️ Statutory Disclaimer
Krishi Mitra AI is an assistive decision-support tool. Eligibility evaluations are generated using deterministic logic mapped to verified government guidelines as of October 2026. Final benefit approval and DBT transfers remain subject to physical verification at local Raitha Samparka Kendras, Grama One, or respective official portals.

