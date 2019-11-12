const path = require("path");
const nodeExternals = require("webpack-node-externals");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const translateEnvToMode = (env) => {
  if (env === "production") {
    return "production";
  }
  return "development";
};

module.exports = env => {
  return {
    target: "electron-renderer",
    mode: translateEnvToMode(env),
    node: {
      __dirname: false,
      __filename: false
    },
    externals: [nodeExternals()],
    resolve: {
        alias: {
          react: path.resolve('./node_modules/react'),
        },
      alias: {
        env: path.resolve(__dirname, `../config/env_${env}.json`)
      }
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin({ clearConsole: env === "development" })
      ],
    devtool: "source-map"
  };
};