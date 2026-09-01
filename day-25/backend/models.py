from pydantic import BaseModel, Field
from typing import List, Optional

class Task(BaseModel):
    task: str = Field(description="Action item or task description")
    deadline: Optional[str] = Field(default="Not specified", description="Extracted task deadline or 'Not specified'")
    assignee: Optional[str] = Field(default="Unassigned", description="Extracted owner/person assigned or 'Unassigned'")
    status: str = Field(default="pending", description="Task status ('pending' or 'completed')")

class VoiceNotes(BaseModel):
    title: str = Field(description="Automatically generated title for the voice note")
    summary: str = Field(description="Executive summary synthesizing the main ideas spoken")
    key_points: List[str] = Field(default_factory=list, description="Bullet points of core takeaways")
    tasks: List[Task] = Field(default_factory=list, description="List of structured action items extracted from audio")
    decisions: List[str] = Field(default_factory=list, description="Confirmed decisions or agreements")
    deadlines: List[str] = Field(default_factory=list, description="Key target dates or timeframes mentioned")
    people: List[str] = Field(default_factory=list, description="Specific people, colleagues, or teams mentioned")
    questions: List[str] = Field(default_factory=list, description="Open questions, ambiguities, or items needing clarification")

class TranscriptRequest(BaseModel):
    transcript: str = Field(description="Raw or edited text transcript to synthesize into notes")
    note_style: str = Field(default="standard", description="Note style: 'standard', 'detailed', 'action_focused', 'study'")

class VoiceNotesResponse(BaseModel):
    success: bool
    transcript: str = Field(default="", description="The transcribed or edited text")
    notes: Optional[VoiceNotes] = Field(default=None, description="The synthesized structured VoiceNotes object")
    processing_time_sec: float = Field(default=0.0, description="Total backend processing time in seconds")
    error: Optional[str] = Field(default=None, description="Error message if operation failed")
