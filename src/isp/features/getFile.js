const https = require("https");
const mime = require("mime");

const getFile = (res, cookies, req) => {
  // get raw cookie key and value for use in HTTPS request
  const cookieKey = Object.keys(cookies._jar.store.idx["isphs.hci.edu.sg"]["/"])[0];
  const cookieVal = cookies._jar.store.idx["isphs.hci.edu.sg"]["/"][cookieKey].value;

  if (!req.query.fileLink) {
    res.status(400).send("URL of file to download was not provided.");
    return;
  }

  const fileReq = https.request({
    host: "isphs.hci.edu.sg",
    path: req.query.fileLink,
    method: "GET",
    headers: {
      Cookie: `${cookieKey}=${cookieVal};`,
    },
  }, (fileRes) => {
    if (fileRes.statusCode === 400) {
      // stops error because of Content-Disposition header being undefined
      res.status(400).send("Invalid file URL.");
      return;
    }

    fileRes.on("error", () => {
      res.sendStatus(500);
    });

    const chunks = [];
    fileRes.on("data", (chunk) => {
      chunks.push(chunk);
    });

    fileRes.on("end", () => {
      const data = Buffer.concat(chunks);

      const filename = fileRes.headers["content-disposition"]
          .match(/(?<=filename=).+/)[0];
      const mimeType = mime.getType(filename) || "application/octet-stream";

      res.set({
        "Content-Type": mimeType, // I love standards compliance! The school doesn't...
        "Content-Disposition": fileRes.headers["content-disposition"],
      }).send(data);
    });
  });

  fileReq.on("error", () => {
    res.sendStatus(500);
  });
  fileReq.end();
};

module.exports = getFile;
