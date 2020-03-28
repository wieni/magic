const webpack = require("webpack");
const chalk = require("chalk");
const { argv } = require("yargs");

const path = require("path");
const fs = require("fs");

const build = (() => {
  const appDirectory = fs.realpathSync(process.cwd());
  const theme = path.basename(appDirectory);

  
})();
