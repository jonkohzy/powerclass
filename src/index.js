// modules
const express = require("express");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);
require("babel-polyfill");

// program start
const app = express();

app.use(helmet());

// parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  fs.readFile("public/index.html", (err, data) => {
    if (err) {
      res.status(500).send("There was an error reading the file.");
      throw err;
    }
    res.header("Content-Type", "text/html").send(data);
  });
});

app.post("/api/sls", async (req, res) => {
  const { user, pass } = req.body;
  try {
    if (user && pass) {
      const { stdout, stderr } = await execFile("node", [
        path.resolve(__dirname, "get-sls-assignments.js"), user, pass]);

      if (stderr) throw Error(stderr.trim());

      // ignores all but the first line (warnings, etc.)
      const assignments = stdout.split("\n")[0];
      // JSON.parse() because assignments is a stringified array
      res.send(JSON.parse(assignments));
    } else {
      throw Error("Username and/or password not provided.");
    }
  } catch (err) {
    if (err.message === "Incorrect username or password."
      || err.message === "Username and/or password not provided.") {
      res.status(401).send(err.message);
    } else {
      res.sendStatus(500);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`App listening on port ${PORT}.`);
