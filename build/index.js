"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// modules
var express = require("express");

var helmet = require("helmet");

var fs = require("fs");

var path = require("path");

var util = require("util");

var execFile = util.promisify(require("child_process").execFile);

require("babel-polyfill"); // program start


var app = express();
app.use(helmet()); // parse JSON request bodies

app.use(express.json());
app.get("/", function (req, res) {
  fs.readFile("public/index.html", function (err, data) {
    if (err) {
      res.status(500).send("There was an error reading the file.");
      throw err;
    }

    res.header("Content-Type", "text/html").send(data);
  });
});
app.post("/api/sls",
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, user, pass, _ref2, stdout, stderr;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, user = _req$body.user, pass = _req$body.pass;
            _context.prev = 1;

            if (!(user && pass)) {
              _context.next = 13;
              break;
            }

            _context.next = 5;
            return execFile("node", [path.resolve(__dirname, "get-info.js"), user, pass]);

          case 5:
            _ref2 = _context.sent;
            stdout = _ref2.stdout;
            stderr = _ref2.stderr;

            if (!stderr) {
              _context.next = 10;
              break;
            }

            throw Error(stderr.trim());

          case 10:
            // JSON.parse() because output is a stringified array
            res.send(JSON.parse(stdout));
            _context.next = 14;
            break;

          case 13:
            throw Error("Username and/or password not provided.");

          case 14:
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](1);

            if (_context.t0.message === "Incorrect username or password." || _context.t0.message === "Username and/or password not provided.") {
              res.status(401).send(_context.t0.message);
            } else {
              res.sendStatus(500);
            }

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 16]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("App listening on port ".concat(PORT, "."));