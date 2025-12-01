// @ts-check
import { test, expect } from '@playwright/test';
const LINK = "https://www.amazon.in/"

test('Add item to cart', async ({ page, context }) => {
  var productPage = null;
  await test.step('Navigate to Amazon', async () => {
    await page.goto(LINK);
    await expect(page).toHaveURL(/amazon\.in/);
  });

  await test.step('Search for smart watch', async () => {
    const searchBox = page.locator('#twotabsearchtextbox');
    await expect(searchBox).toBeVisible({ timeout: 15000 });
    await searchBox.fill('smart watch');
    await searchBox.press('Enter');
    await page.waitForSelector('[data-component-type="s-search-result"]');
  });

  await test.step('Open first result', async () => {
    const firstItemLink = page.locator('[data-component-type="s-search-result"] a').first();
    [productPage] = await Promise.all([
      context.waitForEvent('page'),
      firstItemLink.click()
    ]);
    await productPage.waitForLoadState('domcontentloaded');
  });
  
  await test.step('Add to cart', async () => {
      
      // Ensure the product page is loaded$
    await productPage.waitForLoadState('domcontentloaded');
    const addToCart = productPage.locator('input[value="Add to Cart"]').nth(1);
    await addToCart.scrollIntoViewIfNeeded();

    // Click Add to Cart on the new tab
    await addToCart.click({ timeout: 15000 });
  });

  await test.step('Verify item in cart', async () => {
    const cartbutton = await productPage.locator('#nav-cart-count');
    await expect(cartbutton).toBeVisible({ timeout: 15000 });
    await cartbutton.click();
  });

  await test.step('opening cart page', async () => {
    const cartbutton = await productPage.locator('a#nav-cart');
    await expect(cartbutton).toBeVisible({ timeout: 15000 });
    await cartbutton.click();
  });
});
