from typing import Dict

class DecisionEngine:
    def __init__(self):
        pass

    def decide(self, scores: Dict) -> str:
        final = scores.get("final_score", 0)
        risk = scores.get("risk", 1)
        
        if final > 0.75 and risk < 0.4:
            return "BUILD"
        elif final > 0.5:
            return "VALIDATE"
        else:
            return "AVOID"
