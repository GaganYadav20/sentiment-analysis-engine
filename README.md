## 🧠 Sentiment Analysis Engine

> AI-powered multi-class sentiment analysis on product reviews using a fine-tuned BERT transformer model with a FastAPI backend and React dashboard.

---

## ✨ Features

- **Real-time Sentiment Analysis** — Analyze product reviews instantly with confidence scores
- **Multi-class Classification** — Positive, Neutral, and Negative sentiment detection
- **BERT Transformer Model** — Fine-tuned on product review data for high accuracy
- **Interactive Analytics Dashboard** — Charts, trends, and model performance metrics
- **CSV Batch Processing** — Upload datasets for bulk analysis with exportable results
- **JWT Authentication** — Secure user accounts with login/register
- **Dark/Light Mode** — Premium futuristic UI with theme switching
- **Production Docker Setup** — One-command deployment with docker-compose
- **ML Training Pipeline** — Complete fine-tuning scripts for custom models

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 · Vite · Tailwind CSS v4 · Framer Motion · Recharts · Lucide Icons |
| **Backend** | FastAPI · Python 3.11 · SQLAlchemy · Pydantic · Uvicorn |
| **ML/AI** | HuggingFace Transformers · PyTorch · BERT · Trainer API |
| **Database** | SQLite (dev) / PostgreSQL (production) |
| **Auth** | JWT (python-jose) · bcrypt (passlib) |
| **Deployment** | Docker · Vercel · Render/Railway · GitHub Actions |

---

## 📁 Project Structure

```
setim/
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── charts/            # Recharts visualization components
│   │   ├── context/           # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   ├── layouts/           # Page layouts
│   │   └── App.jsx            # Root component with routing
│   ├── vercel.json            # Vercel deployment config
│   └── Dockerfile             # Frontend container
│
├── backend/                   # FastAPI backend
│   ├── app/
│   │   ├── routes/            # API endpoint handlers
│   │   ├── services/          # Business logic (ML, auth)
│   │   ├── models/            # SQLAlchemy ORM models
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── config/            # Application settings
│   │   ├── database/          # DB connection and base
│   │   ├── utils/             # Dependencies and helpers
│   │   └── main.py            # FastAPI application
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── ml/                        # ML training pipeline
│   ├── preprocess.py          # Dataset preparation
│   ├── tokenizer.py           # BERT tokenization utilities
│   ├── train.py               # Fine-tuning with Trainer API
│   ├── evaluate.py            # Model evaluation metrics
│   └── inference.py           # Standalone inference script
│
├── docker-compose.yml         # Multi-service orchestration
└── .github/workflows/ci.yml   # CI/CD pipeline
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm**
- **Python 3.10+** and **pip**

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp .env.example .env

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The first start will download the BERT model (~500MB). The API will be available at `http://localhost:8000`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Analyze sentiment of a single text |
| `POST` | `/upload-csv` | Upload CSV for batch analysis |
| `GET` | `/analytics` | Get aggregated analytics data |
| `GET` | `/history` | Get prediction history (paginated) |
| `GET` | `/health` | API and model health check |
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Authenticate and get JWT |
| `GET` | `/auth/me` | Get current user profile |

### Example Request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "This product is absolutely amazing!"}'
```

### Example Response

```json
{
  "sentiment": "Positive",
  "confidence": 0.9412,
  "scores": {
    "positive": 0.9412,
    "neutral": 0.0391,
    "negative": 0.0197
  },
  "processing_time_ms": 42.15,
  "text": "This product is absolutely amazing!"
}
```

---

## 🧪 ML Training Pipeline

Train a custom sentiment model on your own data:

```bash
cd ml

# 1. Preprocess dataset (downloads IMDB)
python preprocess.py

# 2. Fine-tune BERT
python train.py --epochs 3 --batch_size 16 --lr 2e-5

# 3. Evaluate model
python evaluate.py --model_path saved_model/best

# 4. Test inference
python inference.py --text "Great product, highly recommend!"
```

---

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

---

## ☁️ Cloud Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Set `VITE_API_URL` env var to your backend URL

### Backend → Render/Railway

1. Create a new web service
2. Set root directory to `backend`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
5. Set environment variables from `.env.example`

---

## 🏗️ Architecture

```
┌─────────────────┐     HTTP/JSON      ┌──────────────────┐
│   React + Vite  │ ←───────────────→ │    FastAPI        │
│   Dashboard     │                    │    Backend        │
│                 │                    │                   │
│ • Landing Page  │                    │ • /predict        │
│ • Dashboard     │                    │ • /analytics      │
│ • Analytics     │                    │ • /history        │
│ • About Model   │                    │ • /auth/*         │
│ • Auth Pages    │                    │ • /upload-csv     │
└─────────────────┘                    └──────┬───────────┘
                                              │
                                 ┌────────────┴────────────┐
                                 │                         │
                           ┌─────┴─────┐           ┌──────┴──────┐
                           │  SQLite   │           │  HuggingFace │
                           │  Database │           │  BERT Model  │
                           └───────────┘           └─────────────┘
```

---

## 🎨 UI/UX Design

- **Theme**: Dark cyberpunk with neon accents
- **Effects**: Glassmorphism cards, animated gradients, floating particles
- **Typography**: Inter (UI) + JetBrains Mono (code/numbers)
- **Charts**: Recharts with custom neon styling
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Responsive**: Mobile-first design with adaptive layouts

---

## 📊 Model Details

| Attribute | Value |
|-----------|-------|
| Base Model | `bert-base-uncased` (110M parameters) |
| Inference Model | `nlptown/bert-base-multilingual-uncased-sentiment` |
| Task | Multi-class sequence classification |
| Classes | Positive, Neutral, Negative |
| Max Sequence Length | 512 tokens |
| Framework | PyTorch + HuggingFace Transformers |

---

## 🔮 Future Improvements

- [ ] Voice input via Web Speech API
- [ ] WebSocket real-time streaming
- [ ] Multi-language support
- [ ] Aspect-based sentiment analysis
- [ ] Emotion detection (joy, anger, sadness, etc.)
- [ ] Toxicity detection
- [ ] LLM-powered explanations
- [ ] Admin dashboard with user management
- [ ] Rate limiting and API keys
- [ ] PostgreSQL for production

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  sentiment-analysis-engine
</p>
#   s e n t i m e n t - a n a l y s i s - e n g i n e 
 
 
