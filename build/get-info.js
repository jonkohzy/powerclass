"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var phantom = require("phantom");

require("babel-polyfill");

_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee3() {
  var USER_AGENT, steps, instance, page, stepNum, loadFinishCallback;
  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36";
          steps = [// 1. Login to SLS
          function () {
            page.evaluate(function (_ref2) {
              var user = _ref2.user,
                  pass = _ref2.pass;
              document.getElementById("username").value = user;
              document.getElementById("password").value = pass;
              document.getElementById("loginform").submit();
            }, {
              // user and pass are 3rd & 4th command-line args respectively
              user: process.argv[2],
              pass: process.argv[3]
            });
          },
          /*#__PURE__*/
          // 2. Retrieve complete tasks
          // In production, this retrieves INCOMPLETE tasks.
          // TODO: use someone else's account with incomplete tasks
          // and find the CSS selector for that
          // then change selectors.json
          _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", page.evaluate(function (_ref4) {
                      var divToClick = _ref4.divToClick,
                          taskNameSelectors = _ref4.taskNameSelectors;
                      var newTasksSelector = taskNameSelectors.newTasksSelector,
                          inProgressTasksSelector = taskNameSelectors.inProgressTasksSelector;

                      if (document.getElementById("loginErrorMessageBox")) {
                        // if page has #loginErrorMessageBox, wrong credentials provided
                        return "Incorrect username or password.";
                      } // click on assignments div to open assignments


                      document.querySelector(divToClick).click(); // retrieve new task and in progress task names

                      var newTasks = _toConsumableArray(document.querySelectorAll(newTasksSelector)).map(function (elem) {
                        return elem.textContent;
                      });

                      var inProgressTasks = _toConsumableArray(document.querySelectorAll(inProgressTasksSelector)).map(function (elem) {
                        return elem.textContent;
                      });

                      return newTasks.concat(inProgressTasks);
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
          stepNum = 0;

          loadFinishCallback =
          /*#__PURE__*/
          function () {
            var _ref5 = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee2() {
              var result, assignments;
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (!(stepNum >= steps.length)) {
                        _context2.next = 2;
                        break;
                      }

                      return _context2.abrupt("return");

                    case 2:
                      if (!(stepNum === 1)) {
                        _context2.next = 10;
                        break;
                      }

                      _context2.next = 5;
                      return steps[stepNum]();

                    case 5:
                      result = _context2.sent;

                      if (result === "Incorrect username or password.") {
                        // console.error() is treated as stderr
                        console.error(result);
                      } else if (result instanceof Array) {
                        assignments = result; // console.log() is treated as stdout

                        console.log(JSON.stringify(assignments));
                      } else {
                        console.error("An unknown error occurred.");
                      }

                      instance.exit();
                      _context2.next = 11;
                      break;

                    case 10:
                      steps[stepNum]();

                    case 11:
                      stepNum++;

                    case 12:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            }));

            return function loadFinishCallback() {
              return _ref5.apply(this, arguments);
            };
          }();

          page.on("onLoadFinished", loadFinishCallback);
          _context3.next = 14;
          return page.open("https://vle.learning.moe.edu.sg/login");

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3);
}))()["catch"](function (err) {
  console.error(err);
});