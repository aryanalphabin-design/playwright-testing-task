const { chromium } = require("playwright");

const SEARCH_QUERY = "smartphone charger";
const MAX_PRICE = 2000;
const AMAZON = "https://www.amazon.in/";

async function findFirstAffordableResult(page, maxPrice) {
    console.log('- Finding best deals for you');

    await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 10000 });
    const items = page.locator('[data-component-type="s-search-result"]');
    const count = await items.count();
    
    for (let i = 0; i < count; i++) {
        const item = items.nth(i);
        let priceWhole = "";
        let priceFrac = "";
        
        if (await item.locator(".a-price-whole").count() > 0) {
            priceWhole = (await item.locator(".a-price-whole").innerText()).trim();
        }
        if (await item.locator(".a-price-fraction").count() > 0) {
            priceFrac = (await item.locator(".a-price-fraction").innerText()).trim();
        }
        
        const price = parsePriceText(priceWhole, priceFrac);
        
        if (price <= 0) {
            continue;
        }
        
        if (price <= maxPrice) {
            if (await item.locator("h2 a").count() > 0) {
                return item.locator("h2 a").first();
            }
            if (await item.locator("a").count() > 0) {
                return item.locator("a").first();
            }
        }
    }
    return null;
}

function parsePriceText(whole, frac) {
    whole = whole.replace(/[^\d]/g, "");
    frac = frac.replace(/[^\d]/g, "");
    if (!whole) return 0;
    return parseFloat(whole + (frac ? "." + frac : ""));
}

async function run() {
    const browser = await chromium.launch({ headless: false, slowMo: 800 });
    const context = await browser.newContext();

    await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true
    });

    let page = await context.newPage();

    try {
        console.log("- Navigating to Amazon India...");
        await page.goto(AMAZON, { timeout: 15000 });

        // Searching for the product
        await page.fill("#twotabsearchtextbox", SEARCH_QUERY);
        await page.keyboard.press("Enter");
        console.log("- Search complete. Waiting for results...");

        await page.waitForLoadState("domcontentloaded");

        // Finding item item
        const productLink = await findFirstAffordableResult(page, MAX_PRICE);
        
        if (!productLink) {
            console.log("- No product found under ₹" + MAX_PRICE);
            return;
        }
        
        // Clicking product
        console.log("- Clicking on product...");
        await productLink.click({ timeout: 10000 });
        
        await page.waitForTimeout(1000);
        
        // Switching to latest page
        console.log("- Switching to latest page");
        const pages = context.pages();
        page = pages[pages.length - 1];
        
        await page.waitForLoadState("domcontentloaded");
        console.log("- Opened product page.");

        // Wait a bit more for dynamic content to load
        await page.waitForTimeout(1500);

        // Find Add to Cart button
        let addToCart = null;
        
        if (await page.locator("input#add-to-cart-button").count() > 0) {
            addToCart = page.locator("input#add-to-cart-button").first();
            console.log("- Add to Cart button found (input type)");
        } else if (await page.locator("#add-to-cart-button").count() > 0) {
            addToCart = page.locator("#add-to-cart-button").first();
            console.log("- Add to Cart button found (generic type)");
        } else if (await page.getByRole("button", { name: /Add to Cart/i }).count() > 0) {
            addToCart = page.getByRole("button", { name: /Add to Cart/i }).first();
            console.log("- Add to Cart button found (by role)");
        }

        if (addToCart) {
            try {
                await addToCart.click({ timeout: 5000 });
                console.log("- Clicked Add to Cart");
                
                await page.waitForTimeout(2000);
                
                // Handling popup
                if (await page.locator("#attachAddBaseItemFeature").count() > 0) {
                    console.log("- Protection plan popup detected");
                    
                    if (await page.locator("#attachSiNoCoverage").count() > 0) {
                        await page.locator("#attachSiNoCoverage").click();
                        console.log("- Skipped protection plan");
                    } else if (await page.locator("#attachAddBaseItem").count() > 0) {
                        await page.locator("#attachAddBaseItem").click();
                        console.log("- Clicked Add to Cart inside popup");
                    }
                    
                    await page.waitForTimeout(1000);
                }
                
            } catch (clickError) {
                console.error("Error clicking Add to Cart:", clickError.message);
            }
        } else {
            console.log("Could not locate Add to Cart button on the product page.");
        }

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        try {
            await context.tracing.stop({ path: "trace.zip" });
            console.log("Trace saved to trace.zip");
        } catch (traceErr) {
            console.error("Error saving trace:", traceErr.message);
        }
        
        await page.waitForTimeout(3000);
        await browser.close();
    }
}

run();