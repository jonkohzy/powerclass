// panel expansion toggle
document.querySelectorAll(".panel").forEach((elem) => {
  elem.addEventListener("click", () => {
    elem.classList.toggle("panel-expanded");
  });
});

// collapse panel on pressing Esc
document.addEventListener("keydown", ({ key }) => {
  if (key === "Escape") {
    document.querySelector(".panel-expanded")
        .classList.remove("panel-expanded");
  }
});

const requestOptions = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user: localStorage.getItem("user"),
    pass: localStorage.getItem("pass"),
  }),
};

// announcements
const fetchDisplayAnnouncements = async () => {
  const announcements = await fetch("/api/isp/announcements", requestOptions)
      .then((res) => res.json());
  
  
};
