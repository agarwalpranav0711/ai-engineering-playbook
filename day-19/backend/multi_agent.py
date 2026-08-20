import os
import json
import re
from typing import Dict, Any, List
from dotenv import load_dotenv
from openai import OpenAI
from models import ResumeReview, SkillMatch, WeakBullet
from prompts import (
    ANALYST_AGENT_PROMPT,
    MATCHER_AGENT_PROMPT,
    CRITIC_AGENT_PROMPT,
    FINAL_REVIEWER_PROMPT,
    SYSTEM_REVIEWER_PROMPT
)
from parser import detect_parsing_concerns
from reviewer import SingleAgentReviewer

load_dotenv()

class MultiAgentReviewer:
    """Multi-Agent Team Reviewer simulating collaborative pipeline: Analyst -> Matcher -> Critic -> Final Reviewer."""
    
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY", "")
        self.model = model or os.getenv("DEFAULT_MODEL", "google/gemini-2.5-flash")
        self.single_agent = SingleAgentReviewer(api_key=self.api_key, model=self.model)
        
        if self.api_key:
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.api_key,
                default_headers={
                    "HTTP-Referer": os.getenv("SITE_URL", "http://localhost:3000"),
                    "X-Title": os.getenv("SITE_NAME", "AI Resume Reviewer Multi-Agent"),
                }
            )
        else:
            self.client = None

    def analyze(self, resume_text: str, job_description: str) -> ResumeReview:
        """Run multi-agent team review pipeline."""
        parsing_concerns = detect_parsing_concerns(resume_text)

        if not self.client or not self.api_key:
            # Fallback if no LLM key
            review = self.single_agent.analyze(resume_text, job_description)
            review.summary += " [Evaluated via Multi-Agent Team Architecture Simulation]"
            return review

        try:
            # Step 1: Analyst Agent extracts candidate structure
            analyst_res = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": ANALYST_AGENT_PROMPT},
                    {"role": "user", "content": f"Extract candidate profile from this resume:\n\n{resume_text}"}
                ],
                temperature=0.1
            )
            candidate_profile = analyst_res.choices[0].message.content

            # Step 2: Matcher Agent compares against JD
            matcher_res = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": MATCHER_AGENT_PROMPT},
                    {"role": "user", "content": f"Target Job Description:\n{job_description}\n\nCandidate Profile from Analyst:\n{candidate_profile}"}
                ],
                temperature=0.2
            )
            match_analysis = matcher_res.choices[0].message.content

            # Step 3: Critic Agent audits the match analysis
            critic_res = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": CRITIC_AGENT_PROMPT},
                    {"role": "user", "content": f"Audit this Match Analysis for potential hallucinations, missing JD requirements, or unfair scoring:\n\nResume Text:\n{resume_text}\n\nJD:\n{job_description}\n\nMatcher Analysis:\n{match_analysis}"}
                ],
                temperature=0.2
            )
            critic_feedback = critic_res.choices[0].message.content

            # Step 4: Final Reviewer synthesizes validated JSON
            final_prompt = f"""Synthesize the multi-agent findings into the final ResumeReview JSON object adhering strictly to anti-hallucination rules.

Analyst Output:
{candidate_profile[:500]}...

Matcher Output:
{match_analysis[:1000]}...

Critic Audit & Feedback:
{critic_feedback[:1000]}...

Parsing Concerns:
{parsing_concerns}
"""

            final_res = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_REVIEWER_PROMPT + "\n" + FINAL_REVIEWER_PROMPT},
                    {"role": "user", "content": final_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.2
            )

            raw_json = final_res.choices[0].message.content
            return self.single_agent._parse_and_validate_json(raw_json, parsing_concerns)

        except Exception as e:
            print(f"Multi-Agent pipeline API error: {e}. Falling back to single-agent reviewer.")
            return self.single_agent.analyze(resume_text, job_description)
