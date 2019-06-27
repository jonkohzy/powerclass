const unirest = require("unirest");
const parseHtml = require("node-html-parser").parse;

const hasError = require("../utility/resArrayHasError.js");

const parseAnnouncements = (announcementsPages) => {
  const announcements = announcementsPages.map((document) => {
    const announcementPageDetailsRows = document.querySelector(".form").childNodes[2].childNodes[0].childNodes[2].childNodes.slice(2, 9);

    const announcementPageDetails = announcementPageDetailsRows
        .map((elem) => elem.childNodes[1]);

    const additionalDetailsText = announcementPageDetails[1].structuredText;
    const attachedFileLink = announcementPageDetails[6].childNodes[0];

    const announcement = {
      text: announcementPageDetails[0].structuredText,
      additionalDetails: additionalDetailsText ? additionalDetailsText : null,
      createdBy: announcementPageDetails[4].structuredText,
      date: announcementPageDetails[5].structuredText,
      // if there is an attached file, get its link
      // else, return null
      attachedFileLink: attachedFileLink ?
          `https://isphs.hci.edu.sg/${attachedFileLink.attributes.href}` :
          null,
    };

    return announcement;
  });

  return announcements;
};

const requestAnnouncementById = (detailsElement, cookies) => {
  const announcementId = detailsElement.childNodes[5].childNodes[1].attributes.href.match(/(?<=ID=)\d+/);
  return unirest("GET", `https://isphs.hci.edu.sg/viewannounce.asp?ID=${announcementId}`)
      .jar(cookies);
};

const getAnnouncements = async (res, cookies) => {
  const actionRes = await unirest("GET", "https://isphs.hci.edu.sg/announcements.asp")
      .jar(cookies);

  if (actionRes.error) {
    res.sendStatus(500);
  } else {
    const document = parseHtml(actionRes.body);
    const announcementsElements = document.querySelector(".form").querySelectorAll("tr").slice(1);

    // request announcement details for each announcement
    const detailsResponses =
        await Promise.all(announcementsElements
            .map((detailsElement) => requestAnnouncementById(detailsElement, cookies)));

    if (hasError(detailsResponses)) {
      res.sendStatus(500);
    } else {
      try {
        const announcementsPages = detailsResponses.map((res) => parseHtml(res.body));
        const announcements = parseAnnouncements(announcementsPages);

        res.send(announcements);
      } catch (err) {
        res.sendStatus(500);
      }
    }
  }
};

module.exports = getAnnouncements;
