const path = require("path")
const webpack = require("webpack")
const nodeExternals = require("webpack-node-externals")

module.exports = (env, argv) => {
  // console.log(argv.mode)
  const SERVER_PATH =
    argv.mode === "production"
      ? "./src/server-prod.js"
      : "./src/server-dev.js"

  return {
    entry: {
      server: SERVER_PATH,
    },
    output: {
      path: path.join(__dirname, "dist"),
      publicPath: "/",
      filename: "[name].js",
    },
    target: "node",
    node: {
      __dirname: false,
      __filename: false,
    },
    externals: [nodeExternals()], //required with Express
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
  }
}
