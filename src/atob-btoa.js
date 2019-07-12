const atob = (str) => Buffer.from(str, "base64").toString("utf8");
const btoa = (str) => Buffer.from(str).toString("base64");

module.exports = { atob, btoa };
