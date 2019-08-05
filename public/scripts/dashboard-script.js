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

// check for first login
fetch("/api/check-first-login")
    .then((res) => res.json())
    .then(({ firstLogin }) => {
      if (firstLogin) {
        // show the dialog
      }
    });

const removeFirstLogin = async () => {
  const { success } = await fetch("/api/remove-first-login", { method: "POST" })
      .then((res) => res.json());

  if (success) {
    // close dialog
  } else {
    // display error message somewhere in dialog, don't close it
  }
};
// TODO: first login setup dialog
// if firstLogin: true in response from /api/check-first-login, show setup dialog
// when setup dialog COMPLETED (not finished halfway), POST to /api/remove-first-login
// (call removeFirstLogin)

// get school matters
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

/* SLS integration */

// for some reason I need to do this to stop Chrome autofilling
setTimeout(() => {
  document.getElementById("sls-username").value = "";
  document.getElementById("sls-password").value = "";
}, 70);

document.forms[0].addEventListener("submit", (event) => {
  event.preventDefault();

  document.getElementById("login-button").classList.add("login-button-loading");
  document.getElementsByClassName("loading-circle-wrapper")[0]
      .style.opacity = "1";

  checkSlsCredentials();
});

const displayError = (message) => {
  // revert element styles to previous unsubmitted state
  document.getElementsByClassName("loading-circle-wrapper")[0]
      .style.opacity = "0";
  document.getElementById("login-button").classList.remove("login-button-loading");

  // display error
  const errorDiv = document.getElementById("error");
  errorDiv.style.display = "block";
  errorDiv.textContent = message;
};

const checkSlsCredentials = () => {
  // hide error
  const errorDiv = document.getElementById("error");
  errorDiv.style.display = "none";
  errorDiv.textContent = "";

  const slsUser = document.getElementById("sls-username").value;
  const slsPass = document.getElementById("sls-password").value;

  if (!slsUser.trim() || !slsPass.trim()) {
    displayError("Username and/or password not provided.");
    return;
  }

  fetch("/api/sls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: slsUser, pass: slsPass }),
  })
      .then(async (res) => {
        if (res.status === 200) {
          localStorage.setItem("slsCredentials", JSON.stringify({
            user: slsUser,
            pass: slsPass,
          }));

          document.getElementsByClassName("loading-circle-wrapper")[0]
              .style.opacity = "0";

          // make login button indicate success
          const loginButton = document.getElementById("login-button");
          loginButton.classList.remove("login-button-loading");
          loginButton.classList.add("login-button-success");
          loginButton.textContent = "Success!";
          // disable login button
          loginButton.disabled = true;

          // disable editing username & password
          document.querySelectorAll(".sls-credentials-form input")
              .forEach((input) => {
                input.disabled = true;
              });

          // enable "Next" button
          document.querySelector(".sls-setup .next-button").disabled = false;

          const slsAssignments = await res.json();
          // display under Outstanding Work
        } else {
          const errorMessage = await res.text();
          displayError(errorMessage);
        }
      });
};

const nextPanelSlsToClassroom = () => {
  // advance progress bar
  document.getElementsByClassName("progress-indicator-completed")[0]
      .style.width = "calc(66% + 5px)"; // increase by 33%
  // wait for progress-indicator-completed to finish lengthening
  // only 600ms (not 1s) to avoid weird delay between indicator reaching
  // and circle changing colour
  setTimeout(() => {
    document.getElementById("progress-circle-3").classList
        .add("progress-circle-completed");
  }, 600);

  // switch step-details div
  document.querySelector(".sls-step-details span").style.opacity = "0";
  // wait for opacity to fade (0.3s)
  setTimeout(() => {
    document.querySelector(".sls-step-details").style.display = "none";
    document.querySelector(".classroom-step-details").style.display = "inline-flex";
    document.querySelector(".classroom-step-details").style.opacity = "1";
  }, 300);

  // switch setup div
  const slsSetupDiv = document.getElementsByClassName("sls-setup")[0];
  const classroomSetupDiv =
      document.getElementsByClassName("google-classroom-setup")[0];
  slsSetupDiv.style.opacity = "0";
  // wait for opacity to fade (0.3s)
  setTimeout(() => {
    slsSetupDiv.style.display = "none";
    classroomSetupDiv.style.display = "block";
    classroomSetupDiv.style.opacity = "1";
  }, 300);
};
