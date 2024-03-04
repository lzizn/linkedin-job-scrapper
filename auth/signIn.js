const puppeteer = require("puppeteer");

require("dotenv").config();

/**
 *
 * @param {puppeteer.Page} page
 * @returns
 */
async function signIn(page) {
  const LINKEDIN_HOME_SCREEN = "https://www.linkedin.com/home";
  await page.goto(LINKEDIN_HOME_SCREEN);

  const emailInput = await page.$('input[type="text"]');
  const passwordInput = await page.$('input[type="password"]');

  if (emailInput == null || passwordInput == null) {
    console.error("Could not find input for either password or email", {
      emailInput,
      passwordInput,
    });
    return null;
  }

  await emailInput.type(process.env.LINKEDIN_EMAIL, { delay: 40 });
  await passwordInput.type(process.env.LINKEDIN_PASSWORD, { delay: 90 });

  const signInButton = await page.$(
    'button[data-id="sign-in-form__submit-btn"]'
  );

  if (signInButton == null) {
    console.error("Could not find SignIn button");
    return null;
  }

  await signInButton.click();
  await page.waitForNavigation({
    timeout: 60000,
  });

  return page;
}

module.exports = { signIn };
