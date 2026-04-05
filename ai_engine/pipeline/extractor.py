from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import json

class StartupFeatures(BaseModel):
    industry: str
    target_market: str
    problem_clarity: float = Field(..., ge=0, le=1)
    solution_uniqueness: float = Field(..., ge=0, le=1)
    monetization_strength: float = Field(..., ge=0, le=1)
    technical_complexity: float = Field(..., ge=0, le=1)
    revenue_model: Optional[str] = "Subscription"
    geography: Optional[str] = "Global"

class FeatureExtractor:
    def __init__(self):
        # In a real app, this would use an LLM (OpenAI/Claude)
        pass

    async def extract(self, idea_text: str, documents_text: str = "") -> StartupFeatures:
        # Simulate LLM extraction logic
        # This would normally be a structured LLM call
        return StartupFeatures(
            industry="B2B SaaS",
            target_market="Enterprise",
            problem_clarity=0.8,
            solution_uniqueness=0.6,
            monetization_strength=0.7,
            technical_complexity=0.5,
            revenue_model="Subscription",
            geography="North America"
        )
