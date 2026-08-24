import os
import json
import re
import time
from typing import Dict, Any, List
from dotenv import load_dotenv
from openai import OpenAI

from models import (
    EmailRequest,
    EmailResponse,
    RewriteRequest,
    IntentExtractRequest,
    ExtractedIntentResponse
)
from prompts import (
    SYSTEM_EMAIL_GENERATOR_PROMPT,
    USER_EMAIL_PROMPT,
    SYSTEM_REWRITE_PROMPT,
    USER_REWRITE_PROMPT,
    SYSTEM_INTENT_EXTRACT_PROMPT
)

load_dotenv()

class EmailGeneratorEngine:
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY", "")
        self.model = model or os.getenv("DEFAULT_MODEL", "google/gemini-2.5-flash")

        if self.api_key:
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.api_key,
                default_headers={
                    "HTTP-Referer": os.getenv("SITE_URL", "http://localhost:3000"),
                    "X-Title": os.getenv("SITE_NAME", "AI Email Writer"),
                }
            )
        else:
            self.client = None

    def generate(self, req: EmailRequest) -> EmailResponse:
        """Generate structured email from guided inputs."""
        if not self.client or not self.api_key:
            return self._heuristic_fallback_generate(req)

        sender_name = req.sender_name or "Pranav"
        sender_role = f" ({req.sender_role})" if req.sender_role else ""

        user_prompt = USER_EMAIL_PROMPT.format(
            email_type=req.email_type,
            recipient=req.recipient,
            purpose=req.purpose,
            context=req.context,
            tone=req.tone,
            length=req.length,
            sender_name=sender_name,
            sender_role=sender_role
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_EMAIL_GENERATOR_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            raw_content = response.choices[0].message.content
            return self._parse_and_validate_json(raw_content)
        except Exception as e:
            print(f"OpenRouter Email API error: {e}. Switching to offline heuristic generator.")
            return self._heuristic_fallback_generate(req, error_msg=str(e))

    def rewrite(self, req: RewriteRequest) -> EmailResponse:
        """Rewrite an existing email based on instruction."""
        if not self.client or not self.api_key:
            return self._heuristic_fallback_rewrite(req)

        instruction_text = req.custom_instruction if req.instruction == "custom" and req.custom_instruction else req.instruction.replace('_', ' ')
        sender_name = req.sender_name or "Pranav"

        user_prompt = USER_REWRITE_PROMPT.format(
            instruction=instruction_text,
            email_subject=req.email_subject,
            email_body=req.email_body,
            sender_name=sender_name
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_REWRITE_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.3
            )
            raw_content = response.choices[0].message.content
            return self._parse_and_validate_json(raw_content)
        except Exception as e:
            print(f"OpenRouter Rewrite API error: {e}. Switching to offline fallback rewrite.")
            return self._heuristic_fallback_rewrite(req, error_msg=str(e))

    def extract_intent(self, req: IntentExtractRequest) -> ExtractedIntentResponse:
        """Extract structured parameters from a natural text prompt."""
        if not self.client or not self.api_key:
            return self._heuristic_fallback_intent(req.natural_prompt)

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_INTENT_EXTRACT_PROMPT},
                    {"role": "user", "content": f"Extract parameters from this prompt:\n\n\"{req.natural_prompt}\"\n\nReturn JSON: {{'email_type': '...', 'recipient': '...', 'purpose': '...', 'context': '...', 'tone': '...', 'length': '...'}}"}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            raw = response.choices[0].message.content
            clean = self._clean_json_str(raw)
            data = json.loads(clean)
            return ExtractedIntentResponse(
                email_type=data.get("email_type", "professional"),
                recipient=data.get("recipient", "Recipient"),
                purpose=data.get("purpose", req.natural_prompt),
                context=data.get("context", req.natural_prompt),
                tone=data.get("tone", "professional"),
                length=data.get("length", "medium")
            )
        except Exception:
            return self._heuristic_fallback_intent(req.natural_prompt)

    def _parse_and_validate_json(self, raw_json: str) -> EmailResponse:
        """Clean markdown wrapping and validate into Pydantic EmailResponse."""
        clean_json = self._clean_json_str(raw_json)
        data = json.loads(clean_json)
        
        # Calculate full email and word count if missing
        if "full_email" not in data or not data["full_email"]:
            greeting = data.get("greeting", "Dear Recipient,")
            body = data.get("body", "")
            closing = data.get("closing", "Best regards,")
            data["full_email"] = f"{greeting}\n\n{body}\n\n{closing}"

        words = len(data["full_email"].split())
        data["word_count"] = words

        return EmailResponse(**data)

    def _clean_json_str(self, text: str) -> str:
        clean = text.strip()
        if clean.startswith("```"):
            clean = re.sub(r"^```(?:json)?\n?", "", clean)
            clean = re.sub(r"\n?```$", "", clean)
        return clean

    def _heuristic_fallback_generate(self, req: EmailRequest, error_msg: str = None) -> EmailResponse:
        """Deterministic heuristic email generator when offline."""
        sender_name = req.sender_name or "Pranav"
        recipient = req.recipient or "Recipient"
        purpose = req.purpose or "Request Information"
        context = req.context or "I am writing regarding our recent discussion."
        tone = req.tone.lower()
        length = req.length.lower()

        # Subject line generation
        subject = f"{purpose.capitalize()}"
        if "extension" in purpose.lower():
            subject = "Request for Assignment Extension"
            alt_subjects = ["Extension Request Inquiry", "Additional Time Needed for Assignment"]
        elif "follow" in purpose.lower():
            subject = f"Following Up: {purpose.capitalize()}"
            alt_subjects = [f"Status Inquiry regarding {purpose}", "Quick Follow-Up"]
        else:
            alt_subjects = [f"Inquiry: {purpose}", f"Update regarding {purpose}"]

        # Greeting selection
        if tone in ["formal", "academic", "professional"]:
            greeting = f"Dear {recipient},"
            sign_off = f"Best regards,\n{sender_name}"
        elif tone in ["casual", "friendly"]:
            greeting = f"Hi {recipient},"
            sign_off = f"Best,\n{sender_name}"
        else:
            greeting = f"Hello {recipient},"
            sign_off = f"Sincerely,\n{sender_name}"

        # Body drafting based on length & context
        if length == "short":
            body = f"I hope this email finds you well. I am writing to {purpose.lower()}. {context}\n\nThank you for your time and consideration."
        elif length == "detailed":
            body = f"I hope you are doing well.\n\nI am writing to formally reach out regarding {purpose.lower()}.\n\nContext Details:\n{context}\n\nI appreciate your guidance and look forward to hearing your thoughts at your earliest convenience. Please let me know if you require any additional information."
        else:
            body = f"I hope you are doing well.\n\nI am writing to reach out regarding {purpose.lower()}. {context}\n\nThank you for your time, and I look forward to your response."

        full_email = f"{greeting}\n\n{body}\n\n{sign_off}"
        word_count = len(full_email.split())

        return EmailResponse(
            subject=subject,
            greeting=greeting,
            body=body,
            closing=sign_off,
            full_email=full_email,
            alternative_subjects=alt_subjects,
            word_count=word_count
        )

    def _heuristic_fallback_rewrite(self, req: RewriteRequest, error_msg: str = None) -> EmailResponse:
        """Deterministic heuristic email rewrite when offline."""
        inst = req.instruction.lower()
        sender_name = req.sender_name or "Pranav"
        body = req.email_body

        if "concise" in inst or "short" in inst:
            # Shorten body
            sentences = [s.strip() for s in body.split('.') if s.strip()]
            body = ". ".join(sentences[:2]) + "." if len(sentences) >= 2 else body
        elif "professional" in inst or "formal" in inst:
            body = body.replace("thanks", "thank you").replace("hey", "hello").replace("want to", "would like to")
            if not body.startswith("I hope this email finds you well"):
                body = "I hope this email finds you well.\n\n" + body
        elif "friendly" in inst or "warm" in inst:
            body = "I hope you're having a great week!\n\n" + body.replace("Dear", "Hi")

        greeting = "Dear Recipient," if "formal" in inst else "Hi there,"
        closing = f"Best regards,\n{sender_name}"
        full_email = f"{greeting}\n\n{body}\n\n{closing}"

        return EmailResponse(
            subject=req.email_subject,
            greeting=greeting,
            body=body,
            closing=closing,
            full_email=full_email,
            alternative_subjects=[req.email_subject, f"Updated: {req.email_subject}"],
            word_count=len(full_email.split())
        )

    def _heuristic_fallback_intent(self, natural_prompt: str) -> ExtractedIntentResponse:
        prompt_lower = natural_prompt.lower()
        
        recipient = "Professor Sharma" if "sharma" in prompt_lower else ("Professor" if "prof" in prompt_lower else ("Recruiter" if "recruit" in prompt_lower or "interview" in prompt_lower else "Hiring Manager"))
        email_type = "academic" if "prof" in prompt_lower or "assignment" in prompt_lower else ("job_application" if "interview" in prompt_lower else "professional")
        
        purpose = "Request assignment extension" if "extension" in prompt_lower else natural_prompt

        return ExtractedIntentResponse(
            email_type=email_type,
            recipient=recipient,
            purpose=purpose,
            context=natural_prompt,
            tone="professional",
            length="medium"
        )
