const $_ = require("cheerio");

const cleanString = (x = "") => {
  return x.replace(/\s+/g, " ").trim();
};

/**
 * @param {$_.CheerioAPI} jobDetails
 */
const getCompanyName = (jobDetails) => {
  let _name = jobDetails(
    'div[class="job-details-jobs-unified-top-card__primary-description-without-tagline"] a.app-aware-link'
  ).text();

  if (_name !== "") {
    return _name;
  }

  _name = cleanString(
    jobDetails(
      'div[class="job-details-jobs-unified-top-card__primary-description-without-tagline mb2"]'
    ).text()
  ).split(" · ")[0];

  return _name;
};

/**
 * @param {string} jobDetailsHTML
 */
const parse = (jobDetailsHTML) => {
  const jobDetails = $_.load(jobDetailsHTML);

  const title = cleanString(
    jobDetails("span.job-details-jobs-unified-top-card__job-title-link").text()
  );

  const createdAtStatic = cleanString(
    jobDetails("span[class='tvm__text tvm__text--positive']").first().text()
  );

  const applicantsAmount = cleanString(
    jobDetails(
      "span[class='tvm__text tvm__text--neutral'] + span[class='tvm__text tvm__text--neutral']"
    )
      .last()
      .text()
  );

  const positionInfoContainer = jobDetails(
    'ul > li[class="job-details-jobs-unified-top-card__job-insight job-details-jobs-unified-top-card__job-insight--highlight"] > span'
  ).first();

  const modality = cleanString(positionInfoContainer.find("span:first").text());
  const employmentType = cleanString(
    positionInfoContainer.find("span:nth-child(2)").text()
  );
  const level = cleanString(positionInfoContainer.find("span:last").text());

  const requiredSkills = cleanString(
    jobDetails(
      'li[class="job-details-jobs-unified-top-card__job-insight"] div + button[aria-label="View strong skill match modal"]'
    )
      .text()
      .replace("Skills: ", "")
  );

  const hasEasyApply = Boolean(
    jobDetails('button[aria-label*="Easy Apply to"]').text()
  );

  // could be handled by chatGPT
  const description = jobDetails('div[class*="jobs-description-content__text"]')
    .text()
    .trim()
    .split("\n")
    .map((x) => cleanString(x))
    .filter(Boolean);

  const qualifications = jobDetails(
    'li[class="job-details-how-you-match-card__qualification-section-list-item"] > a'
  )
    .map((i, el) => cleanString($_.load(el).text()))
    .toArray();

  const linkSrc =
    "https://linkedin.com" +
    jobDetails(
      'div[class*="job-details-jobs-unified-top-card__content--two-pane"] h2 a'
    ).attr("href");

  const link = (linkSrc + "").split("?")[0];

  const jobPostId = link.split("/").slice(5, -1)[0];

  // ====== INFO ABOUT COMPANY ======
  const companyName = getCompanyName(jobDetails);

  const companyLink = cleanString(
    jobDetails(
      'div[class*="job-details-jobs-unified-top-card__primary-description-without-tagline"] a.app-aware-link'
    ).attr("href")
  );

  const [companySize, companyCategory = ""] = cleanString(
    jobDetails(
      'li[class="job-details-jobs-unified-top-card__job-insight"] div + span'
    ).text()
  ).split(" · ");

  return {
    title,
    applicantsAmount,
    employmentType,
    modality,
    level,
    postCreatedAt: createdAtStatic,
    skills: requiredSkills,
    hasEasyApply,
    description,
    qualifications,
    link,
    jobPostId,
    // add dynamic created at (_meta.handledAt - static createdAt)
    company: {
      name: companyName,
      link: companyLink,
      size: companySize,
      category: companyCategory,
    },
    _meta: {
      handledAt: new Date().toISOString(),
    },
  };
};

module.exports = { parse };
