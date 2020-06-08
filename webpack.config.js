/* eslint-disable global-require */
const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
/*
const StylelintPlugin = require("stylelint-webpack-plugin");
*/
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
  },
  plugins: [
    process.env.NODE_ENV !== "production"
      ? new webpack.HotModuleReplacementPlugin()
      : false,
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css",
    }),
    /*
    process.env.NODE_ENV !== "production"
      ? new StylelintPlugin({
          context: path.resolve(appDirectory, "resources"),
          configFile: path.resolve(__dirname, ".stylelintrc"),
          formatter: require("stylelint-formatter-pretty"),
        })
      : false,
    */
  ].filter(Boolean),
  module: {
    rules: [
      /*
      process.env.NODE_ENV !== "production"
        ? {
            enforce: "pre",
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [
              {
                options: {
                  cache: false,
                  formatter: require("eslint-formatter-pretty"),
                  eslintPath: require.resolve("eslint"),
                  resolvePluginsRelativeTo: __dirname,
                  baseConfig: {
                    extends: [require.resolve("eslint-config-drupack")],
                  },
                },
                loader: require.resolve("eslint-loader"),
              },
            ],
          }
        : false,
        */
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              require.resolve("@babel/preset-env"),
              [require.resolve("@babel/preset-react")],
            ],
            plugins: [
              process.env.NODE_ENV !== "production"
                ? require.resolve("react-hot-loader/babel")
                : false,
              "@babel/plugin-syntax-class-properties",
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
              plugins: [require("postcss-preset-env")()],
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
    splitChunks:
      process.env.NODE_ENV === "production"
        ? {
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
                chunks: "all",
              },
            },
          }
        : false,
  },
  resolve: {
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
