const path = require("path");

module.exports = (theme, magicConfig) => ({
  quiet: false,
  host: "0.0.0.0",
  hot: true,
  inline: true,
  overlay: true,
  port: magicConfig.proxyPort,
  publicPath: `/themes/custom/${theme}/public/resources`,
  contentBase: path.resolve(__dirname, `../${theme}/resources`),
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
