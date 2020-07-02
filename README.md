# Magic

A frontend build tool, based on [create-react-app](https://github.com/facebook/create-react-app). It's a **black box** that compiles sass (`scss`) and javascript (`js` / `jsx`) files.

## Installation

`npm install wieni/magic`.

In your Drupal 8 theme, add the folling to your `package.json`:

```
"scripts": {
  "build": "NODE_ENV=production magic build",
  "start": "NODE_ENV=development magic start",
}
```

## Config

Configuration is done in the `magic.config.js` file.

`entry`

These are all the **bundles** that should be compiled. An object with key-valye pairs: the *key* is the output name of the bundle, the *value* is the filename.

> **Note:** All bundles should be placed inside the `resources` folder. 

```
module.exports = {
  entry: {
    global: "index.js",
  },
};
```

> In this example, `resources/index.js` in a bundle. The output is placed inside `public/resources/{files}`.

## Development config

Development configuration is done in the `magic.dev.config.js` file.

```
module.exports = {
  proxyPort: 3000,
  proxyTarget: "https://x.wieni.dev",
  proxyHost: "x.wieni.dev",
};
```

## Usage

* `magic build`: Build the frontend.
* `magic start`: Run a development (proxy) server.
