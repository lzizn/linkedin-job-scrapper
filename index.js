require("dotenv").config();

const puppeteer = require("puppeteer");

const { signIn } = require("./auth/signIn");

const { filter } = require("./jobs/filter");
const { store } = require("./jobs/store");

const { getFiltersFromCmdArgs } = require("./utils/getCmdArgs");

const JOBS = {
  filter,
  store,
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
  const page = await browser.newPage();

  const pageSignedIn = await AUTH.signIn(page);

  if (pageSignedIn == null) {
    await page.close();
    process.exit(1);
  }

  let offset = 0;
  while (true) {
    if (offset === 75) break;

    await JOBS.filter(pageSignedIn, {
      ...filters,
      offset,
    });
    await JOBS.store(pageSignedIn);
    offset += 25;
  }

  process.exit(1);
}

scrape();
