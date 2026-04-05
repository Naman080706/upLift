from typing import List, Dict

LAUNCH_LABELS = {
    "1M": "1 Month",
    "2M": "2 Months",
    "6M": "6 Months",
    "1Y": "1 Year",
    "2Y": "2 Years",
}

LAUNCH_FEASIBILITY_NOTE = {
    "1M": "A 1-month timeline severely compresses MVP scope — feasibility is penalized by 20 points.",
    "2M": "2-month deadline creates high execution pressure; feasibility adjusted down by 12 points.",
    "6M": "6-month baseline gives balanced time for planning and execution.",
    "1Y": "A 1-year horizon allows iterative development, boosting feasibility by 5 points.",
    "2Y": "Long 2-year runway maximises team learning and product refinement (+10 feasibility).",
}

LAUNCH_RISK_NOTE = {
    "1M": "Compressed launch window drives risk up by +20 — team burn-out and missed deadlines are primary threats.",
    "2M": "Tight deadline elevates risk by +12. Cut feature scope aggressively to manage.",
    "6M": "Risk reflects standard market conditions with no timeline penalty applied.",
    "1Y": "Extended runway reduces time-pressure risk by 5 points — more time to identify and mitigate threats.",
    "2Y": "Long horizon yields a -10 risk reduction, though watch for market timing shifts over this period.",
}

class ReasoningEngine:
    def __init__(self):
        pass

    def generate_reasoning(self, scores: Dict, features: Dict, launch_period: str = "6M") -> Dict[str, List[str]]:
        label = LAUNCH_LABELS.get(launch_period, launch_period)
        reasoning = {
            "feasibility": [
                f"Market fit potential is high based on {features.get('target_market', 'target')} demand.",
                "Technical requirements are well-defined and achievable.",
                "Execution complexity is manageable for a small team.",
                LAUNCH_FEASIBILITY_NOTE.get(launch_period, ""),
            ],
            "innovation": [
                "Solution offers a significant improvement over legacy systems.",
                "Disruptive potential in the existing market landscape.",
                f"Unique value proposition identified — innovation score reflects a {label} build cycle.",
            ],
            "risk": [
                "Moderate competition from established players.",
                "Technical risk associated with infrastructure scaling.",
                "Funding requirements may be higher than average for this sector.",
                LAUNCH_RISK_NOTE.get(launch_period, ""),
            ]
        }
        return reasoning
