const unirest = require("unirest");
const parseHtml = require("node-html-parser").parse;

const parseProject = (elements) => {
  const elementsText = elements.map((elem) => elem.structuredText);

  const project = {
    name: elementsText[1] ? elementsText[1] : null,
    category: elementsText[2] ? elementsText[2] : null,
    mentor: elementsText[4] ? elementsText[4] : null,
    mentorApprovalStatus: elementsText[5] ? elementsText[5] : null,
    catManagerApprovalStatus: elementsText[6] ? elementsText[6] : null,
    projectStatus: elementsText[7] ? elementsText[7] : null,
  };

  return project;
};

const getProjectWork = async (res, cookies) => {
  const actionRes = await unirest("GET", "https://isphs.hci.edu.sg/projectwork/addproject.asp")
      .jar(cookies);

  if (actionRes.error) {
    res.sendStatus(500);
  } else {
    try {
      const document = parseHtml(actionRes.body);

      const elements = document.querySelectorAll(".form3");
      const projectDetails = parseProject(elements);

      res.send(projectDetails);
    } catch (err) {
      res.sendStatus(500);
    }
  }
};

module.exports = getProjectWork;
