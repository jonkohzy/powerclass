const unirest = require("unirest");
const parseHtml = require("node-html-parser").parse;
const _ = require("lodash");

const parseDisciplineRecords = (disciplineRecordsElements) => {
  const rawDisciplineRecords = _.chunk(disciplineRecordsElements, 6);

  if (rawDisciplineRecords[0][0].structuredText ===
    "(No offence records found)") {
    return [];
  }

  const disciplineRecords = rawDisciplineRecords.map((recordDetails) => ({
    category: recordDetails[1].structuredText,
    offence: recordDetails[2].structuredText,
    date: recordDetails[3].structuredText,
    demeritPoints: parseInt(recordDetails[4].structuredText),
    // if cross icon is present, not a major offence
    // else, is a major offence
    majorOffence: !recordDetails[5].innerHTML.includes("/images/delete-icon.png"),
  }));

  return disciplineRecords;
};

const getDisciplineRecords = async (res, cookies) => {
  const actionRes = await unirest("GET", "https://isphs.hci.edu.sg/students/discipline.asp")
      .jar(cookies);

  if (actionRes.error) {
    res.sendStatus(500);
  } else {
    try {
      const document = parseHtml(actionRes.body);
      const elements = [...document.querySelectorAll("td.form3")];

      const disciplineRecords = parseDisciplineRecords(elements);

      // add up total demerit points of all discipline records
      const totalDemeritPoints = disciplineRecords
          .reduce((totalPoints, { demeritPoints }) => totalPoints + demeritPoints, 0);

      res.send({ totalDemeritPoints, disciplineRecords });
    } catch (err) {
      res.sendStatus(500);
    }
  }
};

module.exports = getDisciplineRecords;
