import json
from typing import Any

import pytest

from browser_agent import BrowserAgent
from browser_tools import BrowserTools, ToolArgumentError, browser_session, validate_https_url


class FakePage:
    url = "https://example.com/"

    def __init__(self) -> None:
        self.goto_calls: list[str] = []

    def goto(self, url: str, **_: Any) -> None:
        self.goto_calls.append(url)
        self.url = url

    def title(self) -> str:
        return "Example Domain"

    def locator(self, _: str) -> "FakeBody":
        return FakeBody()


class FakeBody:
    def inner_text(self, **_: Any) -> str:
        return "Example Domain. This domain is for use in illustrative examples."


class FakeModel:
    def __init__(self, turns: list[dict[str, Any]]) -> None:
        self.turns = iter(turns)

    def next_turn(self, _: list[dict[str, Any]]) -> dict[str, Any]:
        return next(self.turns)


def tool_turn(name: str, arguments: Any, call_id: str = "call-1") -> dict[str, Any]:
    return {
        "content": None,
        "tool_calls": [
            {
                "id": call_id,
                "name": name,
                "arguments": arguments if isinstance(arguments, str) else json.dumps(arguments),
            }
        ],
    }


def test_allows_only_approved_https_hosts() -> None:
    assert validate_https_url("https://example.com/") == "https://example.com/"
    assert validate_https_url("https://www.python.org/") == "https://www.python.org/"


@pytest.mark.parametrize(
    "url",
    [
        "http://www.python.org/",
        "https://evil.example/",
        "https://www.python.org.evil.example/",
        "https://user:password@www.python.org/",
        "https://www.python.org:444/",
        "not a URL",
    ],
)
def test_rejects_unsafe_urls(url: str) -> None:
    with pytest.raises(ToolArgumentError):
        validate_https_url(url)


def test_unapproved_navigation_is_rejected_before_playwright_navigation() -> None:
    page = FakePage()
    result = BrowserTools(page).navigate({"url": "https://unapproved.example/"})
    assert result["ok"] is False
    assert page.goto_calls == []


def test_request_guard_aborts_unapproved_redirect_destination() -> None:
    class FakeRequest:
        url = "https://unapproved.example/redirect-target"

    class FakeRoute:
        request = FakeRequest()
        action = ""

        def abort(self, error_code: str) -> None:
            self.action = f"abort:{error_code}"

        def continue_(self) -> None:
            self.action = "continue"

    route = FakeRoute()
    BrowserTools(FakePage()).guard_route(route)
    assert route.action == "abort:blockedbyclient"


def test_invalid_tool_arguments_are_rejected() -> None:
    tools = BrowserTools(FakePage())
    with pytest.raises(ToolArgumentError):
        tools.navigate({"url": "https://example.com/", "extra": True})
    with pytest.raises(ToolArgumentError):
        tools.read_page({"unexpected": "argument"})


def test_unknown_tool_returns_clear_error() -> None:
    agent = BrowserAgent(
        FakeModel(
            [
                tool_turn("run_shell", {"command": "whoami"}),
                tool_turn("read_page", {}),
                {"content": "The page was inspected.", "tool_calls": []},
            ]
        ),
        BrowserTools(FakePage()),
    )
    result = agent.run("Read the page.")
    assert result["completed"] is True
    # Unknown tools are not dispatched; the next model response remains usable.
    assert result["answer"] == "The page was inspected."


def test_malformed_tool_json_stops_after_repeated_failures() -> None:
    agent = BrowserAgent(
        FakeModel(
            [
                tool_turn("navigate", "{bad json"),
                tool_turn("navigate", "{still bad"),
            ]
        ),
        BrowserTools(FakePage()),
    )
    result = agent.run("Open a page.")
    assert result["completed"] is False
    assert "repeated" in result["error"]


def test_maximum_model_round_limit_is_enforced() -> None:
    agent = BrowserAgent(
        FakeModel([tool_turn("read_page", {})]),
        BrowserTools(FakePage()),
        max_rounds=1,
    )
    result = agent.run("Read the page.")
    assert result["completed"] is False
    assert "1-round limit" in result["error"]


