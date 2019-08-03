// panel expansion toggle
document.querySelectorAll(".panel").forEach((elem) => {
  elem.addEventListener("click", () => {
    elem.classList.toggle("panel-expanded");
  });
});

// collapse panel on pressing Esc
document.addEventListener("keydown", ({ key }) => {
  const expandedPanel = document.querySelector(".panel-expanded");
  if (expandedPanel && key === "Escape") {
    expandedPanel.classList.remove("panel-expanded");
  }
});

const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: localStorage.getItem("ispCredentials"),
};

// announcements
const fetchDisplayAnnouncements = async () => {
  const announcements = await fetch("/api/isp/announcements", requestOptions)
      .then((res) => res.json());
  
  
};
