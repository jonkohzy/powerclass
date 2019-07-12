const express = require("express");
const helmet = require("helmet");
require("babel-polyfill");

/* APP INIT */
const app = express();

app.use(helmet());
app.enable("trust proxy");
app.use(express.json());
app.use(express.static("public"));

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
require("./isp/ispRoutes.js")(app);
require("./sls/slsRoutes.js")(app);
require("./users/usersRoutes.js")(app);

// redirect to 404
app.use((_, res) => {
  res.redirect("/404.html");
});

/* LISTEN */
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`App listening on port ${PORT}.`);
