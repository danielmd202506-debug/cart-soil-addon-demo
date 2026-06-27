const { chromium } = require("/Users/daniel/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Users/daniel/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell",
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });

  await page.goto("http://127.0.0.1:8765/demo/", { waitUntil: "networkidle" });
  await page.click("#addGardenBed");
  await page.waitForTimeout(350);
  await page.screenshot({ path: "/private/tmp/soil-drawer-reco.png", fullPage: false });

  await page.click(".switch span");
  await page.waitForTimeout(200);
  await page.screenshot({ path: "/private/tmp/soil-drawer-off.png", fullPage: false });

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("http://127.0.0.1:8765/demo/", { waitUntil: "networkidle" });
  await page.click("#addGardenBed");
  await page.waitForTimeout(350);
  await page.screenshot({ path: "/private/tmp/soil-drawer-mobile.png", fullPage: true });

  const data = await page.evaluate(() => ({
    drawerOpen: document.querySelector("#cartDrawer")?.classList.contains("open"),
    total: document.querySelector("#drawerTotal")?.textContent,
    recoTitle: document.querySelector(".soil-card-head h3")?.textContent,
    checkoutText: document.querySelector("#checkoutButton")?.textContent,
    bodyWidth: document.body.scrollWidth,
    viewport: innerWidth,
  }));

  await browser.close();
  console.log(JSON.stringify(data, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
