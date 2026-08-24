from pydantic import BaseModel, Field
from typing import List, Optional

class EmailRequest(BaseModel):
    email_type: str = Field(default="professional", description="Category: 'professional', 'academic', 'job_application', 'follow_up', 'networking', 'leave_request', 'apology', 'thank_you'")
    recipient: str = Field(description="Who the email is being written to (e.g. 'Professor', 'Hiring Manager')")
    purpose: str = Field(description="Main goal or purpose of the email")
    context: str = Field(description="Background context and facts provided by the user")
    tone: str = Field(default="professional", description="Tone: 'professional', 'friendly', 'formal', 'casual', 'confident', 'persuasive', 'apologetic', 'concise'")
    length: str = Field(default="medium", description="Length: 'short', 'medium', 'detailed'")
    sender_name: Optional[str] = Field(default="Pranav", description="Name of the sender")
    sender_role: Optional[str] = Field(default=None, description="Role/title of the sender (e.g. 'Computer Science Student')")

class EmailResponse(BaseModel):
    subject: str = Field(description="Clear, compelling email subject line")
    greeting: str = Field(description="Salutation / Greeting line (e.g. 'Dear Professor Sharma,')")
    body: str = Field(description="Main body paragraphs of the email")
    closing: str = Field(description="Sign-off and closing line (e.g. 'Best regards,\\nPranav')")
    full_email: str = Field(description="Complete formatted email text ready to copy")
    alternative_subjects: List[str] = Field(default_factory=list, description="2-3 alternative subject line options")
    word_count: int = Field(default=0, description="Total word count of the generated email")

class RewriteRequest(BaseModel):
    email_subject: str = Field(description="Current subject line")
    email_body: str = Field(description="Current email body text")
    instruction: str = Field(description="Rewrite instruction: 'make_professional', 'make_friendly', 'make_concise', 'make_detailed', 'fix_grammar', 'make_persuasive', 'custom'")
    custom_instruction: Optional[str] = Field(default=None, description="Custom user rewrite prompt if instruction is 'custom'")
    sender_name: Optional[str] = Field(default="Pranav", description="Name of sender")

class IntentExtractRequest(BaseModel):
    natural_prompt: str = Field(description="Natural language request e.g. 'Ask professor for 2 day extension on assignment'")

class ExtractedIntentResponse(BaseModel):
    email_type: str
    recipient: str
    purpose: str
    context: str
    tone: str
    length: str

class EmailApiResponse(BaseModel):
    success: bool
    email: Optional[EmailResponse] = None
    extracted_intent: Optional[ExtractedIntentResponse] = None
    error: Optional[str] = None
    processing_time_sec: float = 0.0
