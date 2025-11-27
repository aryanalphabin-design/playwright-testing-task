import { test, expect } from '@playwright/test';
const LINK = "https://www.amazon.in/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.in%2F%3Fref_%3Dnav_ya_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=inflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0"

test.only('Sign in to Amazon', async ({ page}) => {
    await test.step('Navigating to Amazon-Signin', async () => {
        await page.goto(LINK)
        await expect(page).toHaveURL(/amazon\.in/);
    });
    await test.step('Entering email', async () => {
        const emailInput = page.locator("input#ap_email_login.a-input-text");
        await console.log(emailInput);
        console.log(emailInput);
    });
});