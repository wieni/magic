const config = require("./webpack.config");
const drupackConfig = require("../drupack/drupack.dev.config.js");
const path = require("path");

module.exports = {
  ...config,
  mode: "development",
  devServer: {
    quiet: false,
    hot: true,
    overlay: {
      errors: true,
    },
    port: drupackConfig.proxyPort,
    contentBase: path.resolve(__dirname, "resources"),
    headers: { "Access-Control-Allow-Origin": "*" },
    proxy: {
      "*": {
        secure: false,
        target: drupackConfig.proxyTarget,
        changeOrigin: true,
        onProxyReq(proxyReq) {
          proxyReq.setHeader("host", drupackConfig.proxyHost);
        },
      },
    },
  },
};
