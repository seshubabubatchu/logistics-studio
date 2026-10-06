from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 1280, 'height': 800},
        record_video_dir="videos/",
        record_video_size={"width": 1280, "height": 800}
    )
    page = context.new_page()
    page.goto("http://localhost:3000", timeout=60000)

    # Wait for page to fully load
    time.sleep(5)

    # Skip loader
    try:
        page.evaluate("document.querySelector('button')?.click()")
    except:
        pass
    time.sleep(2)

    # Scroll to edi flow section
    page.evaluate("document.getElementById('edi-flow').scrollIntoView()")
    time.sleep(2)
    page.screenshot(path="edi_flow_initial.png")

    # Scroll down slightly to start marquee & animation
    page.evaluate("window.scrollBy(0, 500)")
    time.sleep(2)
    page.screenshot(path="edi_flow_scrubbed.png")

    # Scroll down more to see final state
    page.evaluate("window.scrollBy(0, 800)")
    time.sleep(2)
    page.screenshot(path="edi_flow_final.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
