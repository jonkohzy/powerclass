const unirest = require("unirest");
const parseHtml = require("node-html-parser").parse;
const _ = require("lodash");

const parseCipActivities = (elements) => {
  // table has 12 columns
  // so each activity's details are a chunk of 12 table cells
  const rawActivityDetails = _.chunk(elements, 12);

  const activities = rawActivityDetails.map((details) => ({
    activityName: details[1].structuredText,
    organisation: details[2].structuredText,
    type: details[3].structuredText,
    period: details[4].structuredText,
    role: details[5].structuredText,
    hours: parseInt(details[6].structuredText),
    status: details[7].structuredText,
  }));

  return activities;
};

const getCip = async (res, cookies) => {
  const actionRes = await unirest("GET", "https://isphs.hci.edu.sg/students/cip.asp")
      .jar(cookies);

  if (actionRes.error) {
    res.sendStatus(500);
  } else {
    const document = parseHtml(actionRes.body);

    // get total CIP hours
    const rawTotalHours = document.querySelectorAll("th.form")[1]
        .structuredText.split(" ")[3];
    const totalCipHours = parseInt(rawTotalHours);

    // get CIP activities
    const elements = [...document.querySelectorAll("td.form3")].slice(1);
    // remove extra row (the "Add Activity" button)
    elements.pop();

    const activities = parseCipActivities(elements);

    res.send({ totalCipHours, activities });
  }
};

module.exports = getCip;
