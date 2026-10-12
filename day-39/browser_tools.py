"""Safe, narrow Playwright tools for the Day 39 browser-agent experiment."""

from contextlib import contextmanager
from typing import Any, Iterator
from urllib.parse import urljoin, urlsplit

from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import Page, Route, sync_playwright


ALLOWED_HOSTS = frozenset({"example.com", "www.python.org"})
MAX_URL_LENGTH = 2048
MAX_TEXT_LENGTH = 160
MAX_OBSERVATION_LENGTH = 4000
DEFAULT_TIMEOUT_MS = 10_000


class ToolArgumentError(ValueError):
    """Raised when a model-supplied tool call has invalid arguments."""


def validate_https_url(url: Any) -> str:
    if not isinstance(url, str) or not url or len(url) > MAX_URL_LENGTH:
        raise ToolArgumentError("URL must be a non-empty string no longer than 2048 characters.")
    if url != url.strip() or "\\" in url or any(ord(char) < 32 for char in url):
        raise ToolArgumentError("URL contains whitespace or invalid characters.")

    try:
        parsed = urlsplit(url)
        hostname = parsed.hostname
        port = parsed.port
    except ValueError as exc:
        raise ToolArgumentError("URL is malformed.") from exc

    if (
        parsed.scheme.lower() != "https"
        or not hostname
        or parsed.username is not None
        or parsed.password is not None
    ):
        raise ToolArgumentError("Only credential-free HTTPS URLs on an approved host are allowed.")
    if hostname.lower() not in ALLOWED_HOSTS or port not in (None, 443):
        raise ToolArgumentError("URL host or port is not approved.")
    return url


def _validate_object_arguments(
    arguments: Any, required: frozenset[str]
) -> dict[str, Any]:
    if not isinstance(arguments, dict):
        raise ToolArgumentError("Tool arguments must be a JSON object.")
    keys = frozenset(arguments)
    if keys != required:
        expected = ", ".join(sorted(required))
        raise ToolArgumentError(f"Expected exactly these argument(s): {expected}.")
    return arguments


class BrowserTools:
    def __init__(self, page: Page) -> None:
        self.page = page

    def guard_route(self, route: Route) -> None:
        try:
            validate_https_url(route.request.url)
        except ToolArgumentError:
            route.abort("blockedbyclient")
            return
        route.continue_()

    def navigate(self, arguments: Any) -> dict[str, Any]:
        values = _validate_object_arguments(arguments, frozenset({"url"}))
        try:
            url = validate_https_url(values["url"])
        except ToolArgumentError as exc:
            return {"ok": False, "error": f"Navigation blocked: {exc}"}
        try:
            self.page.goto(url, wait_until="domcontentloaded", timeout=DEFAULT_TIMEOUT_MS)
        except PlaywrightTimeoutError:
            return {
                "ok": False,
                "error": "Navigation timed out.",
                "observation": self.read_page({}),
            }
        except PlaywrightError as exc:
            return {
                "ok": False,
                "error": f"Navigation failed ({type(exc).__name__}).",
                "observation": self.read_page({}),
            }

        try:
            validate_https_url(self.page.url)
        except ToolArgumentError:
            return {
                "ok": False,
                "error": "Navigation ended at an unapproved URL and was blocked.",
                "observation": self.read_page({}),
            }
        return {"ok": True, "observation": self.read_page({})}

    def read_page(self, arguments: Any) -> dict[str, Any]:
        _validate_object_arguments(arguments, frozenset())
        try:
            title = self.page.title()
            text = self.page.locator("body").inner_text(timeout=DEFAULT_TIMEOUT_MS)
        except PlaywrightTimeoutError:
            return {"ok": False, "error": "Reading the page timed out."}
        except PlaywrightError as exc:
            return {"ok": False, "error": f"Reading the page failed ({type(exc).__name__})."}

        return {
            "ok": True,
            "url": self.page.url,
            "title": title[:MAX_TEXT_LENGTH],
            "text": text[:MAX_OBSERVATION_LENGTH],
            "text_truncated": len(text) > MAX_OBSERVATION_LENGTH,
        }

    def click_text(self, arguments: Any) -> dict[str, Any]:
        values = _validate_object_arguments(arguments, frozenset({"text"}))
        text = values["text"]
        if not isinstance(text, str) or not text.strip() or len(text) > MAX_TEXT_LENGTH:
            raise ToolArgumentError("Text must be non-empty and no longer than 160 characters.")

        link = self.page.get_by_role("link", name=text, exact=True)
        try:
            count = link.count()
            if count != 1 or not link.is_visible():
                return {
                    "ok": False,
                    "error": "Expected exactly one visible link with that text.",
                }
            destination = link.get_attribute("href")
            target = link.get_attribute("target")
            if not destination or target not in (None, "", "_self"):
                return {"ok": False, "error": "Only same-tab links can be clicked."}
            resolved_url = urljoin(self.page.url, destination)
            validate_https_url(resolved_url)
            link.click(timeout=DEFAULT_TIMEOUT_MS)
            validate_https_url(self.page.url)
        except ToolArgumentError:
            return {"ok": False, "error": "Link destination is not approved."}
        except PlaywrightTimeoutError:
            return {"ok": False, "error": "Click timed out."}
        except PlaywrightError as exc:
            return {"ok": False, "error": f"Click failed ({type(exc).__name__})."}
        return {"ok": True, "observation": self.read_page({})}


@contextmanager
def browser_session(headless: bool = True) -> Iterator[BrowserTools]:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=headless)
        try:
            context = browser.new_context(
                accept_downloads=False,
                service_workers="block",
            )
            try:
                page = context.new_page()
                tools = BrowserTools(page)
                context.route("**/*", tools.guard_route)
                yield tools
            finally:
                context.close()
        finally:
            browser.close()
