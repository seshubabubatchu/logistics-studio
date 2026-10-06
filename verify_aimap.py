from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Navigate to the page
    page.goto("http://localhost:3002")
    page.wait_for_timeout(1000)

    # Click the SKIP button on the loader
    skip_button = page.locator("text='SKIP'")
    if skip_button.is_visible():
        skip_button.click()
        page.wait_for_timeout(1000)

    # Scroll to the AiMap section
    page.evaluate("document.getElementById('ai-map').scrollIntoView({ behavior: 'auto', block: 'start' })")
    page.wait_for_timeout(1500)

    # Take screenshot at the initial position of AI Map
    page.screenshot(path="/home/jules/verification/screenshots/ai_map_initial.png")

    # Scroll slightly down to trigger some animations (parallax, typing)
    page.evaluate("window.scrollBy(0, 300)")
    page.wait_for_timeout(1000)

    # Scroll further to reach validation steps
    page.evaluate("window.scrollBy(0, 300)")
    page.wait_for_timeout(1000)

    # Take screenshot at the final position showing the whole UI
    page.screenshot(path="/home/jules/verification/screenshots/ai_map_scrolled.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
