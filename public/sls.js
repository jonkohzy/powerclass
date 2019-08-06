fetch("/api/sls", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: localStorage.getItem("slsCredentials"),
}).then((res) => res.json()).then((response) => {
    console.log(response);
    const BODY = document.getElementsByClassName("school")[0];
    if (response.length > 0) {
        response.forEach((element) => {
            const ROW = document.createElement("tr");
            const DATA = document.createElement("td");
            DATA.textContent = element;

            ROW.appendChild(DATA);
            BODY.appendChild(ROW);
        });
    } else {
        const noAssRow = document.createElement("tr");
        const noAssText = document.createElement("td");
        noAssText.style.backgroundColor = "#444";
        noAssText.style.color = "white";
        noAssText.textContent = "No SLS assignments.";

        noAssRow.append(noAssText);
        BODY.append(noAssRow);
    }
});