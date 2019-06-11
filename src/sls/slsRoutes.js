const runSlsScrape = require("./runSlsScrape.js");

module.exports = (app) => {
  app.post("/api/sls", async (req, res) => {
    const { user, pass } = req.body;

    if (typeof user !== "string" || typeof pass !== "string") {
      res.sendStatus(400);
    } else if (!user.trim() || !pass.trim()) {
      res.status(401).send("Username and/or password not provided.");
    } else {
      runSlsScrape(user, pass, res);
    }
  });
};
