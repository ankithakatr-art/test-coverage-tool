# Test Coverage Story Generator

A developer tool that analyzes your test files and surfaces untested scenarios — organized by feature area and ranked by severity.

**Live demo:** https://test-coverage-tool-1.onrender.com

---

## What it does

Paste any test file and get a plain-English report of what's missing. The tool reads your existing test coverage, identifies gaps, and explains why each missing scenario matters — so you know what to write next and why.

Most coverage tools tell you *how much* is tested. This tells you *what* isn't.

---

## Screenshots

> Add screenshots here after deploy

---

## Tech stack

**Frontend**
- React + Vite
- Vanilla CSS (monospace, utilitarian aesthetic)

**Backend**
- Node.js + Express
- OpenAI API (gpt-4o-mini)

**Deployment**
- Render (separate web service + static site from monorepo)

---

## How it works

1. User pastes a test file into the left pane
2. Frontend POSTs the raw test code to `/api/analyze`
3. Express server sends it to OpenAI with a structured prompt
4. OpenAI returns a JSON object with tested scenarios, untested scenarios, and severity ratings
5. Frontend renders the report in the right pane, grouped by feature area

```
test file → Express → OpenAI → structured JSON → React UI
```

---

## Running locally

**Prerequisites:** Node.js, an OpenAI API key

**Backend**
```bash
cd server
npm install
cp .env.example .env   # add your OPENAI_API_KEY
node index.js
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` requests to `localhost:3000`.

---

## Project structure

```
test-coverage-story/
├── server/
│   ├── index.js          # Express server, CORS, routing
│   └── routes/
│       └── analyze.js    # POST /api/analyze — OpenAI call + JSON parsing
├── client/
│   ├── src/
│   │   ├── App.jsx       # Split-pane UI, state management
│   │   └── App.css       # Monospace utilitarian styling
│   └── vite.config.js    # Dev proxy config
└── .gitignore
```

---

## Engineering decisions

**Why gpt-4o-mini?**
Fast enough for interactive use and cheap to run. The structured prompt constrains output to JSON, so model quality matters less than consistency — mini handles this well.

**Why a structured JSON prompt?**
Returning raw text and parsing it is fragile. Enforcing a schema in the system prompt (`"You must respond with valid JSON only"`) gives predictable output that maps directly to UI components.

**Why a monorepo with separate Render services?**
Keeps frontend and backend independently deployable. The static site deploys from `client/dist`, the web service runs the Express server — no coupling, no build-time surprises.

---

## What I learned

- Prompt design for structured output: specifying JSON schema in the system prompt is more reliable than asking for it in the user message
- Render monorepo deployment: setting root directory per service avoids the `build: command not found` trap
- ES module gotcha: instantiate OpenAI client inside the route handler, not at module load time — otherwise it runs before `dotenv.config()`

---
## Future improvements

- Support file upload (drag and drop a `.test.js` file)
- Export report as PDF or markdown
- Show overall coverage score
- Add syntax highlighting to the input pane
- Code Complexity Heatmap (Project 5)