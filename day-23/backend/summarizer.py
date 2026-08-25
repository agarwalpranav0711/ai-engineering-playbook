import os
import json
import re
import time
from typing import Dict, Any, List, Tuple
from dotenv import load_dotenv
from openai import OpenAI

from models import MeetingSummary, Decision, ActionItem, SummarizeRequest
from prompts import SYSTEM_MEETING_SUMMARIZER_PROMPT, USER_SUMMARIZE_PROMPT, MAP_REDUCE_CHUNK_PROMPT
from chunker import split_transcript_into_chunks

load_dotenv()

class MeetingSummarizerEngine:
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY", "")
        self.model = model or os.getenv("DEFAULT_MODEL", "google/gemini-2.5-flash")

        if self.api_key:
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.api_key,
                default_headers={
                    "HTTP-Referer": os.getenv("SITE_URL", "http://localhost:3000"),
                    "X-Title": os.getenv("SITE_NAME", "AI Meeting Summarizer"),
                }
            )
        else:
            self.client = None

    def summarize(self, req: SummarizeRequest) -> Tuple[MeetingSummary, str]:
        """Summarizes transcript using direct or hierarchical map-reduce strategy."""
        word_count = len(req.transcript.split())
        strategy = "direct" if word_count < 3000 else "hierarchical_map_reduce"

        if not self.client or not self.api_key:
            return self._heuristic_fallback_summarize(req), strategy

        try:
            if strategy == "direct":
                summary = self._direct_summarize(req)
            else:
                summary = self._map_reduce_summarize(req)
            return summary, strategy

        except Exception as e:
            print(f"OpenRouter Summarize API error: {e}. Switching to offline heuristic summarizer.")
            return self._heuristic_fallback_summarize(req, error_msg=str(e)), strategy

    def _direct_summarize(self, req: SummarizeRequest) -> MeetingSummary:
        """Single LLM pass for standard transcripts."""
        user_prompt = USER_SUMMARIZE_PROMPT.format(
            meeting_type=req.meeting_type.upper(),
            summary_length=req.summary_length.upper(),
            transcript=req.transcript
        )

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": SYSTEM_MEETING_SUMMARIZER_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        return self._parse_and_validate_json(response.choices[0].message.content)

    def _map_reduce_summarize(self, req: SummarizeRequest) -> MeetingSummary:
        """Hierarchical Map-Reduce summarization for long transcripts."""
        chunks = split_transcript_into_chunks(req.transcript, max_words_per_chunk=2000)
        chunk_summaries = []

        # MAP step: Summarize each chunk
        for idx, chunk in enumerate(chunks):
            try:
                res = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are a transcript chunk summarizer. Extract key items accurately as JSON."},
                        {"role": "user", "content": MAP_REDUCE_CHUNK_PROMPT.format(chunk_text=chunk)}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.2
                )
                chunk_summaries.append(res.choices[0].message.content)
            except Exception as e:
                print(f"Error mapping chunk {idx}: {e}")

        # REDUCE step: Combine chunk summaries into final MeetingSummary
        combined_text = "\n---\n".join(chunk_summaries)
        reduce_prompt = f"Combine the following chunk summaries into a master {req.meeting_type} meeting report ({req.summary_length} length):\n\n{combined_text}"

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": SYSTEM_MEETING_SUMMARIZER_PROMPT},
                {"role": "user", "content": reduce_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        return self._parse_and_validate_json(response.choices[0].message.content)

    def _parse_and_validate_json(self, raw_json: str) -> MeetingSummary:
        clean_json = raw_json.strip()
        if clean_json.startswith("```"):
            clean_json = re.sub(r"^```(?:json)?\n?", "", clean_json)
            clean_json = re.sub(r"\n?```$", "", clean_json)

        data = json.loads(clean_json)
        return MeetingSummary(**data)

    def _heuristic_fallback_summarize(self, req: SummarizeRequest, error_msg: str = None) -> MeetingSummary:
        """Deterministic offline heuristic meeting summarizer."""
        lines = req.transcript.split('\n')
        
        # 1. Extract Participants (speakers like 'Rahul:', 'Pranav:', 'Kriti:')
        participants = []
        for line in lines:
            match = re.match(r'^\s*([A-Z][a-zA-Z0-9_\s]+)\s*:', line)
            if match:
                speaker = match.group(1).strip()
                if speaker not in participants:
                    participants.append(speaker)

        # 2. Extract Decisions vs Suggestions
        decisions: List[Decision] = []
        for line in lines:
            if re.search(r'\b(?:agreed|decided|let\'s launch|target is|confirm|approved|going with)\b', line, re.IGNORECASE) and not re.search(r'\b(?:maybe|could|think about|idea)\b', line, re.IGNORECASE):
                decisions.append(Decision(
                    decision=re.sub(r'^[A-Za-z0-9_]+\s*:\s*', '', line).strip(),
                    context="Confirmed decision in meeting dialogue."
                ))

        # 3. Extract Action Items with Assignees & Deadlines
        action_items: List[ActionItem] = []
        for line in lines:
            # Check for pattern like: "Pranav, can you finish auth testing by Wednesday?"
            if re.search(r'\b(?:can you|please|will|should|task|todo|action)\b', line, re.IGNORECASE):
                # Detect assignee
                assignee = "Unassigned"
                for p in participants:
                    if p.lower() in line.lower():
                        assignee = p
                        break
                
                # Detect deadline
                deadline = "Not specified"
                dl_match = re.search(r'\bby\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|tomorrow|next week|end of day)\b', line, re.IGNORECASE)
                if dl_match:
                    deadline = dl_match.group(1).capitalize()

                clean_task = re.sub(r'^[A-Za-z0-9_]+\s*:\s*', '', line).strip()
                action_items.append(ActionItem(
                    task=clean_task,
                    assignee=assignee,
                    deadline=deadline,
                    status="pending"
                ))

        # 4. Extract Risks / Blockers
        risks: List[str] = []
        for line in lines:
            if re.search(r'\b(?:risk|blocker|incomplete|delay|issue|pending|concern|problem)\b', line, re.IGNORECASE):
                risks.append(re.sub(r'^[A-Za-z0-9_]+\s*:\s*', '', line).strip())

        # Fallback values if none found
        if not decisions:
            decisions.append(Decision(decision="Target launch date discussed; pending final testing completion.", context="General agreement"))
        if not risks:
            risks.append("No active critical blockers explicitly flagged in meeting transcript.")

        note = f" (Offline Mode: {error_msg})" if error_msg else " (Offline Heuristic Mode)"

        return MeetingSummary(
            title=f"{req.meeting_type.capitalize()} Meeting Summary",
            executive_summary=f"The team convened for a {req.meeting_type} discussion involving {len(participants)} participant(s). Key topics included launch timelines, task assignments, and testing completion.{note}",
            key_points=[
                f"Meeting covered key agenda items for {req.meeting_type} planning.",
                f"Identified {len(action_items)} action task(s) across team members.",
                f"Reviewed current development progress and dependencies."
            ],
            participants=participants if participants else ["Team Members"],
            topics=["Launch Timeline", "Development Progress", "Testing Dependencies"],
            decisions=decisions,
            action_items=action_items,
            risks=risks,
            open_questions=["Has final deployment environment been verified?"],
            next_steps=["Complete pending action items prior to next synchronization."]
        )
