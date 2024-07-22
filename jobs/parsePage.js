const puppeteer = require("puppeteer");
const { parse } = require("./parse");

const { waitFor } = require("../utils/waitFor");

/**
 * @param {puppeteer.Page} page
 */
const getJobDetailsHtml = async (page) => {
  const jobDetailsContainer = await page.$(
    'div[class*="jobs-search__job-details"]'
  );

  if (jobDetailsContainer == null) return null;

  const jobDetailsHTML = await page.evaluate(
    (e) => e.innerHTML,
    jobDetailsContainer
  );
  await jobDetailsContainer.dispose();

  return jobDetailsHTML;
};

/**
 * @param {puppeteer.Page} page
 */
const parsePage = async (page) => {
  const jobCards = await page.$$('li[class*="jobs-search-results__list-item"]');

  if (jobCards.length === 0) {
    console.error("Could not get jobs");
    await page.close();
    process.exit(1);
  }

  const jobsParsed = [];

  for (const card of jobCards) {
    const jobDetailsHTML = await getJobDetailsHtml(page);

    if (jobDetailsHTML) {
      const job = parse(jobDetailsHTML);
      jobsParsed.push(job);
    }

    // Going to next job details
    const nextJobDetailsLink = await card.$("a");
    if (nextJobDetailsLink == null) break;

    await nextJobDetailsLink.click();
    await card.dispose();
    await waitFor(2000);
  }

  return jobsParsed;
};

module.exports = { parsePage };
