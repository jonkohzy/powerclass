/*fetch("/api/sls", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        user: "",
        pass: ""
    })
}).then((res) => res.json()).then((response) => {*/
    const response = ["Check it", "Help", "JONATHAN"];
    console.log(response);
    const BODY = document.getElementsByClassName("school")[0];
    response.forEach((element) => {
        const ROW = document.createElement("tr");
        const DATA = document.createElement("td");
        DATA.textContent = element;

        ROW.appendChild(DATA);
        BODY.appendChild(ROW);
    });
//});