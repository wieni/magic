const config = require("./webpack.config");
const drupackConfig = require("../drupack/magic.dev.config");
const path = require("path");

module.exports = {
  ...config,
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    quiet: false,
    hot: true,
    overlay: {
      errors: true,
    },
    port: drupackConfig.proxyPort,
    contentBase: path.resolve(__dirname, "../drupack/resources"),
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
