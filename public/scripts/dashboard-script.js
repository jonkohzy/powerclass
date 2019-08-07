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

// get outstanding work
// called only after Google API initialises
// in updateSigninStatus()
const fetchDisplayOutstandingWork = async () => {
  const [coursesSubtitle, slsSubtitle] =
      document.querySelectorAll(".outstanding-work .panel-subtitle");
  const [coursesLargeNumber, slsLargeNumber] =
      document.querySelectorAll(".outstanding-work .large-number");

  // no await for requests - can be loaded concurrently
  // unlike ISP, which only allows one login at a time

  gapi.client.classroom.courses.list({
    pageSize: 0,
  }).then(({ result: { courses } }) => {
    coursesSubtitle.textContent =
        `${courses.length || "No"} courses with outstanding work`;
    coursesLargeNumber.textContent = courses.length;
  });

  fetch("/api/sls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: localStorage.getItem("slsCredentials"),
  })
      .then((res) => res.json())
      .then((assignments) => {
        slsSubtitle.textContent = `${assignments.length || "No"} SLS assignments`;
        slsLargeNumber.textContent = assignments.length;
      });
};

// get school matters
const ispRequestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: localStorage.getItem("ispCredentials"),
};

const fetchDisplayAnnouncements = async () => {
  const announcements = await fetch("/api/isp/announcements", ispRequestOptions)
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
  const { today, tomorrow, next1Week } = await fetch("/api/isp/events", ispRequestOptions)
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
  const { totalCipHours } = await fetch("/api/isp/cip", ispRequestOptions)
      .then((res) => res.json());
  const { totalDemeritPoints } = await fetch("/api/isp/discipline", ispRequestOptions)
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

/* SETUP DIALOG */

// if first login, show setup dialog
fetch("/api/check-first-login")
    .then((res) => res.json())
    .then(({ firstLogin }) => {
      if (firstLogin) {
        document.getElementsByClassName("first-login-setup")[0]
            .style.display = "flex";
      }
    });

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

const displaySlsError = (message) => {
  // revert element styles to previous unsubmitted state
  document.getElementsByClassName("loading-circle-wrapper")[0]
      .style.opacity = "0";
  document.getElementById("login-button").classList.remove("login-button-loading");

  // display error
  const errorDiv = document.querySelector(".sls-setup .error");
  errorDiv.style.display = "block";
  errorDiv.textContent = message;
};

const checkSlsCredentials = () => {
  // hide error
  const errorDiv = document.querySelector(".sls-setup .error");
  errorDiv.style.display = "none";
  errorDiv.textContent = "";

  const slsUser = document.getElementById("sls-username").value;
  const slsPass = document.getElementById("sls-password").value;

  if (!slsUser.trim() || !slsPass.trim()) {
    displaySlsError("Username and/or password not provided.");
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
          loginButton.title = "";
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
          displaySlsError(errorMessage);
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
    const classroomStepDetails =
        document.getElementsByClassName("google-classroom-step-details")[0];
    classroomStepDetails.style.display = "inline-flex";
    classroomStepDetails.style.opacity = "1";
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

/* Google Classroom integration */

const authoriseButton =
    document.getElementsByClassName("classroom-authorise-button")[0];

const displayGoogleClassroomError = (message) => {
  const errorDiv = document.querySelector(".google-classroom-setup .error");
  errorDiv.style.display = "block";
  errorDiv.textContent = message;
};

const updateSigninStatus = (isSignedIn) => {
  if (isSignedIn) {
    authoriseButton.classList.add("classroom-authorise-button-success");
    authoriseButton.textContent = "Authorised!";
    authoriseButton.disabled = true;

    // enable "Next" button
    document.querySelector(".google-classroom-setup .next-button").disabled
        = false;

    fetchDisplayOutstandingWork();
  } else {
    authoriseButton.classList.remove("classroom-authorise-button-success");
    authoriseButton.textContent = "Authorise";
    authoriseButton.disabled = false;

    // disable "Next" button
    document.querySelector(".google-classroom-setup .next-button").disabled
        = true;
  }
};

const initClient = () => {
  const CLIENT_ID = "167953657646-jdjmkp26lp14ut29gev2e7aqhv9ihsei.apps.googleusercontent.com";
  const API_KEY = "AIzaSyCVayniJVOK5iagM3LwR9H68q_HfvoL-jM";
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest"];
  const SCOPES = "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.rosters";

  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  }).then(() => {
    // listen for sign-in state changes
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // handle initial sign-in state
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }).catch((err) => {
    displayGoogleClassroomError(err.message);
  });
};

const handleClientLoad = () => {
  gapi.load("client:auth2", initClient);
};

const handleAuthClick = () => {
  gapi.auth2.getAuthInstance().signIn();
};

const nextPanelClassroomToComplete = () => {
  // advance progress bar
  document.getElementsByClassName("progress-indicator-completed")[0]
      .style.width = "100%";
  // wait for progress-indicator-completed to finish lengthening
  // only 600ms (not 1s) to avoid weird delay between indicator reaching
  // and circle changing colour
  setTimeout(() => {
    document.getElementById("progress-circle-4").classList
        .add("progress-circle-completed");
  }, 600);

  // switch step-details div
  document.querySelector(".google-classroom-step-details span").style
      .opacity = "0";
  // wait for opacity to fade (0.3s)
  setTimeout(() => {
    document.querySelector(".google-classroom-step-details").style
        .display = "none";
    const setupCompleteStepDetails =
        document.getElementsByClassName("setup-complete-step-details")[0];
    setupCompleteStepDetails.style.display = "inline-flex";
    setupCompleteStepDetails.style.opacity = "1";
  }, 300);

  // switch setup div
  const classroomSetupDiv =
      document.getElementsByClassName("google-classroom-setup")[0];
  const setupCompleteDiv =
      document.getElementsByClassName("setup-complete")[0];
  classroomSetupDiv.style.opacity = "0";
  // wait for opacity to fade (0.3s)
  setTimeout(() => {
    classroomSetupDiv.style.display = "none";
    setupCompleteDiv.style.display = "flex";
    setupCompleteDiv.style.opacity = "1";
  }, 300);
};

const completeSetup = async () => {
  fetch("/api/remove-first-login", { method: "POST" });
};

const closeSetupPanel = () => {
  const setupDiv = document.getElementsByClassName("first-login-setup")[0];
  setupDiv.style.opacity = "0";
  // wait for opacity to finish transitioning
  setTimeout(() => {
    setupDiv.style.display = "none";
  }, 300);
};
