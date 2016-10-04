module.exports = {
  context: __dirname + '/src/app',
  entry: './index',
  output: {
    path: __dirname + '/app',
    filename: 'app.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ],
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  }
};
