## Domain-Specific AI Intake Agent (OpenMic) — Medical Use Case

This repo implements the assignment end-to-end using the Medical domain. It includes:

- Backend Node/Express server exposing required webhooks/APIs
- Next.js frontend for bot CRUD (OpenMic API) and call logs
- Clear pre-call, in-call function, and post-call webhook flows

### Project Structure

```
backend/   # Node/Express webhooks and demo data
frontend/  # Next.js 15 app (bot management UI and call logs)
```

### Prerequisites

- Node.js 18+
- An OpenMic account and API key (`https://chat.openmic.ai/signup` → create key)
- ngrok (to expose your local backend to OpenMic)

---

## 1) Backend (webhooks & demo APIs)

Location: `backend/`

Install & run:

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3001
```

Endpoints required by assignment:

- POST `/precall` — Pre-call webhook; returns dynamic patient variables
- POST `/getPatient` — In-call custom function; fetches patient by medicalID
- POST `/postcall` — Post-call webhook; persists call summary/transcript (in-memory)
- GET `/logs` — View saved call logs (in-memory)
- GET `/health` — Health check

Demo data is in `backend/data/patients.js`. Call logs are stored in-memory in `backend/data/store.js`.

Expose backend with ngrok (required to receive OpenMic webhooks):

```bash
ngrok http 3001
# copy the https URL, e.g., https://<ngrok-id>.ngrok.io
```

Configure these in OpenMic dashboard using your ngrok URL:

- Pre-call webhook: `https://<ngrok-id>.ngrok.io/precall`
- In-call function (custom function API): `https://<ngrok-id>.ngrok.io/getPatient` (POST, JSON body)
- Post-call webhook: `https://<ngrok-id>.ngrok.io/postcall`

Suggested in-call function request body (align with your prompt/variables):

```json
{ "medicalID": "{{medical_id}}" }
```

---

## 2) Frontend (Bot CRUD and Call Logs)

Location: `frontend/`

Environment variables:
Create `frontend/.env.local`:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_OPENMIC_API_KEY=YOUR_OPENMIC_API_KEY
```

Install & run:

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

What you can do in the UI:

- Bot Management (OpenMic API): list, create, update, delete bots (shows bot UIDs)
- Call Logs: displays saved logs (via post-call webhook) and details (transcript, summary, variables)

Notes:

- OpenMic APIs do not support a domain field. Domain behavior is encoded in the prompt (description).
- Webhook URLs are configured in the OpenMic dashboard (not via this UI).

---

## 3) OpenMic Bot Configuration (Medical)

Use OpenMic dashboard to create or edit your bot:

Minimum settings to demonstrate the assignment:

- Prompt (description):
  "You are a Medical Intake Agent. Introduce yourself, ask for the caller’s Medical ID or name. If a Medical ID is provided, call the custom function with { medicalID }. Use pre-call variables (name, age, lastVisit) if present. After the conversation, summarize and include allergies and medications."
- First message: Friendly greeting + request for Medical ID or name
- Voice/model/temperature: any
- Webhooks:
  - Pre-call webhook → your ngrok `/precall`
  - Post-call webhook → your ngrok `/postcall`
- Custom function:
  - Name: getPatient (or similar)
  - Method: POST
  - URL: your ngrok `/getPatient`
  - Body: `{ "medicalID": "{{medical_id}}" }` (ensure your prompt captures and stores `medical_id`)

Testing (no real phone call needed):

- Use OpenMic “Test Call” from the dashboard. During the call:
  - Agent introduces itself and asks for Medical ID/name
  - On ID, it calls the function to fetch patient details
  - Pre-call webhook provides dynamic variables
  - Post-call webhook sends summary/transcript to your backend

After test call:

- Open the frontend → Call Logs to see the captured log, transcript, summary, and variables

---

## Useful Commands

Backend:

```bash
cd backend && npm start
```

Frontend:

```bash
cd frontend && npm run dev
```

ngrok:

```bash
ngrok http 3001
```
