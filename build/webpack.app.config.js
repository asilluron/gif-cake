const path = require("path");
const merge = require("webpack-merge");
const base = require("./webpack.base.config");
module.exports = env => {
  return merge(base(env), {
    entry: {
      app: "./src/main/index.js"
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "../app")
    },
    module: {
      rules: require('./webpack.rules'),
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
      },
  });
};
