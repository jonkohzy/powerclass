const path = require("path");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);

const runSlsScrape = async ( user, pass, res) => {
  try {
    const { stdout, stderr } = await execFile("node", [
      path.resolve(__dirname, "getSlsAssignments.js"), user, pass]);

    if (stderr) throw Error(stderr.trim());

    // ignores all but the first line (warnings, etc.)
    const assignments = stdout.split("\n")[0];
    // JSON.parse() because assignments is a stringified array
    res.send(JSON.parse(assignments));
  } catch (err) {
    if (err.message === "Incorrect username or password.") {
      res.status(401).send(err.message);
    } else {
      res.sendStatus(500);
    }
  }
};

module.exports = runSlsScrape;
