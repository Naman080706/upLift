<div align="center">
  <img src="frontend/public/Logo2_Dark.png" alt="HackWise 2.0 Logo" width="300" />
</div>

# HackWise 2.0: AI Startup Validation Engine 🚀

**Built by Team BitWizards | Vellore Institute of Technology (VIT)**  
*Developed for HackWise 2.0 Hackathon*

---

## 🌟 Overview
HackWise 2.0 is a premium AI-driven platform designed to de-risk startup ideas for founders and investors. By leveraging large language models (LLMs) and historical startup datasets, it provides instant, data-backed validation of business concepts, execution strategies, and market fit.

### Key Value Propositions:
- **Instant Analysis**: Get feasibility, innovation, and risk scores in seconds.
- **Historical Benchmarking**: Automatically matches your idea against 50,000+ historical startups to find analogies.
- **AI-Powered Enhancement**: Pivot your strategy with AI-driven execution tweaks.
- **Mobile-First Experience**: High-fidelity, responsive design for on-the-go validation.

---

## 🛠️ Features
- **Deterministic Scoring**: Tri-vector weighted algorithm measuring Feasibility, Innovation, and Risk.
- **Advanced Visualizations**: Interactive Plotly charts for Success Rate, Growth Trends, and Metric Breakdowns.
- **Full History**: Track every "Launch" and see how your ideas evolve over time.
- **PDF Reports**: Export comprehensive AI-generated reports with one click.
- **Secure Authentication**: Built-in Supabase Auth with Google OAuth support.

---

## 💻 Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion, Zustand.
- **Backend (Gateway)**: Node.js, Express.
- **AI Core**: Python, FastAPI, Uvicorn.
- **LLM Engine**: Groq (Llama 3.3 70B & 8B variants).
- **Database/Auth**: Supabase (PostgreSQL).
- **DevOps**: Unified shell-based launch sequence (`start.sh`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Groq API Key
- Supabase Project (URL & Service Role Key)

### Installation
1. Clone the repository.
2. Install dependencies for all tiers:
   ```bash
   # Root
   npm install
   # Backend
   cd backend && npm install
   # Frontend
   cd ../frontend && npm install
   # AI Engine
   cd ../ai_engine && pip install -r requirements.txt
   ```

### Running the Platform
Simply run the unified launch sequence:
```bash
./start.sh
```
The script will auto-discover your local IP and provide:
- **Local Link**: `http://localhost:3000`
- **Network Link**: `http://<YOUR_IP>:3000` (Access from your mobile device!)

---

## 🧙‍♂️ Team BitWizards (VIT)
Proudly developed by the BitWizards team at **Vellore Institute of Technology**.

- **Innovation & Execution**: Aiming to build tools that empower the next generation of founders.
- **Theme**: AI for Business & Productivity.

---

## 📄 License
This project was developed exclusively for HackWise 2.0. All rights reserved by Team BitWizards.

---

<div align="center">
  <img src="frontend/public/uplift_footer_darkmode.png" alt="BitWizards Footer Logo" width="200" />
  <p><i>Building the future of startup de-risking.</i></p>
</div>
