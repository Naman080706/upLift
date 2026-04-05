import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List
import os
import math

class DatasetMatcher:
    def __init__(self):
        self.dataset_path = os.path.join(os.path.dirname(__file__), "../data/global_startups.csv")
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        self.df = None
        self.tfidf_matrix = None
        self._train_model()

    def _train_model(self):
        if not os.path.exists(self.dataset_path):
            print(f"Dataset not found at {self.dataset_path}")
            return
            
        try:
            self.df = pd.read_csv(self.dataset_path)
            
            # Create a rich semantic block for vectorization
            # Adding weights implicitly by repeating some fields if necessary, 
            # but standard concatenation is usually sufficient for tf-idf.
            self.df["semantic_body"] = (
                self.df["Industry"].fillna("") + " " +
                self.df["Target_Market"].fillna("") + " " +
                self.df["Product_Focus"].fillna("") + " " +
                self.df["Core_Problem"].fillna("") + " " +
                self.df["Solution"].fillna("")
            )
            
            # Fit and transform the entire corpus
            self.tfidf_matrix = self.vectorizer.fit_transform(self.df["semantic_body"])
            print(f"ML Model Trained: Indexed {len(self.df)} globally recognized startups.")
            
        except Exception as e:
            print(f"Error training model: {e}")
            self.df = None

    async def find_similar(self, features: Dict) -> Dict:
        """
        Takes the extracted features of an idea and finds the Top 3 semantically 
        similar historical startups, returning aggregate metrics.
        """
        if self.df is None or self.tfidf_matrix is None:
            # Fallback if CSV is missing
            return {
                "similar_startups": [
                    {"name": "Slack", "industry": "B2B SaaS", "status": "Success", "similarity": 0.85}
                ],
                "success_rate": 65.0,
                "failure_patterns": ["High CAC", "Market timing issues"]
            }

        # Build query string
        industry = features.get("industry", "")
        target_market = features.get("target_market", "")
        problem = features.get("problem_statement", "")
        innovation = features.get("innovative_aspect", "")
        
        query = f"{industry} {target_market} {problem} {innovation}"
        
        # Transform the single query using the fitted vectorizer
        query_vec = self.vectorizer.transform([query])
        
        # Compute cosine similarities against all startups
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # Get top 3 indices (sorted descending)
        top_indices = similarities.argsort()[::-1][:3]
        
        top_startups = []
        outcomes = []
        failure_patterns = []
        
        for idx in top_indices:
            row = self.df.iloc[idx]
            sim_score = float(similarities[idx])
            
            # Only include if there's actually a decent thematic match (> 0.05)
            if sim_score > 0.05:
                top_startups.append({
                    "name": str(row["Startup_Name"]),
                    "industry": str(row["Industry"]),
                    "status": str(row["Outcome"]),
                    "similarity": round(sim_score, 2)
                })
                outcomes.append(str(row["Outcome"]))
                
                if row["Outcome"] in ["Struggling", "Failed", "Dead"]:
                    # Synthesize a logic pattern based on the failed startup's metrics
                    if float(row["Risk_Score"]) > 0.8:
                        failure_patterns.append("Excessive execution risk and high capital barriers.")
                    elif float(row["Feasibility_Score"]) < 0.3:
                        failure_patterns.append("Lack of core tech feasibility or market readiness.")
                    else:
                        failure_patterns.append("Fierce competition from incumbents led to unit economics failure.")

        # Calculate a rough success rate from the broader top 10 matches
        extended_indices = similarities.argsort()[::-1][:10]
        extended_successes = sum(1 for i in extended_indices if self.df.iloc[i]["Outcome"] == "Success")
        # Ensure rate is between 15% and 85% for realism
        calculated_success_rate = min(85.0, max(15.0, (extended_successes / 10.0) * 100))
        
        # If no explicit failures found in top 3, provide generic industry advice
        if not failure_patterns:
            failure_patterns = [
                f"Saturated {industry} markets demand highly differentiated GTM strategies.",
                "Customer acquisition costs (CAC) might outpace Lifetime Value (LTV)."
            ]
            
        # Deduplicate failure patterns
        failure_patterns = list(set(failure_patterns))

        return {
            "similar_startups": top_startups,
            "success_rate": round(calculated_success_rate, 1),
            "failure_patterns": failure_patterns
        }
