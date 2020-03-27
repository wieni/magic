const path = require("path");
const config = require("../drupack/drupack.config.js");

const entryPoints = Object.keys(config.entry).reduce(
  (prevValue, currentValue) => {
    return {
      ...prevValue,
      [currentValue]: path.resolve(
        __dirname,
        "../drupack/resources/" + config.entry[currentValue]
      ),
    };
  },
  {}
);

module.exports = {
  entryPoints: entryPoints,
};