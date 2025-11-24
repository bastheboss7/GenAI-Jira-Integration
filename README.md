# User Story to Tests

A full-stack application leveraging LLMs to convert user stories into structured test cases. This project uses a monorepo structure with a React frontend and a Node.js/Express backend.

## Features

- **User Story Input**: Interface to input user stories and acceptance criteria.
- **JIRA Integration**: Connect to JIRA to fetch assigned user stories and auto-populate details.
- **LLM Integration**: Uses Groq API to generate comprehensive test cases from user stories.
- **Test Case Management**: View and manage generated test cases.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript, Zod
- **Monorepo**: npm workspaces

## Prerequisites

- Node.js (v18+ recommended)
- npm
- [Groq API Key](https://console.groq.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd user-story-to-tests
   ```

2. Install dependencies (from the root directory):
   ```bash
   npm install
   ```

## Configuration

The backend requires environment variables to function correctly, specifically for the LLM integration.

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   *(Note: If `.env.example` does not exist, create `.env` manually)*

2. Add the following variables to `.env`:

   ```env
   # Required
   groq_API_KEY=your_groq_api_key_here

   # Optional (Defaults shown)
   groq_API_BASE=https://api.groq.com/openai/v1
   groq_MODEL=llama3-8b-8192
   PORT=8080
   CORS_ORIGIN=http://localhost:5173
   ```

## Running the Application

To start both the frontend and backend servers concurrently:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:8080](http://localhost:8080)

## JIRA Integration Usage

1.  Click the **"Connect JIRA"** button in the UI.
2.  Enter your JIRA credentials:
    *   **JIRA URL**: Your instance URL (e.g., `https://your-domain.atlassian.net`).
    *   **Email**: The email address you use to log in to JIRA.
    *   **API Token**: An API token generated from [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens).
3.  Once connected, select a user story from the dropdown.
4.  Click **"Link Story"** to fetch the Title, Description, and Acceptance Criteria.

## Project Structure

- `backend/`: Express API server and LLM integration logic.
- `frontend/`: React application for the user interface.