def test_navigation_timeout_is_reported(monkeypatch: pytest.MonkeyPatch) -> None:
    from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

    page = FakePage()

    def timeout(*_: Any, **__: Any) -> None:
        raise PlaywrightTimeoutError("timeout")

    monkeypatch.setattr(page, "goto", timeout)
    result = BrowserTools(page).navigate({"url": "https://www.python.org/"})
    assert result["ok"] is False
    assert result["error"] == "Navigation timed out."


def test_final_model_response_is_returned_and_browser_state_verified() -> None:
    agent = BrowserAgent(
        FakeModel(
            [
                tool_turn("read_page", {}),
                {"content": "Example Domain is shown.", "tool_calls": []},
            ]
        ),
        BrowserTools(FakePage()),
    )
    result = agent.run("Describe the page.")
    assert result["completed"] is True
    assert result["answer"] == "Example Domain is shown."
    assert result["browser_state"]["title"] == "Example Domain"


def test_finish_tool_returns_model_summary() -> None:
    agent = BrowserAgent(
        FakeModel(
            [
                tool_turn("read_page", {}),
                tool_turn("finish", {"summary": "Python homepage inspected."}),
            ]
        ),
        BrowserTools(FakePage()),
    )
    result = agent.run("Inspect the page.")
    assert result["completed"] is True
    assert result["answer"] == "Python homepage inspected."


def test_model_cannot_finish_before_inspecting_current_page() -> None:
    agent = BrowserAgent(
        FakeModel(
            [
                tool_turn("finish", {"summary": "I am done."}),
                {"content": "I am done.", "tool_calls": []},
            ]
        ),
        BrowserTools(FakePage()),
    )
    result = agent.run("Read the page.")
    assert result["completed"] is False
    assert "before inspecting" in result["error"]


def test_browser_resources_are_closed_after_exception(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    import browser_tools as module

    closed: list[str] = []

    class FakePageForSession(FakePage):
        pass

    class FakeContext:
        def new_page(self) -> FakePageForSession:
            return FakePageForSession()

        def route(self, *_: Any) -> None:
            pass

        def close(self) -> None:
            closed.append("context")

    class FakeBrowser:
        def new_context(self, **_: Any) -> FakeContext:
            return FakeContext()

        def close(self) -> None:
            closed.append("browser")

    class FakeChromium:
        def launch(self, **_: Any) -> FakeBrowser:
            return FakeBrowser()

    class FakePlaywright:
        chromium = FakeChromium()

    class FakePlaywrightManager:
        def __enter__(self) -> FakePlaywright:
            return FakePlaywright()

        def __exit__(self, *_: Any) -> None:
            pass

    monkeypatch.setattr(module, "sync_playwright", FakePlaywrightManager)
    with pytest.raises(RuntimeError, match="simulated model failure"):
        with browser_session():
            raise RuntimeError("simulated model failure")
    assert closed == ["context", "browser"]


def test_browser_closes_if_context_creation_fails(
        monkeypatch: pytest.MonkeyPatch,
) -> None:
        import browser_tools as module

        closed: list[str] = []

        class FakeBrowser:
            def new_context(self, **_: Any) -> Any:
                raise RuntimeError("simulated context creation failure")

            def close(self) -> None:
                closed.append("browser")

        class FakeChromium:
            def launch(self, **_: Any) -> FakeBrowser:
                return FakeBrowser()

        class FakePlaywright:
            chromium = FakeChromium()

        class FakePlaywrightManager:
            def __enter__(self) -> FakePlaywright:
                return FakePlaywright()

            def __exit__(self, *_: Any) -> None:
                pass

        monkeypatch.setattr(module, "sync_playwright", FakePlaywrightManager)
        with pytest.raises(RuntimeError, match="simulated context creation failure"):
            with browser_session():
                pass
        assert closed == ["browser"]
