# EchoRights — Legal Awareness Platform

**Full-stack civic AI platform** built from the Stitch design system.  
Stack: **React + Vite + TailwindCSS** (frontend) · **FastAPI** (backend)

---

## Pages

| Route | Page |
|---|---|
| `/` | Home — hero, stats, categories, features |
| `/explorer` | Rights Explorer — search & browse by category |
| `/report` | File a Report — 3-step guided form |
| `/assistant` | AI Assistant — chat + voice input/output |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stats` | Platform stats |
| GET | `/api/rights` | All rights categories |
| GET | `/api/rights/{category}` | Rights by category (civil/labor/consumer/digital) |
| GET | `/api/rights/search?q=` | Search rights articles |
| POST | `/api/reports` | File an incident report |
| GET | `/api/reports/{id}` | Get report by ID |
| POST | `/api/assistant/query` | Ask AI assistant |
| GET | `/api/languages` | Available languages |

---

## Setup & Run

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Swagger docs at: http://localhost:8000/docs

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
App at: http://localhost:5173

The Vite dev server proxies `/api/*` → `http://localhost:8000`.

---

## Design System
- **Color palette**: EchoRights dark theme (midnight navy + slate blue primary + amber secondary + emerald tertiary)
- **Fonts**: Inter (headlines/labels) + Source Sans 3 (body)
- **Motion**: CSS animations — fadeUp, wave bars, pulse ring for voice
- **Elevation**: Tonal layering via surface-container variants
