// modules
const express = require("express");
const helmet = require("helmet");
const fs = require("fs");
require("babel-polyfill");

// local files
const getInfo = require("./get-info");

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
  res.send(await getInfo());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`App listening on port ${PORT}.`);
