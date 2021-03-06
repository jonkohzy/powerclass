const router = require("express").Router();

const ispAuthHandler = require("./ispAuth.js");

const getEvents = require("./features/events.js");
const getAnnouncements = require("./features/announcements.js");
const getFile = require("./features/getFile.js");
const getCip = require("./features/cip.js");
const getDisciplineRecords = require("./features/discipline.js");
const getParticulars = require("./features/particulars.js");
const getProjectWork = require("./features/projectWork.js");
const getExamResultsAndReports = require("./features/exams.js");

router.post("/api/isp/events", (req, res) => {
  ispAuthHandler({ method: "POST", action: getEvents }, req, res);
});

router.post("/api/isp/announcements", (req, res) => {
  ispAuthHandler({ method: "POST", action: getAnnouncements }, req, res);
});

router.get("/api/isp/get-file", (req, res) => {
  ispAuthHandler({ method: "GET", action: getFile }, req, res );
});

router.post("/api/isp/cip", (req, res) => {
  ispAuthHandler({ method: "POST", action: getCip }, req, res);
});

router.post("/api/isp/discipline", (req, res) => {
  ispAuthHandler({ method: "POST", action: getDisciplineRecords }, req, res);
});

router.post("/api/isp/particulars", (req, res) => {
  ispAuthHandler({ method: "POST", action: getParticulars }, req, res);
});

router.post("/api/isp/project-work", (req, res) => {
  ispAuthHandler({ method: "POST", action: getProjectWork }, req, res);
});

router.post("/api/isp/exams", (req, res) => {
  ispAuthHandler({ method: "POST", action: getExamResultsAndReports }, req, res);
});

module.exports = router;
