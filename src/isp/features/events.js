const unirest = require("unirest");
const parseHtml = require("node-html-parser").parse;
const _ = require("lodash");

const parseEventsFromElements = (eventsElements) => {
  const eventsArr = eventsElements
      .filter((elem) => elem.tagName === "table") // remove <br> tags in between
      .map((eventDetails) => {
        const rawEvents = eventDetails.structuredText.split("\n").slice(1);
        const eventDatePairs = _.chunk(rawEvents, 2);

        if (eventDatePairs[0][0] === "(No events found)") {
          // no events in this time period
          // return empty array
          return [];
        }

        return eventDatePairs.map(([eventName, date]) => ({ eventName, date }));
      });

  const events = {
    today: eventsArr[0],
    tomorrow: eventsArr[1],
    next1Week: eventsArr[2],
  };

  return events;
};

const getEvents = async (res, cookies) => {
  const actionRes = await unirest("GET", "https://isphs.hci.edu.sg/index.asp?")
      .jar(cookies);

  if (actionRes.error) {
    res.sendStatus(500);
  } else {
    try {
      const document = parseHtml(actionRes.body);
      const eventsElements = document.querySelector("#PageContent").childNodes[5].childNodes[1].childNodes[0].childNodes[6].childNodes[4].childNodes[0].childNodes.slice(4);

      const events = parseEventsFromElements(eventsElements);

      res.send(events);
    } catch (err) {
      res.sendStatus(500);
    }
  }
};

module.exports = getEvents;
