from pathlib import Path

from playwright.sync_api import sync_playwright


def main() -> int:
    output = Path("tests") / "artifacts"
    output.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 960})
        page.goto("http://127.0.0.1:4173", wait_until="networkidle")

        assert "NH6 Pursuit" in page.title()
        page.locator("[data-start]").click()
        page.wait_for_timeout(800)

        status = page.locator("[data-status]").text_content() or ""
        speed = page.locator("[data-speed]").text_content() or ""
        canvas_count = page.locator("canvas").count()

        assert canvas_count >= 1
        assert len(speed.strip()) == 3
        assert "RUN" in status or "BOOST" in status or "PURSUIT" in status or "RING ROAD" in status

        page.screenshot(path=str(output / "nh6-pursuit-smoke.png"), full_page=True)
        browser.close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
