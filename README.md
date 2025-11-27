# User Story to Tests

A full-stack app to convert user stories into structured test cases using LLMs, with React frontend and Node.js/Express backend.

## Features
- Input user stories and acceptance criteria
- JIRA integration: fetch and auto-populate stories
- LLM-powered test case generation (Groq API)
- View/manage generated test cases

## Tech Stack
- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript, Zod

## Quick Start
1. **Clone & Install**
   ```sh
   git clone <your-repo-url>
   cd <project-folder>
   npm install
   ```
2. **Configure**
   - Copy `.env.example` to `.env` and fill in required values (Groq API key, JIRA info, ports).
3. **Run**
   ```sh
   npm run dev
   ```
   - Frontend: http://localhost:5174 (or your configured port)
   - Backend: http://localhost:8090 (or your configured port)

## Port & CORS
- Change frontend port in `.env` (`FRONTEND_PORT`) and `frontend/vite.config.ts` uses it automatically.
- Backend CORS allows the frontend port set in `.env` (`CORS_ORIGIN`).
- If you see CORS errors, ensure both ports match and restart both servers.

## JIRA Usage
- Click "Connect JIRA" in the UI, enter your JIRA URL, email, and API token.
- Select and link a story to auto-fill details.

---
For more, see the full `PORT-AND-CORS-RESTRICTIONS.md`.
## Project Structure

- `backend/`: Express API server and LLM integration logic.
- `frontend/`: React application for the user interface.


## 📺 Video Demo

Watch a demo of the app in action:

[▶️ Click here to view the video demo](https://1drv.ms/v/c/215bad6897ca366e/IQDmuJ2XfBc_Q6JcVIa52P96AfZEBcWrGmtxw-lQNQCtlGE?e=myN3iS)
