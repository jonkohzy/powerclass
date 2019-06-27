const unirest = require("unirest");
const parseHtml = require("node-html-parser").parse;

const getSelectedOption = require("../utility/getSelectedOption.js");

const parseParticulars = (elements) => ({
  name: elements[0].structuredText,
  chineseName: elements[1].structuredText,
  gender: elements[2].structuredText,
  photoUrl: `https://isphs.hci.edu.sg${elements[8].childNodes[0].attributes.href}`,
  dateOfBirth: elements[9].structuredText,
  race: getSelectedOption(elements[10].childNodes[0]),
  citizenship: elements[11].structuredText.split("\n")[0],
  religion: getSelectedOption(elements[12].childNodes[0]),
  primarySchool: getSelectedOption(elements[13].childNodes[0]),
  psleTScore: elements[14].structuredText,
});

const getParticulars = async (res, cookies) => {
  const actionRes = await unirest("GET", "https://isphs.hci.edu.sg/profile/index.asp")
      .jar(cookies);

  if (actionRes.error) {
    res.sendStatus(500);
  } else {
    try {
      const document = parseHtml(actionRes.body);
      const particularsElements = document.querySelectorAll(".form3");

      const particulars = parseParticulars(particularsElements);

      res.send(particulars);
    } catch (err) {
      res.sendStatus(500);
    }
  }
};

module.exports = getParticulars;
