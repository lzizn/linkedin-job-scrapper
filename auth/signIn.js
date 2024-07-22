const puppeteer = require("puppeteer");

require("dotenv").config();

/**
 *
 * @param {puppeteer.Browser} browser
 */
async function signIn(browser) {
  const page = await browser.newPage();

  const LINKEDIN_LOGIN_PAGE = "https://www.linkedin.com/login?fromSignIn=true";
  await page.goto(LINKEDIN_LOGIN_PAGE);

  const emailInput = await page.$('input[type="text"]');
  const passwordInput = await page.$('input[type="password"]');

  if (emailInput == null || passwordInput == null) {
    console.error("Could not find input for either password or email", {
      emailInput,
      passwordInput,
      cookies,
    });
    await page.close();
    process.exit(1);
  }

  await emailInput.type(process.env.LINKEDIN_EMAIL, { delay: 40 });
  await passwordInput.type(process.env.LINKEDIN_PASSWORD, { delay: 90 });

  const signInButton = await page.$('button[type="submit"]');

  if (signInButton == null) {
    console.error("Could not find SignIn button");
    await page.close();
    process.exit(1);
  }

  await signInButton.click();
  await page.waitForNavigation({
    timeout: 60000,
  });

  return page;
}

module.exports = { signIn };
