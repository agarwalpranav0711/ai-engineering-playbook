"""Small OpenAI-compatible chat-completions client with function calling."""

import os
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI

from browser_agent import TOOL_SCHEMAS


class ModelConfigurationError(ValueError):
    """Raised when environment-based model configuration is incomplete."""


class OpenAICompatibleModel:
    def __init__(self) -> None:
        load_dotenv()
        provider = os.getenv("MODEL_PROVIDER", "openai_compatible").strip()
        if provider != "openai_compatible":
            raise ModelConfigurationError(
                "MODEL_PROVIDER must be set to 'openai_compatible'."
            )

        api_key = os.getenv("OPENAI_API_KEY", "").strip()
        self.model = os.getenv("OPENAI_MODEL", "").strip()
        base_url = os.getenv("OPENAI_BASE_URL", "").strip() or None
        if not api_key:
            raise ModelConfigurationError(
                "OPENAI_API_KEY is not configured. Copy .env.example to .env and set it locally."
            )
        if not self.model:
            raise ModelConfigurationError("OPENAI_MODEL is not configured.")
        self.client = OpenAI(
            api_key=api_key,
            base_url=base_url,
            timeout=30.0,
            max_retries=1,
        )

    def next_turn(self, messages: list[dict[str, Any]]) -> dict[str, Any]:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            tools=TOOL_SCHEMAS,
            tool_choice="auto",
        )
        message = response.choices[0].message
        return {
            "content": message.content,
            "tool_calls": [
                {
                    "id": call.id,
                    "name": call.function.name,
                    "arguments": call.function.arguments,
                }
                for call in (message.tool_calls or [])
            ],
        }
