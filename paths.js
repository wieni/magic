const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  appDirectory,
};
