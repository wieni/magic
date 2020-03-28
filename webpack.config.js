const path = require("path");
const { entryPoints } = require("./webpack.helpers");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");

module.exports = (theme) => ({
  stats: "errors-only",
  entry: entryPoints(theme),
  output: {
    path: path.resolve(__dirname, `../${theme}/public/resources`),
    publicPath: `/themes/custom/${theme}/public/resources`,
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css",
    }),
    process.env.NODE_ENV !== "production"
      ? new StylelintPlugin({
          context: path.resolve(__dirname, `../${theme}/resources`),
          configFile: path.resolve(__dirname, ".stylelintrc"),
          formatter: require("stylelint-formatter-pretty"),
        })
      : false,
  ].filter(Boolean),
  module: {
    rules: [
      process.env.NODE_ENV !== "production" && false
        ? {
            enforce: "pre",
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: require.resolve("eslint-loader"),
            options: {
              configFile: path.resolve(__dirname, ".eslintrc"),
              formatter: require("eslint-formatter-pretty"),
            },
          }
        : false,
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              require.resolve("@babel/preset-env"),
              require.resolve("@babel/preset-react"),
            ],
            plugins: [],
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
              hmr: process.env.NODE_ENV !== "production",
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
    modules: [
      path.resolve(__dirname, `../${theme}/resources`),
      path.resolve(__dirname, `../${theme}/node_modules`),
      "node_modules",
    ],
    alias: {
      "@bunny/components": path.resolve(
        __dirname,
        "../bunny/resources/components"
      ),
    },
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
});
