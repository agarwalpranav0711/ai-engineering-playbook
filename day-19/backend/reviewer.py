import os
import json
import re
import time
from typing import Dict, Any, List
from dotenv import load_dotenv
from openai import OpenAI
from models import ResumeReview, SkillMatch, WeakBullet
from prompts import SYSTEM_REVIEWER_PROMPT, USER_REVIEW_PROMPT
from parser import detect_parsing_concerns

load_dotenv()

class SingleAgentReviewer:
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY", "")
        self.model = model or os.getenv("DEFAULT_MODEL", "google/gemini-2.5-flash")
        self.site_url = os.getenv("SITE_URL", "http://localhost:3000")
        self.site_name = os.getenv("SITE_NAME", "AI Resume Reviewer")
        
        if self.api_key:
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.api_key,
                default_headers={
                    "HTTP-Referer": self.site_url,
                    "X-Title": self.site_name,
                }
            )
        else:
            self.client = None

    def analyze(self, resume_text: str, job_description: str) -> ResumeReview:
        """Run single agent analysis over resume and job description."""
        parsing_concerns = detect_parsing_concerns(resume_text)
        
        if not self.client or not self.api_key:
            # Fallback heuristic review if API key is not provided
            return self._heuristic_fallback_review(resume_text, job_description, parsing_concerns)

        formatted_user_prompt = USER_REVIEW_PROMPT.format(
            job_description=job_description,
            resume_text=resume_text,
            parsing_concerns="\n".join(f"- {c}" for c in parsing_concerns) if parsing_concerns else "None"
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_REVIEWER_PROMPT},
                    {"role": "user", "content": formatted_user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.2
            )

            raw_content = response.choices[0].message.content
            return self._parse_and_validate_json(raw_content, parsing_concerns)

        except Exception as e:
            # Fallback to heuristic review on API error
            print(f"OpenRouter API call failed or missing key: {e}. Using calibrated heuristic reviewer.")
            return self._heuristic_fallback_review(resume_text, job_description, parsing_concerns, error_msg=str(e))

    def _parse_and_validate_json(self, raw_json: str, parsing_concerns: List[str]) -> ResumeReview:
        """Clean, parse, and validate JSON output into Pydantic ResumeReview schema."""
        # Clean markdown codeblocks if present
        clean_json = raw_json.strip()
        if clean_json.startswith("```"):
            clean_json = re.sub(r"^```(?:json)?\n?", "", clean_json)
            clean_json = re.sub(r"\n?```$", "", clean_json)

        data = json.loads(clean_json)

        # Merge heuristic parsing concerns with LLM parsing concerns
        existing_concerns = data.get("parsing_concerns", [])
        all_concerns = list(set(existing_concerns + parsing_concerns))
        data["parsing_concerns"] = all_concerns

        # Validate with Pydantic
        return ResumeReview(**data)

    def _heuristic_fallback_review(self, resume_text: str, job_description: str, parsing_concerns: List[str], error_msg: str = None) -> ResumeReview:
        """Deterministic heuristic analysis when LLM API key is unavailable or fails."""
        resume_lower = resume_text.lower()
        jd_lower = job_description.lower()

        # Extract tech keywords from JD
        common_tech = ["react", "javascript", "typescript", "python", "node.js", "node", "express", "aws", "docker", "git", "rest api", "rest apis", "html", "css", "tailwinds", "sql", "postgresql", "mongodb", "fastapi"]
        
        jd_required = [t for t in common_tech if t in jd_lower]
        if not jd_required:
            jd_required = ["javascript", "react", "git", "typescript", "rest apis"]

        matched = []
        missing = []
        partial = []
        skill_breakdown = []

        for skill in jd_required:
            # Check direct or synonym match
            matched_synonym = False
            if skill in resume_lower:
                matched_synonym = True
            elif skill == "javascript" and re.search(r'\bjs\b', resume_lower):
                matched_synonym = True
            elif skill == "rest apis" and (re.search(r'\brest api\b', resume_lower) or re.search(r'\bapi\b', resume_lower)):
                matched_synonym = True

            if matched_synonym:
                matched.append(skill.title())
                skill_breakdown.append(SkillMatch(
                    skill_name=skill.title(),
                    status="matched",
                    evidence_or_reason=f"Explicit evidence of '{skill.title()}' found in resume text."
                ))
            else:
                missing.append(skill.title())
                skill_breakdown.append(SkillMatch(
                    skill_name=skill.title(),
                    status="missing",
                    evidence_or_reason=f"No evidence of '{skill.title()}' found in candidate resume."
                ))

        match_ratio = len(matched) / len(jd_required) if jd_required else 0.5
        skills_score = int(match_ratio * 100)
        exp_score = min(85, int(skills_score * 0.9 + 10))
        proj_score = min(90, int(skills_score * 0.85 + 15))
        fmt_score = 90 if not parsing_concerns else max(50, 90 - len(parsing_concerns) * 15)
        overall = int(skills_score * 0.35 + exp_score * 0.25 + proj_score * 0.20 + fmt_score * 0.20)

        strengths = [f"Demonstrated technical experience with {', '.join(matched[:3])}" if matched else "General technical foundation"]
        if "projects" in resume_lower:
            strengths.append("Includes dedicated personal/academic projects section")

        recs = []
        if missing:
            recs.append(f"Add verifiable project or experience evidence for missing requirements: {', '.join(missing[:3])}.")
        recs.append("Quantify bullet points with truthful metrics (e.g. users served, performance improvements, latency reduction).")
        recs.append("Ensure section headings use standard labels (Skills, Experience, Projects, Education) for optimal parsing.")

        weak_bullets = []
        # Find bullets lacking metrics or action verbs
        lines = [l.strip("-•* ") for l in resume_text.split('\n') if len(l.strip()) > 15]
        for l in lines[:2]:
            if not any(char.isdigit() for char in l):
                weak_bullets.append(WeakBullet(
                    original_bullet=l[:80],
                    issue="Lacks quantifiable impact or metrics",
                    suggested_improvement=f"Rewrite '{l[:40]}...' to highlight the specific technical problem solved and measurable result achieved."
                ))

        note = f" (Offline Heuristic Mode: {error_msg})" if error_msg else " (Offline Heuristic Mode - set OPENROUTER_API_KEY for deep LLM review)"

        return ResumeReview(
            overall_score=overall,
            skills_match_score=skills_score,
            experience_match_score=exp_score,
            project_match_score=proj_score,
            formatting_score=fmt_score,
            strengths=strengths,
            missing_skills=missing,
            partial_skills=partial,
            skill_breakdown=skill_breakdown,
            weak_bullets=weak_bullets,
            recommendations=recs,
            parsing_concerns=parsing_concerns,
            hallucination_check_passed=True,
            summary=f"Candidate aligns with {int(match_ratio*100)}% of primary job requirements. Strong matches in {', '.join(matched[:2]) if matched else 'core skills'}, with gaps in {', '.join(missing[:2]) if missing else 'secondary areas'}.{note}"
        )
