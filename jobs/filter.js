const puppeteer = require("puppeteer");

const { waitFor } = require("../utils/waitFor");

// https://www.linkedin.com/jobs/search/?
// &f_TPR=r86400
// &keywords=nodejs
// &location=Brazil
// &origin=JOBS_HOME_LOCATION_HISTORY&refresh=true

const dateOptions = {
  last24hours: "r86400",
  pastWeek: "r604800",
  pastMonth: "r2592000",
};

const modalityOptions = {
  hybrid: "3",
  remote: "2",
  onSite: "1",
};

/**
 *
 * @param {puppeteer.Page} page
 * @param {{
 *    date: "last24Hours" | "pastWeek" | "pastMonth",
 *    modality: "hybrid" | "onSite" | "remote",
 *    searchTerm: string,
 *    location: string
 *    offset: number
 * }} param1
 */
async function filter(page, { date, modality, searchTerm, location, offset }) {
  let BASE_URL = "https://www.linkedin.com/jobs/search/?";

  if (date) {
    BASE_URL += "&f_TPR=" + dateOptions[date];
  }

  if (modality) {
    BASE_URL += "&f_WT=" + modalityOptions[modality];
  }

  BASE_URL += "&keywords=" + searchTerm;
  BASE_URL += "&location=" + location;
  BASE_URL += "&origin=JOBS_HOME_LOCATION_HISTORY&refresh=true";
  BASE_URL += "&start=" + offset;

  await page.goto(BASE_URL);
  await waitFor(2000);

  const hasNextPage = false;

  return hasNextPage;
}

module.exports = { filter };
