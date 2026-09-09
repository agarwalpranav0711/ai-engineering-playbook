import json
import time
import os
from datetime import datetime
from typing import Dict, Any, List, Optional

class ExecutionLogger:
    """
    Structured execution logger for recording audit telemetry of Copilot requests.
    """
    
    def __init__(self, log_dir: str = None):
        if not log_dir:
            log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
        os.makedirs(log_dir, exist_ok=True)
        self.log_file = os.path.join(log_dir, "copilot_execution.jsonl")

    def log_request(
        self,
        request_id: str,
        user_message: str,
        engine_version: str,
        context_summary: str,
        tool_calls: List[Dict[str, Any]],
        requires_approval: bool,
        response_text: str,
        latency_ms: float
    ):
        record = {
            "timestamp": datetime.now().isoformat(),
            "request_id": request_id,
            "user_message": user_message,
            "engine_version": engine_version,
            "context_summary": context_summary[:200],
            "tool_calls_executed": tool_calls,
            "requires_approval": requires_approval,
            "response_length": len(response_text),
            "latency_ms": round(latency_ms, 2)
        }
        try:
            with open(self.log_file, "a", encoding="utf-8") as f:
                f.write(json.dumps(record) + "\n")
        except Exception as e:
            print(f"[ExecutionLogger Error]: {e}")
