const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
require("babel-polyfill");
const mongoose = require("mongoose");

const User = require("./models/userModel");

/* APP INIT */
const app = express();

app.use(helmet());
app.enable("trust proxy");
app.use(express.json());

const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/powerclass";

// connect to DB
mongoose.connect(mongoUrl, { useNewUrlParser: true });

// express sessions
app.use(session({
  secret: process.env.SESSION_SECRET || "bonus ducks!",
  cookie: {
    // if in production, cookie's Secure option is set
    secure: process.env.NODE_ENV === "production",
  },
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ url: mongoUrl }),
}));

// auto HTTPS redirect
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect(`https://${req.headers.host + req.originalUrl}`);
    }
  });
}

/* ROUTES */
app.use(require("./isp/ispRoutes.js"));
app.use(require("./sls/slsRoutes.js"));
app.use(require("./users/usersRoutes.js"));

app.get("/error-pages/*", (_, res) => {
  res.sendFile("404.html", { root: "public/error-pages" });
});

app.get("*", async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.session.userId).exec();
    if (foundUser) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.sendFile("500.html", { root: "public/error-pages" });
  }
});

// apply static routes after special cases
app.use(express.static("public"));

// redirect to 404 (last route after nothing matches)
app.use((_, res) => {
  res.sendFile("404.html", { root: "public/error-pages" });
});

/* LISTEN */
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`App listening on port ${PORT}.`);
