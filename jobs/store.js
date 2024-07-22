const fs = require("node:fs");
const path = require("node:path");

const json2csv = require("json2csv");

/**
 * @param {puppeteer.Page} page
 */
const storeJobs = async (jobsParsed, pageNumber) => {
  const fileInfo = {
    path: path.resolve(
      __dirname,
      "..",
      "outputs",
      `${pageNumber}-${new Date().toISOString()}.json`
    ),
    body: JSON.stringify(jobsParsed, null, 2),
  };

  fs.writeFileSync(fileInfo.path, fileInfo.body);
};

module.exports = { storeJobs };
