from pydantic import BaseModel, Field
from typing import List, Optional

class SkillMatch(BaseModel):
    skill_name: str = Field(description="Name of the skill assessed")
    status: str = Field(description="Match status: 'matched', 'partial', or 'missing'")
    evidence_or_reason: str = Field(description="Evidence found in resume or reason for missing status")

class WeakBullet(BaseModel):
    original_bullet: str = Field(description="The bullet text from resume identified as weak")
    issue: str = Field(description="Why this bullet is weak (e.g. lacks metrics, vague action)")
    suggested_improvement: str = Field(description="Actionable evidence-based bullet rewrite suggestion")

class ResumeData(BaseModel):
    candidate_name: Optional[str] = Field(default="Candidate", description="Name of candidate if found")
    contact_info: List[str] = Field(default_factory=list, description="Extracted contact info (email, github, etc.)")
    skills: List[str] = Field(default_factory=list, description="Extracted explicit skills")
    experience: List[str] = Field(default_factory=list, description="Extracted work experience entries")
    projects: List[str] = Field(default_factory=list, description="Extracted project descriptions")
    education: List[str] = Field(default_factory=list, description="Extracted education details")
    certifications: List[str] = Field(default_factory=list, description="Extracted certifications")

class JobDescription(BaseModel):
    role: str = Field(description="Target role title extracted from JD")
    required_skills: List[str] = Field(default_factory=list, description="Must-have required skills")
    preferred_skills: List[str] = Field(default_factory=list, description="Nice-to-have preferred skills")
    responsibilities: List[str] = Field(default_factory=list, description="Key duties and responsibilities")
    qualifications: List[str] = Field(default_factory=list, description="Required education or experience duration")

class ResumeReview(BaseModel):
    overall_score: int = Field(ge=0, le=100, description="Overall weighted AI match score (0-100)")
    skills_match_score: int = Field(ge=0, le=100, description="Score for skill alignment (0-100)")
    experience_match_score: int = Field(ge=0, le=100, description="Score for experience alignment (0-100)")
    project_match_score: int = Field(ge=0, le=100, description="Score for project relevance (0-100)")
    formatting_score: int = Field(ge=0, le=100, description="Resume parseability & clarity score (0-100)")
    
    strengths: List[str] = Field(description="Key strengths supporting job alignment")
    missing_skills: List[str] = Field(description="Required skills completely missing from resume")
    partial_skills: List[str] = Field(description="Skills partially demonstrated or lacking depth")
    skill_breakdown: List[SkillMatch] = Field(default_factory=list, description="Detailed per-skill evaluation")
    weak_bullets: List[WeakBullet] = Field(default_factory=list, description="Weak bullets and rewrite suggestions")
    recommendations: List[str] = Field(description="Actionable improvement recommendations")
    parsing_concerns: List[str] = Field(default_factory=list, description="Format or parsing risk flags")
    hallucination_check_passed: bool = Field(default=True, description="True if output relies only on resume evidence")
    summary: str = Field(description="Executive summary of the candidate review")

class ReviewRequest(BaseModel):
    resume_text: Optional[str] = None
    job_description: str
    mode: str = "single"  # "single" or "multi_agent"

class ReviewResponse(BaseModel):
    success: bool
    review: Optional[ResumeReview] = None
    error: Optional[str] = None
    mode_used: str = "single"
    processing_time_sec: float = 0.0
