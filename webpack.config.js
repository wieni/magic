const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  stats: "errors-only",
  entry: {
    global: path.resolve(__dirname, "../drupack/resources/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "../drupack/public/resources"),
    publicPath: "/themes/custom/drupack/public/resources",
    filename: "[name].js",
    chunkFilename: "[name].bundle.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].bundle.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s?css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV !== "production",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  optimization: {
    minimize: process.env.NODE_ENV === "production",
    minimizer: [
      new TerserPlugin({}),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require("cssnano"),
        cssProcessorPluginOptions: {
          preset: ["default"],
        },
      }),
    ],
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "resources"),
      path.resolve(__dirname, "../drupack/resources"),
    ],
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
};
