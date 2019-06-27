const unirest = require("unirest");
const parseHtml = require("node-html-parser").parse;

const hasError = require("../utility/resArrayHasError.js");
const getSelectedOption = require("../utility/getSelectedOption.js");

const parseExamResults = (examPages) => {
  const results = examPages.map((document) => {
    // results table, NOT progress reports table!
    const resultRows = document.querySelector(".form").childNodes.slice(3);

    // results for exam displayed on current page
    const examResults = resultRows.map(({ childNodes }) => ({
      subject: childNodes[1].structuredText,
      mark: childNodes[2].structuredText,
    }));

    const examsSelector = document.querySelector("#exam");

    // include exam name
    return {
      exam: getSelectedOption(examsSelector),
      results: examResults,
    };
  });

  return results;
};

const requestExamById = (detailsElement, cookies) => {
  const examId = detailsElement.rawAttrs.match(/(?<=value=\")\d+/);
  return unirest("GET", `https://isphs.hci.edu.sg/students/exams.asp?exam=${examId}`)
      .jar(cookies);
};

const parseReports = (reportsRows) => {
  const reports = reportsRows.map((reportRow) => {
    const reportName = reportRow.childNodes[1].structuredText;

    const reportLinkElement = reportRow.childNodes[2].childNodes[1];
    // matches any characters fitting "popup3('____')"
    const reportUrl =
        `https://isphs.hci.edu.sg${reportLinkElement.attributes.onclick
            .match(/(?<=popup3\(\').+(?=\'\))/)[0]}`;

    return { reportName, reportUrl };
  });

  return reports;
};

const getExamResultsAndReports = async (res, cookies) => {
  const actionRes = await unirest("GET", "https://isphs.hci.edu.sg/students/exams.asp")
      .jar(cookies);

  if (actionRes.error) {
    res.sendStatus(500);
  } else {
    const document = parseHtml(actionRes.body);
    const examsElements = document.querySelector("#exam").childNodes.slice(1);

    // TODO: another endpoint for downloading progress reports

    // request results for each exam
    const resultsResponses =
        await Promise.all(examsElements
            .map((examOption) => requestExamById(examOption, cookies)));

    if (hasError(resultsResponses)) {
      res.sendStatus(500);
    } else {
      try {
        const examPages = resultsResponses.map((res) => parseHtml(res.body));
        const examResults = parseExamResults(examPages);

        const reportsRows = document.querySelector(".form").childNodes.slice(2);
        // IS THERE PLACEHOLDER TEXT IF NO REPORTS?
        // if so, parseReports may run into an error trying to parse it
        const reports = reportsRows.length > 0 ?
            parseReports(reportsRows) : [];

        res.send({ examResults, reports });
      } catch (err) {
        res.sendStatus(500);
      }
    }
  }
};

module.exports = getExamResultsAndReports;
