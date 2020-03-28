const path = require("path");
const config = require("../drupack/magic.config.js");

const entryPoints = (theme) =>
  Object.keys(config.entry).reduce((prevValue, currentValue) => {
    return {
      ...prevValue,
      [currentValue]: path.resolve(
        __dirname,
        `../${theme}/resources/` + config.entry[currentValue]
      ),
    };
  }, {});

module.exports = {
  entryPoints: entryPoints,
};
