"use strict";

// init required modules
var express = require("express");

var helmet = require("helmet");

var fs = require("fs"); // init server


var app = express(); // Heroku sets PORT environment var, while local machine does not
// lets this run on both Heroku and local machine

var PORT = process.env.PORT || 3000; // a bit more security

app.use(helmet()); // default route accessed by browsers ("/" is server root)
// req is request sent by client, res is server response

app.get("/", function (req, res) {
  // read HTML file
  fs.readFile("public/index.html", function (err, data) {
    if (err) {
      // status code 500 is Internal Server Error
      res.status(500).send("There was an error reading the file.");
      throw err;
    } // this makes browser display HTML instead of downloading file
    // .send(data) sends HTML to client


    res.header("Content-Type", "text/html").send(data); // as per above, Express methods can be chained one after another.
  });
}); // make app listen for requests on PORT

app.listen(PORT);
console.log("App listening on port ".concat(PORT, "."));