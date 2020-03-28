const path = require("path");
const config = require("../drupack/magic.config.js");

const entryPoints = (theme) =>
  Object.keys(config.entry).reduce((prevValue, currentValue) => {
    return {
      ...prevValue,
      [currentValue]: [
        require.resolve("react-hot-loader/patch"),
        require.resolve("webpack-dev-server/client"),
        require.resolve("webpack/hot/only-dev-server"),
        path.resolve(
          __dirname,
          `../${theme}/resources/` + config.entry[currentValue]
        ),
      ],
    };
  }, {});

module.exports = {
  entryPoints: entryPoints,
};
