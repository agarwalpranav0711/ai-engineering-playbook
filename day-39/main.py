"""Run the Day 39 supervised AI + Playwright browser agent."""

import argparse
import logging
import sys
from typing import Any

from openai import OpenAIError
from playwright.sync_api import Error as PlaywrightError

from browser_agent import BrowserAgent, EXPERIMENT_GOAL, INITIAL_URL
from browser_tools import browser_session
from model_client import ModelConfigurationError, OpenAICompatibleModel


def run_task(
    model: Any,
    goal: str = EXPERIMENT_GOAL,
    initial_url: str = INITIAL_URL,
    headless: bool = True,
) -> dict[str, Any]:
    with browser_session(headless=headless) as tools:
        return BrowserAgent(model, tools).run(goal, initial_url)


def main() -> int:
    parser = argparse.ArgumentParser(description="Run the supervised AI browser agent.")
    parser.add_argument("--goal", default=EXPERIMENT_GOAL, help="Natural-language browser goal.")
    parser.add_argument("--initial-url", default=INITIAL_URL, help="Approved initial HTTPS page.")
    parser.add_argument(
        "--headed",
        action="store_true",
        help="Show the isolated Chromium window instead of running headlessly.",
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    try:
        model = OpenAICompatibleModel()
        result = run_task(model, args.goal, args.initial_url, headless=not args.headed)
    except ModelConfigurationError as exc:
        print(f"Configuration error: {exc}", file=sys.stderr)
        return 2
    except OpenAIError as exc:
        print(
            f"Provider request failed ({type(exc).__name__}); check credentials, model, "
            "provider compatibility, and connectivity.",
            file=sys.stderr,
        )
        return 1
    except (PlaywrightError, OSError) as exc:
        print(f"Agent could not complete the run ({type(exc).__name__}): {exc}", file=sys.stderr)
        return 1

    print("\n--- Agent result ---")
    print(f"Completed: {result['completed']}")
    if result["answer"]:
        print(f"Answer: {result['answer']}")
    if result["error"]:
        print(f"Error: {result['error']}")
    print(f"Verified browser state: {result['browser_state']}")
    return 0 if result["completed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
