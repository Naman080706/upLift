import os
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional, Dict
from dotenv import load_dotenv

load_dotenv()

from pipeline.extractor import FeatureExtractor
from pipeline.matcher import DatasetMatcher
from pipeline.scorer import Scorer
from pipeline.reasoning import ReasoningEngine
from pipeline.decision import DecisionEngine
from pipeline.enhancement import EnhancementEngine

from pipeline.groq_client import GroqAnalysisEngine

app = FastAPI(title="upLIFT AI Engine")

# Use Groq for full analysis
groq_engine = GroqAnalysisEngine()

# Keep enhancers or other parts if needed for /enhance
extractor = FeatureExtractor()
matcher = DatasetMatcher()
scorer = Scorer()
enhancer = EnhancementEngine()

class IdeaInput(BaseModel):
    idea: str
    startup_type: Optional[str] = "SaaS"
    target_market: Optional[str] = "Global"
    filters: Optional[Dict[str, str]] = {}
    launch_period: Optional[str] = "6M"

@app.get("/")
async def root():
    return {"status": "online", "message": "upLIFT AI Engine is running"}

@app.post("/analyze")
async def analyze_idea(input_data: IdeaInput):
    try:
        # 1. Use Groq to do everything end-to-end
        result = await groq_engine.analyze(
            idea=input_data.idea,
            launch_period=input_data.launch_period or "6M",
            target_market=input_data.target_market or "Global"
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/enhance")
async def enhance_idea(input_data: IdeaInput):
    try:
        enhancement = await groq_engine.enhance(
            idea=input_data.idea,
            startup_type=input_data.startup_type or "SaaS",
            target_market=input_data.target_market or "Global",
        )
        return enhancement
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
