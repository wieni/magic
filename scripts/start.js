const fs = require("fs");
const path = require("path");
const boxen = require("boxen");
const chalk = require("chalk");

const webpack = require("webpack");
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

  const webpackConfig = require("../webpack.config")(theme);
  const webpackDevConfig = require("../webpack.dev.config")(
    theme,
    magicDevConfig
  );

  const compiler = webpack({
    ...webpackConfig,
    mode: "development",
  });
  const devServer = new WebpackDevServer(compiler, webpackDevConfig);

  devServer.listen(magicDevConfig.proxyPort, "localhost", (err) => {
    if (err) {
      return console.log(err);
    }
    if (isInteractive) {
      clearConsole();
    }

    const localServerUrl = `http://localhost:${magicDevConfig.proxyPort}`;
    openBrowser(localServerUrl);
    console.log(
      boxen(
        `🎩 Loading Magic Development Server:\n${chalk.red(localServerUrl)}`,
        {
          padding: 1,
        }
      )
    );
  });
};

magicStart();
