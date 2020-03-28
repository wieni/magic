const chalk = require("chalk");
const Table = require("cli-table");
const log = console.log;
const error = console.error;

const green = chalk.green;
const red = chalk.red;
const bold = chalk.bold;

const welcomeMessage = (theme) => {
  log(
    `${green("Magic will handle building")} ${bold(theme)} ${green("assets.")}`
  );
};

const resolveConfigFile = (path) => {
  try {
    const config = require(path);
    return config;
  } catch {
    error(
      red(
        "Magic requires a config file in order to work. No magic config file found in:"
      )
    );
    error(red("--" + path));
  }
};

const setMagicEnv = (env = "production") => {
  process.env.NODE_ENV = env;
  process.env.BROWSERSLIST_ENV = env;
};

const magicLog = ({ stats }) => {
  const table = new Table({
    head: ["Filename", "Filesize"],
    colWidth: [300, 200],
  });

  stats
    .toJson()
    .assets.filter((asset) => /\.(js|css)$/.test(asset.name))
    .map((asset) => table.push([asset.name, `${asset.size / 1000.0}kb`]));

  console.log(chalk.blue.bold(table.toString()));
};

module.exports = {
  welcomeMessage: welcomeMessage,
  resolveConfigFile: resolveConfigFile,
  magicLog: magicLog,
  setMagicEnv: setMagicEnv,
};
