require("dotenv").config();

const puppeteer = require("puppeteer");

const { signIn } = require("./auth/signIn");

const { storeJobs } = require("./jobs/store");
const { parsePage } = require("./jobs/parsePage");
const { applyFilters } = require("./jobs/filter");

const { getFiltersFromCmdArgs } = require("./utils/getCmdArgs");

const JOBS = {
  parsePage,
  applyFilters,
  store: storeJobs,
};

const AUTH = {
  signIn,
};

const filters = getFiltersFromCmdArgs();

async function scrape() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1600,
      height: 900,
    },
  });

  const page = await AUTH.signIn(browser);

  let pageNumber = 1;
  let nextPageButton = null;

  const jobsUrl = await JOBS.applyFilters(filters);
  await page.goto(jobsUrl);

  do {
    if (pageNumber > 1) {
      await Promise.all([page.waitForNavigation(), nextPageButton.click()]);
    }

    const jobsParsed = await JOBS.parsePage(page, pageNumber);

    await JOBS.store(jobsParsed, pageNumber);

    nextPageButton = await page.$(
      `button[aria-label="Page ${pageNumber + 1}"]`
    );

    pageNumber += 1;
  } while (nextPageButton !== null);

  process.exit(1);
}

scrape();
