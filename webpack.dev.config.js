const path = require("path");
const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");

module.exports = (theme, magicConfig) => ({
  quiet: true,
  host: "localhost",
  hot: true,
  inline: true,
  overlay: false,
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
  before(app, server) {
    app.use(errorOverlayMiddleware());
  },
});
