const path = require("node:path");
const fs = require("node:fs");

const { describe, it } = require("node:test");
const assert = require("node:assert");

const { parse } = require("./parse");

describe("JOBS.parse - parse HTML to JS object", () => {
  it("should parse easy apply job, without range salary", () => {
    const mockHTML = fs.readFileSync(
      path.resolve(__dirname, "..", "mocks", "easyApplyJobDetails.html")
    );

    const job = parse(mockHTML);

    delete job._meta;
    delete job.description;

    assert.deepEqual(job, {
      title: "Full Stack Engineer",
      applicantsAmount: "1 applicant",
      employmentType: "Full-time",
      modality: "Remote",
      level: "Mid-Senior level",
      postCreatedAt: "13 minutes ago",
      skills: "JavaScript, Ruby on Rails",
      hasEasyApply: true,
      qualifications: [
        "Conversational in Inglês",
        "3+ years of work experience with JavaScript",
        "5+ years of work experience with Ruby on Rails",
      ],
      link: "https://linkedin.com/jobs/view/3845111376/",
      jobPostId: "3845111376",
      company: {
        name: "TurnKey Tech Staffing",
        link: "https://www.linkedin.com/company/turnkey-staffing/life",
        size: "201-500 employees",
        category: "Staffing and Recruiting",
      },
    });
  });

  it("should parse job where company info its not available", () => {
    const mockHTML = fs.readFileSync(
      path.resolve(__dirname, "..", "mocks", "normalApplyJonDetails.html")
    );

    const job = parse(mockHTML);

    delete job._meta;
    delete job.description;

    assert.deepEqual(job, {
      title: "Analista Desenvolvedor de Software Delphi",
      applicantsAmount: "5 applicants",
      employmentType: "Full-time",
      modality: "Remote",
      level: "Entry level",
      postCreatedAt: "8 hours ago",
      skills: "",
      hasEasyApply: false,
      link: "https://linkedin.com/jobs/view/3841446115/",
      jobPostId: "3841446115",
      qualifications: [],
      company: {
        name: "TICOOP BRASIL - COOPERATIVA DOS PROFISSIONAIS EM TECNOLOGIA DA INFORMACAO",
        link: "",
        size: "",
        category: "",
      },
    });
  });
});
