const path = require("path");

const { appDirectory } = require("./paths");

module.exports = (theme, magicConfig) => ({
  quiet: true,
  https: true,
  host: "0.0.0.0",
  hot: true,
  inline: true,
  overlay: true,
  port: magicConfig.proxyPort,
  publicPath: `/themes/custom/${theme}/public/resources`,
  contentBase: path.resolve(appDirectory, "resources"),
  watchContentBase: false,
  headers: { "Access-Control-Allow-Origin": "*" },
  proxy: {
    "*": {
      secure: false,
      target: magicConfig.proxyTarget,
      changeOrigin: true,
      onProxyReq(proxyReq) {
        proxyReq.setHeader("host", magicConfig.proxyHost);
      },
    },
  },
});
