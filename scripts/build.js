const webpack = require("webpack");
const fs = require("fs");
const path = require("path");

const {
  welcomeMessage,
  resolveConfigFile,
  setMagicEnv,
  magicLog,
} = require("./utils");

const magicBuild = () => {
  setMagicEnv();
  const appDirectory = fs.realpathSync(process.cwd());
  const theme = path.basename(appDirectory);

  welcomeMessage(theme);

  const magicConfigFilePath = path.resolve(appDirectory, "magic.config.js");
  resolveConfigFile(magicConfigFilePath);

  const webpackConfig = require("../webpack.config")(theme);
  const compiler = webpack(webpackConfig);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      const messages = stats.toJson({}, true);

      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }

        return reject(new Error(messages.errors.join("\n\n")));
      }

      if (
        process.env.CI &&
        (typeof process.env.CI !== "string" ||
          process.env.CI.toLowerCase() !== "false") &&
        messages.warnings.length
      ) {
        return reject(new Error(messages.warnings.join("\n\n")));
      }

      return resolve({ stats, warnings: messages.warnings });
    });
  });
};

magicBuild().then((res) => magicLog(res));
