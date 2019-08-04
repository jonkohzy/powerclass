// panel expansion toggle
document.querySelectorAll(".panel").forEach((panel) => {
  panel.addEventListener("click", () => {
    panel.classList.toggle("panel-expanded");
  });
});

// collapse panel on pressing Esc
document.addEventListener("keydown", ({ key }) => {
  const expandedPanel = document.querySelector(".panel-expanded");
  if (expandedPanel && key === "Escape") {
    expandedPanel.classList.remove("panel-expanded");
  }
});

// disable panel shrinking when link inside is clicked
document.querySelectorAll(".panel a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: localStorage.getItem("ispCredentials"),
};

const fetchDisplayAnnouncements = async () => {
  const announcements = await fetch("/api/isp/announcements", requestOptions)
      .then((res) => res.json());

  // display number of announcements
  document.querySelector(".announcements .panel-subtitle")
      .textContent = `${announcements.length} announcements this month`;

  const announcementsToDisplay = announcements.slice(0, 3);

  // display "view more" if >3 announcements
  const numAnnouncementsNotDisplayed =
      announcements.length - announcementsToDisplay.length;

  if (numAnnouncementsNotDisplayed > 0) {
    const viewMoreLink = document.querySelector(".announcements .view-more");
    viewMoreLink.style.height = "34px";
    viewMoreLink.style.opacity = "1";
    viewMoreLink.textContent = `View ${numAnnouncementsNotDisplayed} more`;
  }

  // append announcements to page
  const announcementsList = document.getElementById("announcements-list");
  announcementsToDisplay.forEach(({
    text,
    createdBy,
    date,
  }) => {
    const announcementCard = document.createElement("div");
    announcementCard.className = "announcement list-card card";
    announcementCard.onclick = (event) => {
      window.location = "/school-matters/announcements.html";
      event.stopPropagation(); // stop panel from shrinking
    };

    // title
    const announcementTextDiv = document.createElement("div");
    announcementTextDiv.className = "list-card-text";
    announcementTextDiv.textContent = text;

    // details
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "list-card-details";

    const authorBold = document.createElement("b");
    authorBold.textContent = createdBy;

    const dateBold = document.createElement("b");
    dateBold.textContent = date;

    detailsDiv.append("Created by ", authorBold, " on ", dateBold);
    announcementCard.append(announcementTextDiv, detailsDiv);
    announcementsList.append(announcementCard);
  });
};

const fetchDisplayEvents = async () => {
  const { today, tomorrow, next1Week } = await fetch("/api/isp/events", requestOptions)
      .then((res) => res.json());
  const eventsWithPossibleDuplicates = [...today, ...tomorrow, ...next1Week];

  // remove duplicates
  const allEvents = eventsWithPossibleDuplicates.filter((eventObj, idx) =>
    idx === eventsWithPossibleDuplicates.findIndex((eventObj2) =>
      JSON.stringify(eventObj) === JSON.stringify(eventObj2)));

  // display number of events
  document.querySelector(".events .panel-subtitle")
      .textContent = `${allEvents.length} events for the next week`;

  const eventsToDisplay = allEvents.slice(0, 3);

  // display "view more" if >3 events
  const numEventsNotDisplayed = allEvents.length - eventsToDisplay.length;

  if (numEventsNotDisplayed > 0) {
    const viewMoreLink = document.querySelector(".events .view-more");
    viewMoreLink.style.height = "34px";
    viewMoreLink.style.opacity = "1";
    viewMoreLink.textContent = `View ${numEventsNotDisplayed} more`;
  }

  // append events to page
  const eventsList = document.getElementById("events-list");
  eventsToDisplay.forEach(({
    eventName,
    date,
  }) => {
    const eventCard = document.createElement("div");
    eventCard.className = "event list-card card";
    eventCard.onclick = (event) => {
      window.location = "/school-matters/events.html";
      event.stopPropagation(); // stop panel from shrinking
    };

    // event name
    const eventNameDiv = document.createElement("div");
    eventNameDiv.className = "list-card-text";
    eventNameDiv.textContent = eventName;

    // event date
    const eventDateDiv = document.createElement("div");
    eventDateDiv.className = "list-card-details";
    eventDateDiv.textContent = date;

    eventCard.append(eventNameDiv, eventDateDiv);
    eventsList.append(eventCard);
  });
};

const fetchDisplayCipDiscipline = async () => {
  const { totalCipHours } = await fetch("/api/isp/cip", requestOptions)
      .then((res) => res.json());
  const { totalDemeritPoints } = await fetch("/api/isp/discipline", requestOptions)
      .then((res) => res.json());

  // display stats in subtitles
  const [cipSubtitle, disciplineSubtitle] =
      document.querySelectorAll(".cip-discipline .panel-subtitle");

  cipSubtitle.textContent = `${totalCipHours} CIP hours`;
  disciplineSubtitle.textContent = `${totalDemeritPoints} demerit points`;

  // display large numbers
  document.querySelector(".cip .large-number").textContent = totalCipHours;
  document.querySelector(".discipline .large-number").textContent
      = totalDemeritPoints;
};

fetchDisplayAnnouncements()
    .then(fetchDisplayEvents)
    .then(fetchDisplayCipDiscipline);
