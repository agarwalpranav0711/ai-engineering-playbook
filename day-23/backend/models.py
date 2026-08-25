from pydantic import BaseModel, Field
from typing import List, Optional

class ActionItem(BaseModel):
    task: str = Field(description="Actionable task description")
    assignee: Optional[str] = Field(default="Unassigned", description="Name of person assigned to task, or 'Unassigned'")
    deadline: Optional[str] = Field(default="Not specified", description="Stated deadline/due date, or 'Not specified'")
    status: str = Field(default="pending", description="Task status: 'pending', 'in_progress', 'completed'")

class Decision(BaseModel):
    decision: str = Field(description="Agreed decision made during the meeting")
    context: Optional[str] = Field(default=None, description="Brief background or rationale behind the decision")

class MeetingSummary(BaseModel):
    title: str = Field(description="Descriptive meeting title synthesized from transcript")
    executive_summary: str = Field(description="High-level narrative summary of meeting purpose, discussion, and outcomes")
    key_points: List[str] = Field(default_factory=list, description="List of important individual facts and highlights")
    participants: List[str] = Field(default_factory=list, description="List of active meeting participants/speakers identified")
    topics: List[str] = Field(default_factory=list, description="Main topics and agenda items discussed")
    decisions: List[Decision] = Field(default_factory=list, description="Confirmed decisions agreed upon by participants")
    action_items: List[ActionItem] = Field(default_factory=list, description="Assigned action items with assignees and deadlines")
    risks: List[str] = Field(default_factory=list, description="Risks, blockers, or incomplete prerequisites flagged")
    open_questions: List[str] = Field(default_factory=list, description="Unresolved questions or follow-up items needing clarification")
    next_steps: List[str] = Field(default_factory=list, description="High-level next milestones following the meeting")

class SummarizeRequest(BaseModel):
    transcript: str = Field(description="Raw text transcript of the meeting")
    meeting_type: str = Field(default="general", description="Category: 'general', 'standup', 'project', 'interview', 'client'")
    summary_length: str = Field(default="medium", description="Length: 'short', 'medium', 'detailed'")

class SummarizeResponse(BaseModel):
    success: bool
    summary: Optional[MeetingSummary] = None
    strategy_used: str = Field(default="direct", description="Processing strategy: 'direct' or 'hierarchical_map_reduce'")
    error: Optional[str] = None
    processing_time_sec: float = 0.0
