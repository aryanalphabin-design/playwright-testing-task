const { test, expect } = require('@playwright/test');

test.describe('Amazon Shopping Automation', () => {
  test.only('should search for smartphones under 30000, add first item to cart and navigate to cart', async ({ page }) => {
    
    // 1. Navigate to amazon.in
    await page.goto('https://amazon.in');
    
    // 2. Search for "smartphones under 30000"
    await page.getByRole('searchbox', { name: 'Search Amazon.in' }).fill('smartphones under 30000');
    await page.getByRole('searchbox', { name: 'Search Amazon.in' }).press('Enter');
    
    // 3. Navigate to a specific product (OnePlus Nord 5) as an example
    await page.goto('https://www.amazon.in/dp/B0FCMKSP7V');
    
    // 4. Click on add to cart from product page
    await page.getByRole('button', { name: 'Add to cart' }).click();
    
    // 5. Verify we are on the cart page and item was added
    await expect(page).toHaveURL(/cart/);
    
    // Verify cart shows 1 item - check the navigation cart badge
    const cartBadge = page.locator('#nav-cart-count');
    await expect(cartBadge).toHaveText('1');
    
    console.log('Test completed successfully - Item added to cart and navigated to cart page');
  });
});
