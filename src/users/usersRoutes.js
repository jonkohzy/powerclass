const router = require("express").Router();

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

module.exports = router;
