const unirest = require("unirest");

const { btoa } = require("../atob-btoa.js");

const login = async (user, pass, res) => {
  const authRes = await unirest("POST", "https://isphs.hci.edu.sg/pwd_auth.asp")
      .headers({
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .form({
        x: user,
        v: btoa(pass),
      });

  if (authRes.error) {
    res.sendStatus(500);
  } else if (authRes.body.includes("/error700.asp")) {
    res.status(401).send("Invalid username or password.");
  } else {
    res.sendStatus(200);
  }
};

const loginHandler = (req, res) => {
  // TODO: express session handling
  // store username in req.session here
  const { user, pass } = req.body;

  if (typeof user !== "string" || typeof pass !== "string") {
    res.sendStatus(400);
  } else if (!user.trim() || !pass.trim()) {
    res.status(401).send("Username and/or password not provided.");
  } else {
    login(user, pass, res);
  }
};

module.exports = loginHandler;
