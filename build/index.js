"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// modules
var express = require("express");

var helmet = require("helmet");

var fs = require("fs");

require("babel-polyfill"); // local files


var getInfo = require("./get-info"); // program start


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
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = res;
            _context.next = 3;
            return getInfo();

          case 3:
            _context.t1 = _context.sent;

            _context.t0.send.call(_context.t0, _context.t1);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("App listening on port ".concat(PORT, "."));