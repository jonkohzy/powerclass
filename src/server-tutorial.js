// init required modules
const express = require("express");
const helmet = require("helmet");
const fs = require("fs");

// init server
const app = express();
// Heroku sets PORT environment var, while local machine does not
// lets this run on both Heroku and local machine
const PORT = process.env.PORT || 3000;

// a bit more security
app.use(helmet());

// default route accessed by browsers ("/" is server root)
// req is request sent by client, res is server response
app.get("/", (req, res) => {
  // read HTML file
  fs.readFile("public/index.html", (err, data) => {
    if (err) {
      // status code 500 is Internal Server Error
      res.status(500).send("There was an error reading the file.");
      throw err;
    }

    // this makes browser display HTML instead of downloading file
    // .send(data) sends HTML to client
    res.header("Content-Type", "text/html").send(data);
    // as per above, Express methods can be chained one after another.
  });
});

// make app listen for requests on PORT
app.listen(PORT);
console.log(`App listening on port ${PORT}.`);
