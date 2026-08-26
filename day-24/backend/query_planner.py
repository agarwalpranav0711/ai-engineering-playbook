import os
import json
import re
from typing import List
from dotenv import load_dotenv
from openai import OpenAI
from prompts import SYSTEM_QUERY_PLANNER_PROMPT

load_dotenv()

class QueryPlanner:
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY", "")
        self.model = model or os.getenv("DEFAULT_MODEL", "google/gemini-2.5-flash")
        
        if self.api_key:
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.api_key
            )
        else:
            self.client = None

    def plan_queries(self, question: str, depth: str = "standard") -> List[str]:
        """Decomposes user question into 3-5 multi-perspective search queries."""
        if not self.client or not self.api_key:
            return self._heuristic_query_plan(question, depth)

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_QUERY_PLANNER_PROMPT},
                    {"role": "user", "content": f"Generate 3-5 search queries for research question: \"{question}\" (Depth: {depth})"}
                ],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            raw = response.choices[0].message.content
            clean = raw.strip()
            if clean.startswith("```"):
                clean = re.sub(r"^```(?:json)?\n?", "", clean)
                clean = re.sub(r"\n?```$", "", clean)
            
            data = json.loads(clean)
            queries = data.get("queries", [])
            if queries and isinstance(queries, list):
                return queries[:5]
            return self._heuristic_query_plan(question, depth)

        except Exception as e:
            print(f"Query planning API error: {e}. Using heuristic query plan.")
            return self._heuristic_query_plan(question, depth)

    def _heuristic_query_plan(self, question: str, depth: str) -> List[str]:
        """Deterministic query plan fallback."""
        q_clean = question.strip().rstrip("?")
        
        queries = [
            f"{q_clean} 2026 overview",
            f"{q_clean} technical research benchmark",
            f"{q_clean} software engineering adoption",
            f"{q_clean} limitations and risks"
        ]
        
        if depth == "quick":
            return queries[:2]
        elif depth == "deep":
            queries.append(f"{q_clean} academic study results")
            return queries
        return queries[:4]
