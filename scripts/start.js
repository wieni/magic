const fs = require("fs");
const path = require("path");
const boxen = require("boxen");
const chalk = require("chalk");

const webpack = require("webpack");
const formatMessages = require("webpack-format-messages");
const WebpackDevServer = require("webpack-dev-server");
const clearConsole = require("react-dev-utils/clearConsole");
const openBrowser = require("react-dev-utils/openBrowser");

const { welcomeMessage, resolveConfigFile, setMagicEnv } = require("./utils");

const isInteractive = process.stdout.isTTY;

const magicStart = () => {
  setMagicEnv("development");

  const appDirectory = fs.realpathSync(process.cwd());
  const theme = path.basename(appDirectory);

  welcomeMessage(theme);

  const magicConfigFilePath = path.resolve(appDirectory, "magic.config.js");
  const magicConfig = resolveConfigFile(magicConfigFilePath);

  const magicDevConfigFilePath = path.resolve(
    appDirectory,
    "magic.dev.config.js"
  );
  const magicDevConfig = resolveConfigFile(magicDevConfigFilePath);

  const webpackConfig = require("../webpack.config")(theme, magicConfig);
  const webpackDevConfig = require("../webpack.dev.config")(
    theme,
    magicDevConfig
  );

  const compiler = webpack(webpackConfig);
  WebpackDevServer.addDevServerEntrypoints(webpackConfig, webpackDevConfig);
  const devServer = new WebpackDevServer(compiler, webpackDevConfig);

  devServer.listen(magicDevConfig.proxyPort, "localhost", (err) => {
    if (err) {
      return console.log(err);
    }
    if (isInteractive) {
      clearConsole();
    }

    compiler.hooks.invalid.tap("invalid", function () {
      console.log("Compiling...");
    });

    compiler.hooks.done.tap("done", (stats) => {
      clearConsole();
      const messages = formatMessages(stats);

      if (!messages.errors.length && !messages.warnings.length) {
        console.log("Compiled successfully!");
      }

      if (messages.errors.length) {
        console.log("Failed to compile.");
        messages.errors.forEach((e) => console.log(e));
        return;
      }

      if (messages.warnings.length) {
        console.log("Compiled with warnings.");
        messages.warnings.forEach((w) => console.log(w));
      }
    });

    const localServerUrl = `http://localhost:${magicDevConfig.proxyPort}`;
    openBrowser(localServerUrl);
    console.log(
      boxen(
        `Loading Magic Development Server:\n${chalk.bold.blue(localServerUrl)}`,
        {
          padding: 1,
        }
      )
    );
  });
};

magicStart();
