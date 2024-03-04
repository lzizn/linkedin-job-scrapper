const fs = require("node:fs");
const puppeteer = require("puppeteer");
const { parse } = require("./parse");

const { waitFor } = require("../utils/waitFor");

/**
 * @param {puppeteer.Page} page
 */
const store = async (page) => {
  const jobCards = await page.$$('li[class*="jobs-search-results__list-item"]');

  if (jobCards.length === 0) {
    console.error("Could not get jobs");
    await page.close();
    process.exit(1);
  }

  const jobsParsed = [];

  for (const card of jobCards) {
    const jobDetails = await page.$('div[class*="jobs-search__job-details"]');
    if (jobDetails == null) {
      break;
    }
    const jobDetailsHTML = await page.evaluate(
      (el) => el.innerHTML,
      jobDetails
    );

    if (jobDetailsHTML) {
      const { job } = parse(jobDetailsHTML);
      await jobDetails.dispose();
      jobsParsed.push(job);
    }

    // going to next job details
    const jobLink = await card.$("a");
    if (jobLink == null) {
      break;
    }

    await jobLink.click();
    await waitFor(2000);
  }

  // free memory
  await Promise.all(jobCards.map(async (x) => x.dispose()));

  fs.writeFileSync(
    `jobs-parsed-${new Date().toISOString()}.json`,
    JSON.stringify(jobsParsed, null, 2)
  );
};

module.exports = { store };
