const router = require("express").Router();

const loginHandler = require("./login.js");
const User = require("../models/userModel.js");

router.get(["/", "/index.html"], async (req, res) => {
  const foundUser = await User.findById(req.session.userId).exec();
  if (foundUser) {
    res.redirect("/dashboard.html");
  } else {
    res.sendFile("index.html", { root: "public" });
  }
});

router.post("/api/login", loginHandler);

module.exports = router;
