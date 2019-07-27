const user = localStorage.getItem("user");
const pass = localStorage.getItem("pass");

const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user, pass }),
};

const fetchAnnouncements = async () => {
  const announcements = await fetch("/api/isp/announcements", requestOptions)
      .then((res) => res.json());

  const [first, second, third, ...notDisplayed] = announcements;

  // remove "Loading..."
  const announcementsDiv = document
      .getElementsByClassName("announcements-preview")[0];
  announcementsDiv.textContent = "";

  [first, second, third].forEach(({
    text,
    createdBy,
    date,
  }) => {
    const announcementCard = document.createElement("div");
    announcementCard.className = "announcement card";
    announcementCard.onclick = () => {
      window.location = "school-matters/announcements.html";
    };

    // announcement title
    const announcementText = document.createElement("div");
    announcementText.className = "announcement-text";
    announcementText.textContent = text;

    // announcement details
    const announcementDetails = document.createElement("div");

    const createdBySpan = document.createElement("span");
    createdBySpan.textContent = "Created by ";
    const authorSpan = document.createElement("b");
    authorSpan.textContent = createdBy;
    const onSpan = document.createElement("span");
    onSpan.textContent = " on ";
    const dateSpan = document.createElement("b");
    dateSpan.textContent = date;

    announcementDetails.appendChild(createdBySpan);
    announcementDetails.appendChild(authorSpan);
    announcementDetails.appendChild(onSpan);
    announcementDetails.appendChild(dateSpan);

    // append title and details to card
    announcementCard.appendChild(announcementText);
    announcementCard.appendChild(announcementDetails);

    // append card to page
    announcementsDiv.appendChild(announcementCard);
  });

  // append view more link
  if (notDisplayed.length > 0) {
    const viewMoreLink = document.createElement("a");
    viewMoreLink.href = "school-matters/announcements.html";
    viewMoreLink.className = "view-more";
    viewMoreLink.textContent = `View ${notDisplayed.length} more for this month`;

    document.querySelector(".announcements .gradient-protector")
        .appendChild(viewMoreLink);
  }
};


const fetchEvents = async () => {
  const { today, tomorrow, next1Week } =
      await fetch("/api/isp/events", requestOptions)
          .then((res) => res.json());

  const eventsToDisplay = [...today, ...tomorrow, ...next1Week]
      .slice(0, 3);

  // TODO: remove "Loading... "

  eventsToDisplay.forEach(({ eventName, date }) => {
    const eventCard = document.createElement("div");
    eventCard.className = "event card";
    eventCard.onclick = () => {
      window.location = "school-matters/events.html";
    };

    // TODO: bleh
  });
};

fetchAnnouncements()
    .then(fetchEvents);
