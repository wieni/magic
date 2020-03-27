const config = require("./webpack.config");
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
    port: 3000,
    contentBase: path.resolve(__dirname, "resources"),
    headers: { "Access-Control-Allow-Origin": "*" },
    proxy: {
      "*": {
        secure: false,
        target: "https://test.sander.wieni.dev",
        changeOrigin: true,
        onProxyReq(proxyReq) {
          proxyReq.setHeader("host", "test.sander.wieni.dev");
        },
      },
    },
  },
};
