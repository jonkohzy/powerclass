const authHandler = require("./ispAuth.js");

const getEvents = require("./features/events.js");
const getAnnouncements = require("./features/announcements.js");
const getFile = require("./features/getFile.js");
const getCip = require("./features/cip.js");
const getDisciplineRecords = require("./features/discipline.js");
const getParticulars = require("./features/particulars.js");
const getProjectWork = require("./features/projectWork.js");
const getExamResultsAndReports = require("./features/exams.js");

module.exports = (app) => {
  app.post("/api/isp/events", (req, res) => {
    authHandler({ method: "POST", action: getEvents }, req, res);
  });

  app.post("/api/isp/announcements", (req, res) => {
    authHandler({ method: "POST", action: getAnnouncements }, req, res );
  });

  app.get("/api/isp/get-file", (req, res) => {
    authHandler({ method: "GET", action: getFile }, req, res );
  });

  app.post("/api/isp/cip", (req, res) => {
    authHandler({ method: "POST", action: getCip }, req, res);
  });

  app.post("/api/isp/discipline", (req, res) => {
    authHandler({ method: "POST", action: getDisciplineRecords }, req, res);
  });

  app.post("/api/isp/particulars", (req, res) => {
    authHandler({ method: "POST", action: getParticulars }, req, res);
  });

  app.post("/api/isp/project-work", (req, res) => {
    authHandler({ method: "POST", action: getProjectWork }, req, res);
  });

  app.post("/api/isp/exams", (req, res) => {
    authHandler({ method: "POST", action: getExamResultsAndReports }, req, res);
  });
};
