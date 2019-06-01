const express = require("express");
const helmet = require("helmet");
const path = require("path");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);
require("babel-polyfill");

const app = express();
app.use(helmet());
app.enable("trust proxy");

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    console.log(req.secure);
    if (req.secure) {
      next();
    } else {
      res.redirect(`https://${req.headers.host + req.originalUrl}`);
    }
  });
}

app.use(express.json());
app.use(express.static("public"));

// TODO: put core functions here (e.g. ISP authentication)
// put routes in files in separate folders for different functions
// export core functions from here, require them in files

app.post("/api/sls", async (req, res) => {
  const { user, pass } = req.body;

  if (typeof user !== "string" || typeof pass !== "string") {
    res.sendStatus(400);
  } else if (!user.trim() || !pass.trim()) {
    res.status(401).send("Username and/or password not provided.");
  } else {
    try {
      const { stdout, stderr } = await execFile("node", [
        path.resolve(__dirname, "get-sls-assignments.js"), user, pass]);

      if (stderr) throw Error(stderr.trim());

      // ignores all but the first line (warnings, etc.)
      const assignments = stdout.split("\n")[0];
      // JSON.parse() because assignments is a stringified array
      res.send(JSON.parse(assignments));
    } catch (err) {
      if (err.message === "Incorrect username or password.") {
        res.status(401).send(err.message);
      } else {
        res.sendStatus(500);
      }
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`App listening on port ${PORT}.`);

// redirect to 404
app.use((_, res) => {
  res.status(404).redirect("/404.html");
});
