from pathlib import Path

from playwright.sync_api import sync_playwright


def main() -> int:
    output = Path("docs") / "screenshots"
    output.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1600, "height": 1000}, device_scale_factor=1)
        page.goto("http://127.0.0.1:4173", wait_until="networkidle")

        page.screenshot(path=str(output / "intro-screen.png"), full_page=True)

        page.locator("[data-start]").click()
        page.wait_for_timeout(500)
        page.keyboard.down("KeyW")
        page.keyboard.down("KeyD")
        page.wait_for_timeout(1000)
        page.keyboard.up("KeyD")
        page.screenshot(path=str(output / "highway-run.png"), full_page=True)

        page.keyboard.down("Shift")
        page.wait_for_timeout(700)
        page.keyboard.up("Shift")
        page.keyboard.up("KeyW")
        page.wait_for_timeout(300)
        page.screenshot(path=str(output / "boost-run.png"), full_page=True)

        browser.close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
