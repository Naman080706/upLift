import os
import json
from groq import AsyncGroq
from typing import Dict, Any

class GroqAnalysisEngine:
    def __init__(self):
        self.client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"

    async def analyze(self, idea: str, launch_period: str = "6M", target_market: str = "Global") -> Dict[str, Any]:
        prompt = f"""You are an elite startup evaluator and venture capital analyst.
Analyze the following startup idea and provide a brutally honest, deeply researched, reality-grounded analysis. 

CRITICAL MANDATE: DO NOT GIVE GENERALIZED BUSINESS ADVICE OR DUMMY DATA. 
Every single point of analysis, every metric reasoning, and every comparison MUST explicitly reference the highly specific mechanics, target audience, technical constraints, and unique features of the exact INPUT IDEA provided. If the input is about AI-driven gardening, your reasoning must specifically discuss soil sensors, botanical AI models, hardware supply chains, etc. I want my input-specified analytic result in extreme detail. Pull from your extensive knowledge of real historical startups, successes, and failures in similar markets to construct exactly three deeply relevant comparison companies.

# INPUT
Idea: {idea}
Target Market: {target_market}
Target Launch Period: {launch_period}

# OUTPUT REQUIREMENTS
Output strictly in valid JSON format matching this exact schema:
{{
  "overall_score": <integer from 0-100 indicating overall viability>,
  "confidence_score": <float from 0.0-1.0 indicating how confident you are in this analysis based on market data>,
  "decision": <"BUILD", "VALIDATE", or "AVOID">,
  "metrics": {{
    "feasibility": {{
      "score": <float 0.0-1.0>,
      "reasoning": [
        {{
          "point": "<Short statement explicitly referencing the technical or operational feasibility of the input idea's specific mechanics>",
          "details": "<A robust, deeply analytical paragraph explaining exactly why this is the case based on the specific mechanics of the input idea>"
        }},
        {{
          "point": "<Short statement on go-to-market feasibility specifically tailored to the input idea>",
          "details": "<A robust paragraph explaining exactly why based on the input specifics>"
        }}
        ... (minimum 3 reasoning objects)
      ]
    }},
    "innovation": {{
      "score": <float 0.0-1.0>,
      "reasoning": [
        {{
          "point": "<Short statement on how the input idea's specific mechanic is novel or stagnant>",
          "details": "<Robust, deep analysis paragraph of this specific innovation point>"
        }}
        ... (minimum 3 reasoning objects)
      ]
    }},
    "risk": {{
      "score": <float 0.0-1.0>,
      "reasoning": [
        {{
          "point": "<Short statement on the greatest specific threat to this exact idea>",
          "details": "<Robust, deep analysis paragraph of the threat mechanics>"
        }}
        ... (minimum 3 reasoning objects)
      ]
    }}
  }},
  "comparison": {{
    "similar_startups": [
      {{
        "name": "<Real World Company Name>",
        "industry": "<Specific Industry>",
        "status": "<'Success' or 'Failed' - pick real historical outcomes>",
        "similarity": <float 0.0-1.0>,
        "key_difference": "<1 sentence concise differentiator strictly comparing their business model/tech to the INPUT IDEA>",
        "detailed_similarities": "<1 thorough paragraph explaining exactly what specific tech/market/GTM similarities exist between them and the INPUT IDEA.>",
        "detailed_differences": "<1 thorough paragraph explaining exactly how the INPUT IDEA deviates structurally, economically, or fundamentally from this company.>"
      }},
      ... (exactly 3 total valid real-world companies)
    ],
    "success_rate": <float 0.0-100.0, calculate realistic success rate of this general space based on historical data>,
    "failure_patterns": [
      "<specific failure reason 1>",
      "<specific failure reason 2>",
      "<specific failure reason 3>"
    ]
  }}
}}

Make sure your reasoning strings reference the specified launch period where applicable.
Only return valid JSON, nothing else before or after.
"""

        try:
            chat_completion = await self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a specialized JSON-only startup analysis endpoint. Always return valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=self.model,
                response_format={"type": "json_object"},
                temperature=0.4, # Moderate temp to allow more score variance
            )
            
            raw_response = chat_completion.choices[0].message.content
            parsed_json = json.loads(raw_response)
            parsed_json["launch_period"] = launch_period
            
            return parsed_json

        except Exception as e:
            print(f"Groq API Error: {e}")
            raise e

    async def enhance(self, idea: str, startup_type: str = "SaaS", target_market: str = "Global") -> dict:
        prompt = f"""You are an elite startup strategist and product pivot advisor.

A founder has submitted their startup idea for AI enhancement. Your job is to identify the SINGLE BEST strategic pivot or execution improvement that dramatically increases success odds — WITHOUT changing the core idea.

# INPUT
Idea: {idea}
Startup Type: {startup_type}
Target Market: {target_market}

# OUTPUT REQUIREMENTS
Return strictly valid JSON matching this exact schema:
{{
  "enhanced_idea": {{
    "pivot_angle": {{
      "title": "<A sharp, punchy 6-10 word title for the strategic pivot>",
      "description": "<2-3 sentences explaining the pivot with specific reference to the idea's mechanics>"
    }},
    "repositioned_target_market": "<The refined, more specific customer segment that maximizes traction>",
    "monetization_tweak": "<A specific pricing or revenue model change that improves unit economics>",
    "why_this_works_better": "<2-3 sentences explaining why this execution angle outperforms the original with market evidence>"
  }},
  "suggestions": [
    "<Concrete actionable step 1 specific to this idea>",
    "<Concrete actionable step 2 specific to this idea>",
    "<Concrete actionable step 3 specific to this idea>",
    "<Concrete actionable step 4 specific to this idea>",
    "<Concrete actionable step 5 specific to this idea>"
  ],
  "enhanced_score": <integer 0-100, projected score after applying these improvements>,
  "enhanced_feasibility": <integer 0-100>,
  "enhanced_innovation": <integer 0-100>
}}

Only return valid JSON, nothing else.
"""
        try:
            chat_completion = await self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a JSON-only startup enhancement advisor. Always return valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=self.model,
                response_format={"type": "json_object"},
                temperature=0.4,
            )

            raw_response = chat_completion.choices[0].message.content
            return json.loads(raw_response)

        except Exception as e:
            print(f"Groq Enhance Error: {e}")
            raise e
