const unirest = require("unirest");

const { btoa } = require("../atob-btoa.js");
const authResponses = require("./authResponses.js");
const User = require("../models/userModel.js");

const login = async (user, pass, req, res) => {
  const authRes = await unirest("POST", "https://isphs.hci.edu.sg/pwd_auth.asp")
      .headers({
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .form({
        x: user,
        v: btoa(pass),
      });

  if (authRes.error) {
    res.status(500).send(authResponses.INTERNAL_SERVER_ERROR);
  } else if (authRes.body.includes("/error700.asp")) {
    res.status(401).send(authResponses.INVALID_CREDENTIALS);
  } else {
    try {
      const foundUser = await User.findOne({ username: user }).exec();
      if (foundUser) {
        req.session.userId = foundUser._id;
        res.send({ ...authResponses.OK, firstLogin: false });
      } else {
        const createdUser = await User.create({ username: user });
        req.session.userId = createdUser._id;
        res.send({ ...authResponses.OK, firstLogin: true });
      }
    } catch (err) {
      res.status(500).send(authResponses.INTERNAL_SERVER_ERROR);
    }
  }
};

const loginHandler = async (req, res) => {
  const { user, pass } = req.body;

  if (typeof user !== "string" || typeof pass !== "string") {
    res.status(400).send(authResponses.BAD_REQUEST);
  } else if (!user.trim() || !pass.trim()) {
    res.status(401).send(authResponses.MISSING_CREDENTIALS);
  } else {
    login(user, pass, req, res);
  }
};

module.exports = loginHandler;
