const router = require("express").Router();

const {
  GENERIC_OK,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
} = require("./authResponses.js");
const loginHandler = require("./login.js");
const User = require("../models/userModel.js");

router.get(["/", "/index.html"], async (req, res) => {
  try {
    const foundUser = await User.findById(req.session.userId).exec();
    if (foundUser) {
      res.redirect("/dashboard.html");
    } else {
      res.sendFile("index.html", { root: "public" });
    }
  } catch (err) {
    res.sendFile("500.html", { root: "public/error-pages" });
  }
});

router.post("/api/login", loginHandler);

router.get("/api/check-first-login", async (req, res) => {
  try {
    const foundUser = await User.findById(req.session.userId).exec();
    if (foundUser) {
      res.send({ ...GENERIC_OK, firstLogin: foundUser.firstLogin });
    } else {
      res.send(FORBIDDEN);
    }
  } catch (err) {
    res.send(INTERNAL_SERVER_ERROR);
  }
});

router.post("/api/remove-first-login", async (req, res) => {
  try {
    const foundUser = await User.findById(req.session.userId).exec();
    if (foundUser) {
      foundUser.firstLogin = false;
      await foundUser.save();

      res.send(GENERIC_OK);
    } else {
      res.send(FORBIDDEN);
    }
  } catch (err) {
    res.send(INTERNAL_SERVER_ERROR);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((_err) => {
    res.redirect("/");
  });
});

module.exports = router;
