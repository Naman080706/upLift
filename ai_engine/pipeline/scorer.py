from typing import Dict

# Time pressure modifier table: [feasibility_delta, risk_delta, innovation_delta]
LAUNCH_MODIFIERS = {
    "1M": (-0.20, +0.20,  0.00),
    "2M": (-0.12, +0.12,  0.00),
    "6M": ( 0.00,  0.00,  0.00),  # baseline
    "1Y": (+0.05, -0.05, +0.03),
    "2Y": (+0.10, -0.10, +0.06),
}

class Scorer:
    def __init__(self):
        pass

    def calculate_scores(self, features: Dict, match_data: Dict, launch_period: str = "6M") -> Dict:
        market_fit = features.get("problem_clarity", 0.5)
        tech_feasibility = 1.0 - features.get("technical_complexity", 0.5)
        execution_complexity_inv = 0.7

        feasibility = (0.4 * market_fit) + (0.3 * tech_feasibility) + (0.3 * execution_complexity_inv)

        uniqueness = features.get("solution_uniqueness", 0.5)
        disruption = 0.6
        innovation = (0.7 * uniqueness) + (0.3 * disruption)

        competition = 0.6
        tech_risk = features.get("technical_complexity", 0.5)
        funding_risk = 0.4
        risk = (0.5 * competition) + (0.3 * tech_risk) + (0.2 * funding_risk)

        # Apply launch period time-pressure modifier
        fd, rd, ind = LAUNCH_MODIFIERS.get(launch_period, (0.0, 0.0, 0.0))
        feasibility = max(0.0, min(1.0, feasibility + fd))
        risk        = max(0.0, min(1.0, risk + rd))
        innovation  = max(0.0, min(1.0, innovation + ind))

        final_score = (feasibility + innovation + (1.0 - risk)) / 3.0

        return {
            "feasibility": round(feasibility, 2),
            "innovation":  round(innovation,  2),
            "risk":        round(risk,         2),
            "final_score": round(final_score,  2),
            "confidence":  round(match_data.get("success_rate", 0.5) / 100.0, 2)
        }
