const express = require("express");
const helmet = require("helmet");
require("babel-polyfill");

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

// ISP routes
require("./isp/ispRoutes.js")(app);

// SLS route
require("./sls/slsRoutes.js")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`App listening on port ${PORT}.`);

// redirect to 404
app.use((_, res) => {
  res.status(404).redirect("/404.html");
});
