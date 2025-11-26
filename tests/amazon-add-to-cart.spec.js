// @ts-check
import { test, expect } from '@playwright/test';

const LINK = "https://www.amazon.in/"


// Test for navigation
test('Test - navigation to Amazon.in', async ({ page }) => {

  const resp = await page.goto(LINK, { waitUntil:'domcontentloaded' });
  expect(resp).not.toBeNull();
  expect(resp?.ok()).toBeTruthy();

  await expect(page).toHaveURL(/amazon\.in/);
  await expect(page).toHaveTitle(/amazon/i);
});


// Test for searching an item
test('Test - Searching item in Amazon.in', async ({ page }) => {
  // Navigate to Amazon first
  await page.goto(LINK, { waitUntil: 'domcontentloaded' });
  
  const searchBox = page.locator('#twotabsearchtextbox');
  await expect(searchBox).toBeVisible();
  await searchBox.fill('smart watch');
  await searchBox.press('Enter');
  // ensure results page loaded
  await page.waitForSelector('[data-component-type="s-search-result"]', { state: 'visible' });
});

// Test for finding first item from results
test('Test - Clicking first item from results', async ({ page }) => {
  // Navigate to Amazon first
  await page.goto(LINK, { waitUntil: 'domcontentloaded' });
  
  // Perform a search first so results are available
  const searchBox = page.locator('#twotabsearchtextbox');
  await expect(searchBox).toBeVisible();
  await searchBox.fill('smart watch');
  await searchBox.press('Enter');

  await page.waitForSelector('[data-component-type="s-search-result"]', { state: 'visible' });


  // For finding first item
  const firstItemLink = page
    .locator('[data-component-type="s-search-result"] a')
    .first();

  // for clicking first item
  await firstItemLink.click();
});

// test.only('Test - Adding item to cart', async ({ page, context }) => {
//   await page.goto(LINK, { waitUntil: 'domcontentloaded' });
  
//   const searchBox = page.locator('#twotabsearchtextbox');
//   await expect(searchBox).toBeVisible();
//   await searchBox.fill('smart watch');
//   await searchBox.press('Enter');

//  // For finding first item
//   const firstItemLink = page
//     .locator('[data-component-type="s-search-result"] a')
//     .first();

//   // for clicking first item
//   await firstItemLink.click();
  
// // click that opens a new tab
// const [page2] = await Promise.all([
//   context.waitForEvent('page'),
//   page.getByRole('button', { name: 'Add to Cart' }).click()
// ]);

// // make sure the new tab is fully loaded
// await page2.waitForLoadState('domcontentloaded');

// // now interact with the new tab
// await page2.locator('input[value="Add to Cart"]:visible').first().click();







//   // console.log("- Switching to latest page");
//   // const pages = context.pages();
//   // console.log("Pages opened"+pages.length);
  
//   // await page.waitForLoadState("domcontentloaded");
//   // page = pages[pages.length - 1];

//   // // Click on 'Add to Cart' button
//   // const addToCartButton = page.locator('#add-to-cart-button');
//   // console.log(await addToCartButton.count());
//   // await addToCartButton.click();

//   await expect(page.locator('text=/Added to (your )?(Basket|Cart)/i')).toBeVisible({ timeout: 5000 });
// });


// test.only('Test - Adding item to cart', async ({ page, context }) => {

//   await page.goto(LINK, { waitUntil: 'domcontentloaded' });

//   const searchBox = page.locator('#twotabsearchtextbox');
//   await searchBox.fill('smart watch');
//   await searchBox.press('Enter');

//   await page.waitForSelector('[data-component-type="s-search-result"]');

//   // Click first search result
//   const firstItemLink = page
//     .locator('[data-component-type="s-search-result"] a')
//     .first();
// // Click the first result (opens new tab)
// const [page2] = await Promise.all([
//   context.waitForEvent('page'),
//   firstItemLink.click()
// ]);

// // Ensure the product page is loaded$
// await page2.waitForLoadState('domcontentloaded');

// // Scroll to Add to Cart button
// const addToCart = page2.locator('input[value="Add to Cart"]').nth(1);
// await addToCart.scrollIntoViewIfNeeded();

// // Click Add to Cart on the new tab
// await addToCart.click({ timeout: 15000 });

// // Validate "Added to Cart"
// await expect(
//   page2.locator('#nav-cart-count')
// ).toBeVisible({ timeout: 8000 });


// });

test('Add item to cart', async ({ page, context }) => {
  var productPage = null;
  await test.step('Navigate to Amazon', async () => {
    await page.goto(LINK);
    await expect(page).toHaveURL(/amazon\.in/);
  });

  await test.step('Search for smart watch', async () => {
    const searchBox = page.locator('#twotabsearchtextbox');
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

    // Validate "Added to Cart"
    await expect(
      productPage.locator('#nav-cart-count')
    ).toBeVisible({ timeout: 8000 });
  });
});
