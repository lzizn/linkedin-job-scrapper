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
 * @param {Object} filters
 * @param {"last24Hours" | "pastWeek" | "pastMonth"} filters.date
 * @param {"hybrid" | "onSite" | "remote"} filters.modality
 * @param {string} filters.searchTerm
 * @param {string} filters.location
 */
async function applyFilters(filters) {
  const { date, location, modality, searchTerm } = filters;
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

  return BASE_URL;
}

module.exports = { applyFilters };
