const path = require("path");

module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "prettier", "prettier/react"],
  plugins: ["react", "prettier"],
  env: {
    browser: true,
  },
  rules: {
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "import/prefer-default-export": "off",
    "prettier/prettier": "error",
    "import/no-unresolved": "off",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ["node_modules", "resources"],
      },
    },
  },
  globals: {
    Drupal: "writable",
  },
};
