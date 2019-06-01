const phantom = require("phantom");
require("babel-polyfill");

(async () => {
  // user and pass are 3rd & 4th command-line args respectively
  const user = process.argv[2];
  const pass = process.argv[3];
  if (!user.trim() || !pass.trim()) {
    throw Error("Username and/or password not provided.");
  }

  const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36";
  const steps = [
    // 1. Login to SLS
    () => {
      page.evaluate(({ user, pass }) => {
        document.getElementById("username").value = user;
        document.getElementById("password").value = pass;
        document.getElementById("loginform").submit();
      }, { user, pass });
    },

    // 2. Retrieve incomplete tasks
    async () => page.evaluate(({ divToClick, taskNameSelectors }) => {
      const { newTasksSelector, inProgressTasksSelector } = taskNameSelectors;

      if (document.getElementById("loginErrorMessageBox")) {
        // if page has #loginErrorMessageBox, wrong credentials provided
        return "Incorrect username or password.";
      }

      // click on assignments div to open assignments
      document.querySelector(divToClick).click();

      // retrieve new task and in progress task names
      const newTasks = [...document.querySelectorAll(newTasksSelector)]
          .map((elem) => elem.textContent);
      const inProgressTasks = [...document.querySelectorAll(inProgressTasksSelector)]
          .map((elem) => elem.textContent);

      return newTasks.concat(inProgressTasks);

    }, require("./selectors.json")), // pass in CSS selectors to use
  ];

  const instance = await phantom.create();
  const page = await instance.createPage();
  page.setting("userAgent", USER_AGENT);

  let stepNum = 0;

  const loadFinishCallback = async () => {
    if (stepNum >= steps.length) return;

    if (stepNum === 1) {
      // 2nd step returns assignments, so check if we're there yet

      const result = await steps[stepNum]();

      if (result === "Incorrect username or password.") {
        // console.error() is treated as stderr
        console.error(result);
      } else if (result instanceof Array) {
        const assignments = result;
        // console.log() is treated as stdout
        console.log(JSON.stringify(assignments));
      } else {
        console.error("An unknown error occurred.");
      }

      instance.exit();
    } else {
      steps[stepNum]();
    }

    stepNum++;
  };

  page.on("onLoadFinished", loadFinishCallback);

  await page.open("https://vle.learning.moe.edu.sg/login");
})()
    .catch((err) => {
      console.error(err);
    });
