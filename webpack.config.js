/* eslint-disable global-require */
const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { appDirectory } = require("./paths");

module.exports = (theme, magicConfig) => ({
  mode: process.env.NODE_ENV,
  stats: "errors-only",
  entry: Object.keys(magicConfig.entry).reduce((prevValue, currentValue) => {
    return {
      ...prevValue,
      [currentValue]: [
        path.resolve(
          appDirectory,
          "resources",
          magicConfig.entry[currentValue]
        ),
      ],
    };
  }, {}),
  output: {
    path: path.resolve(appDirectory, `public/resources`),
    publicPath: `/themes/custom/${theme}/public/resources/`,
    filename: "[name].js",
    chunkFilename: "[name].js",
    jsonpFunction: "MAGIC_BY_WIENI",
  },
  plugins: [
    process.env.NODE_ENV !== "production"
      ? new webpack.HotModuleReplacementPlugin()
      : false,
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css",
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              [
                require.resolve("@babel/preset-env"),
                {
                  useBuiltIns: "usage",
                  corejs: "3",
                },
              ],
              [require.resolve("@babel/preset-react")],
            ],
            plugins: [
              process.env.NODE_ENV !== "production"
                ? require.resolve("react-hot-loader/babel")
                : false,
              require.resolve("@babel/plugin-proposal-class-properties"),
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.(png|jp(e*)g|svg|gif|woff(2)?|ttf|eot|otf)$/,
        loader: require.resolve("file-loader"),
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
              hmr: process.env.NODE_ENV === "development",
            },
          },
          require.resolve("css-loader"),
          {
            loader: require.resolve("postcss-loader"),
            options: {
              postcssOptions: {
                plugins: [require("postcss-preset-env")()],
              },
            },
          },
          require.resolve("sass-loader"),
        ],
      },
    ].filter(Boolean),
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
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  resolve: {
    alias: magicConfig.alias
      ? Object.keys(magicConfig.alias).reduce((prevValue, currentValue) => {
          return {
            ...prevValue,
            [currentValue]: path.resolve(
              appDirectory,
              "resources",
              magicConfig.alias[currentValue]
            ),
          };
        }, {})
      : {},
    modules: [
      path.resolve(appDirectory, "resources"),
      path.resolve(appDirectory, "node_modules"),
      "node_modules",
    ],
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  devtool:
    process.env.NODE_ENV === "production" ? "" : "cheap-module-source-map",
});
