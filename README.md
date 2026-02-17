# AI-Powered Job Tracker

A full-stack SaaS application built with the MERN stack that helps users manage job applications and leverages AI to analyze resume-job description matching.

## Architecture

```text
Client (React + Vite + Tailwind CSS)
        ↓
Express API (Node.js)
        ↓
MongoDB (Atlas or In-Memory)
        ↓
AI Provider (pick one)
├── Claude (Anthropic)
├── OpenAI (GPT)
├── Gemini (Google)
├── DeepSeek
└── Ollama (Local)
```

## Features

- **User Authentication** — Register, login, and JWT-based session management
- **Job Tracking** — Create, read, update, and delete job applications
- **Status Management** — Track applications as Applied, Interview, Offer, or Rejected
- **Dashboard Analytics** — Visual stats summary with status-based filtering
- **AI Resume Matching** — Upload your resume (PDF or DOCX) to get an AI-powered match score and feedback against any job description
- **Multi-Provider AI** — Choose between Claude, OpenAI, Gemini, DeepSeek, or Ollama per analysis

## Supported AI Providers

| Provider | Model            | API Key Required | Notes                          |
| -------- | ---------------- | ---------------- | ------------------------------ |
| Claude   | claude-sonnet    | Yes              | Anthropic API                  |
| OpenAI   | gpt-4o-mini      | Yes              | OpenAI API                     |
| Gemini   | gemini-2.0-flash | Yes              | Google AI API                  |
| DeepSeek | deepseek-chat    | Yes              | OpenAI-compatible API          |
| Ollama   | llama3 (default) | No               | Runs locally, no cloud needed  |

## Project Structure

```text
ai-job-tracker/
├── client/                  # React Frontend
│   └── src/
│       ├── api/axios.js         # Axios instance with auth interceptor
│       ├── components/          # Navbar, JobCard, JobForm, ProtectedRoute
│       ├── context/             # AuthContext (login, register, logout)
│       └── pages/               # Login, Register, Dashboard, JobDetails
│
├── server/                  # Node + Express Backend
│   ├── config/db.js             # MongoDB connection (with in-memory fallback)
│   ├── controllers/             # Auth, Job, AI controllers
│   ├── middleware/              # JWT auth, error handling & file upload (multer)
│   ├── models/                  # User & Job Mongoose schemas
│   ├── routes/                  # Auth, Job, AI routes
│   ├── utils/aiService.js       # Multi-provider AI integration
│   ├── utils/extractText.js    # PDF & DOCX text extraction
│   └── server.js                # Express entry point
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account, local MongoDB, or none (in-memory mode available for testing)
- At least one AI provider API key (or Ollama installed locally)

### 1. Clone and configure

```bash
git clone <your-repo-url>
cd ai-job-tracker
```

Copy the environment template and fill in your values:

```bash
cp server/.env.example server/.env
```

> **Note:** If `MONGO_URI` is not set, the server automatically uses an in-memory MongoDB instance via `mongodb-memory-server`. This is useful for quick testing but data will not persist across server restarts.

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-job-tracker  # Optional — omit for in-memory testing
JWT_SECRET=your_jwt_secret_key_here

# Add keys only for the providers you want to use
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Ollama (local — no API key needed, just have Ollama running)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

| Variable            | Required | Description                                                                       |
| ------------------- | -------- | --------------------------------------------------------------------------------- |
| `MONGO_URI`         | No       | MongoDB connection string (Atlas or local). Falls back to in-memory DB if not set |
| `JWT_SECRET`        | Yes      | Any random string used to sign JWT tokens                                         |
| `ANTHROPIC_API_KEY` | No       | Only if using Claude provider                                                     |
| `OPENAI_API_KEY`    | No       | Only if using OpenAI provider                                                     |
| `GEMINI_API_KEY`    | No       | Only if using Gemini provider                                                     |
| `DEEPSEEK_API_KEY`  | No       | Only if using DeepSeek provider                                                   |
| `OLLAMA_BASE_URL`   | No       | Defaults to `http://localhost:11434`                                              |
| `OLLAMA_MODEL`      | No       | Defaults to `llama3`                                                              |

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Run the application

Start the backend and frontend in separate terminals:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client && npm run dev
```

## API Routes

| Method | Endpoint             | Description          | Auth     |
| ------ | -------------------- | -------------------- | -------- |
| POST   | `/api/auth/register` | Register a new user  | Public   |
| POST   | `/api/auth/login`    | Login                | Public   |
| GET    | `/api/auth/profile`  | Get user profile     | Required |
| GET    | `/api/jobs`          | Get all user jobs    | Required |
| POST   | `/api/jobs`          | Create a job         | Required |
| GET    | `/api/jobs/:id`      | Get a single job     | Required |
| PUT    | `/api/jobs/:id`      | Update a job         | Required |
| DELETE | `/api/jobs/:id`      | Delete a job         | Required |
| POST   | `/api/ai/analyze`    | AI resume analysis   | Required |

The `/api/ai/analyze` endpoint accepts a `multipart/form-data` request with a `resume` file (PDF or DOCX), a `jobId` field, and an optional `provider` field (`"claude"`, `"openai"`, `"gemini"`, `"deepseek"`, or `"ollama"`). Defaults to `"claude"` if not specified.

## Tech Stack

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| Frontend | React, Vite, Tailwind CSS                           |
| Backend  | Node.js, Express                                    |
| Database | MongoDB (Atlas, local, or in-memory), Mongoose      |
| Auth     | JWT, bcryptjs                                       |
| AI       | Claude, OpenAI, Gemini, DeepSeek, Ollama            |
| Upload   | Multer (memory storage), pdf-parse, mammoth         |
