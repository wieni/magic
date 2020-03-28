const path = require("path");
const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");

module.exports = (theme, magicConfig) => ({
  quiet: true,
  hot: true,
  overlay: {
    errors: true,
  },
  port: magicConfig.proxyPort,
  contentBase: path.resolve(__dirname, `../${theme}/resources`),
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
