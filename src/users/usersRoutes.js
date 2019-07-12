const loginHandler = require("./login.js");

module.exports = (app) => {
  app.post("/api/login", loginHandler);
};
