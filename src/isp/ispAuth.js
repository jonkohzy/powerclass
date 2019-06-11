const unirest = require("unirest");

const atob = (str) => Buffer.from(str, "base64").toString("utf8");
const btoa = (str) => Buffer.from(str).toString("base64");

const auth = async (method, action, user, pass, req, res) => {
  const cookies = unirest.jar();

  const authRes = await unirest("POST", "https://isphs.hci.edu.sg/pwd_auth.asp")
      .jar(cookies)
      .headers({
        "Content-Type": "application/x-www-form-urlencoded",
      })
      .form({
        // if method is GET, base64 decode user
        x: method === "POST" ? user : atob(user),
        // if method is GET, don't re-encode pass
        // (pass already base64 encoded)
        v: method === "POST" ? btoa(pass) : pass,
      });

  if (authRes.error) {
    // note: invalid Base64 string causes ISP to respond with 500
    // it should be fine if pass is a valid Base64 string
    // (especially for get-file)
    res.sendStatus(500);
  } else if (authRes.body.includes("/error700.asp")) {
    // invalid credentials
    res.status(401).send("Invalid username or password.");
  } else {
    // invoke callback
    action(res, cookies, req);
  }
};

const authHandler = ({ method, action }, req, res) => {
  // if method is POST, use req.body
  // else if it's GET, use req.query
  const { user, pass } = method === "POST" ? req.body : req.query;

  if (typeof user !== "string" || typeof pass !== "string") {
    res.sendStatus(400);
  } else if (!user.trim() || !pass.trim()) {
    res.status(401).send("Username and/or password not provided.");
  } else {
    // authenticate if credentials provided
    auth(method, action, user, pass, req, res);
  }
};

module.exports = authHandler;
