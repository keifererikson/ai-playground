# AI Model Playground

A full-stack, cloud-native application to configure, test, and compare various LLM providers in a single, clean interface.

**Live Demo:** [**aiplayground.keifer.dev**](https://aiplayground.keifer.dev)

---

![AI Playground Screenshot](.github/assets/ai-playground-screenshot.png)

## About This Project

This project is a personal, open-source portfolio piece designed to demonstrate the full-stack architecture and AI integration skills I applied in a proprietary commercial capstone project.

It is a complete, clean-room recreation of the concepts, built using public documentation, without referencing any proprietary code. The goal is to provide a working, interactive application that showcases my ability to architect, build, and deploy modern, cloud-native web applications from end to end.

## Core Features

- **Provider Selection:** Dynamically switch between multiple LLM providers (OpenAI, Gemini, Anthropic).
- **Model Selection:** The UI fetches and displays the available models for the currently selected provider in real-time.
- **Parameter Control:** Adjust the AI's `temperature` settings, which are persisted in a database.
- **Text Generation:** A "Playground" area to send prompts to the configured model and receive a response.
- **Embedding Generation:** A separate tab to generate and inspect vector embeddings for a given text input (for supported providers).
- **Stateful Configuration:** All settings are saved to a central PostgreSQL database, demonstrating a stateful backend.
- **Access Control:** The playground is "locked" until a user provides a valid Access Code (API key), which protects the backend endpoints from unauthorized use.

## Technology Stack & Architecture

This project is built on a modern, decoupled, cloud-native architecture.

- **Frontend:** **Next.js (React)** with TypeScript.
- **UI:** **Shadcn/UI** & **Tailwind CSS** for responsive components.
- **State Management:** React Context & Hooks (`SettingsContext.tsx`).
- **Backend:** **FastAPI (Python)**.
- **AI Integration:** A provider-based `LLMManager` using `langchain-openai`, `langchain-anthropic`, and `langchain-google-genai`.
- **Database:** **PostgreSQL** (hosted on Neon).
- **Containerization:** **Docker**.

### Architecture Overview

1. **Frontend (Vercel):** The Next.js application is deployed on Vercel, serving the production site at `aiplayground.keifer.dev`.
2. **Backend (Google Cloud Run):** The FastAPI backend is containerized with Docker and deployed as a serverless service on Google Cloud Run.
3. **Database (Neon):** The backend communicates with a serverless PostgreSQL database to persist the single-tenant settings.
4. **AI Providers:** The backend securely holds the API keys and communicates with the third-party LLM provider APIs (OpenAI, Google, etc.).

## Running Locally

This project is decoupled. You will need to run the backend and frontend in separate terminals.

### 1. Backend (FastAPI)

1. Clone the repository and navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv .venv && source venv/bin/activate` (On Windows, use `.venv\Scripts\activate`)
3. Install dependencies: `pip install -r requirements.txt`
4. Create a `.env` file and add your API keys:

   ```env
   # AI Provider Keys (at least one is required)
   OPENAI_API_KEY="sk-..."
   ANTHROPIC_API_KEY="sk-..."
   GEMINI_API_KEY="..."

   # Database (See app/database.py - defaults to a local sqlite file if unset)
   # DATABASE_URL="postgresql+asyncpg://user:pass@host/db"

   # Access Control
   PLAYGROUND_API_KEY="your-secret-access-code"
   ```

5. Run the server: `fastapi dev main.py`
6. The API will be live at `http://localhost:8000/docs`.

### 2. Frontend (Next.js)

1. In a new terminal, navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open `http://localhost:3000` in your browser.
5. The frontend will automatically connect to the backend running on port 8000.

## Deployment

This application is fully deployed to the cloud:

- **Backend (FastAPI):** The backend is containerized using **Docker** and deployed on **Google Cloud Run**.
- **Frontend (Next.js):** The frontend is deployed on **Vercel** and connected to the `aiplayground.keifer.dev` subdomain.
- **Database:** A serverless **PostgreSQL** instance is provided by Neon.

## License

This project is licensed under the MIT License.
