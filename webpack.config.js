const path = require("path");
const { entryPoints } = require("./webpack.helpers");

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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [],
          },
        },
      },
      {
        test: /\.(png|jp(e*)g|svg|gif|woff(2)?|ttf|eot|otf)$/,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
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
      path.resolve(__dirname, "../drupack/resources"),
      path.resolve(__dirname, "../drupack/node_modules"),
      "node_modules",
    ],
    alias: {
      "@base/components": path.resolve(__dirname, "resources/components"),
    },
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
};
