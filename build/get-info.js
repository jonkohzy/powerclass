"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var phantom = require("phantom");

var getInfo =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var USER_AGENT, steps, instance, page, stepNum, assignments, loadFinishCallback;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36";
            steps = [// 1. Login to SLS
            function () {
              page.evaluate(function () {
                document.getElementById("username").value = "HOWIN7977D";
                document.getElementById("password").value = "Promise.resolve(42)";
                document.getElementById("loginform").submit();
              });
            },
            /*#__PURE__*/
            // 2. Retrieve complete tasks
            // In production, this retrieves INCOMPLETE tasks.
            _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      return _context.abrupt("return", page.evaluate(function (_ref3) {
                        var assignmentsDivSelector = _ref3.assignmentsDivSelector,
                            assignmentTitleSelector = _ref3.assignmentTitleSelector;
                        // click on assignments div to open assignments
                        document.querySelector(assignmentsDivSelector).click();
                        return _toConsumableArray(document.querySelectorAll(assignmentTitleSelector)).map(function (assignmentTitleElem) {
                          return assignmentTitleElem.textContent;
                        });
                      }, require("./selectors.json")));

                    case 1:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }))];
            _context3.next = 4;
            return phantom.create();

          case 4:
            instance = _context3.sent;
            _context3.next = 7;
            return instance.createPage();

          case 7:
            page = _context3.sent;
            page.setting("userAgent", USER_AGENT);
            page.on("onUrlChanged", function (target) {
              console.log("Redirecting to ".concat(target));
            });
            /* page.on("onResourceRequested", ({ url }) => {
              console.log(`Requesting ${url}`);
            }); */

            page.on("onConsoleMessage", function (msg) {
              console.log(msg);
            });
            page.on("onLoadStarted", function () {
              console.log("Load started");
            });
            stepNum = 0;
            assignments = [];

            loadFinishCallback =
            /*#__PURE__*/
            function () {
              var _ref4 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2(status) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        console.log("Load finished - status: ".concat(status, "."));

                        if (!(stepNum >= steps.length)) {
                          _context2.next = 4;
                          break;
                        }

                        console.log("Steps done.");
                        return _context2.abrupt("return");

                      case 4:
                        console.log("Executing step ".concat(stepNum));

                        if (!(stepNum === 1)) {
                          _context2.next = 12;
                          break;
                        }

                        _context2.next = 8;
                        return steps[stepNum]();

                      case 8:
                        assignments = _context2.sent;
                        console.log(assignments);
                        _context2.next = 13;
                        break;

                      case 12:
                        steps[stepNum]();

                      case 13:
                        stepNum++;

                      case 14:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function loadFinishCallback(_x) {
                return _ref4.apply(this, arguments);
              };
            }();

            page.on("onLoadFinished", loadFinishCallback);
            _context3.next = 18;
            return page.open("https://vle.learning.moe.edu.sg/login");

          case 18:
            return _context3.abrupt("return", assignments);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getInfo() {
    return _ref.apply(this, arguments);
  };
}();

module.exports = getInfo;