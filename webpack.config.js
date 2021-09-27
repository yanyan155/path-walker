const path = require('path');

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/containers/App.js'],
    login: ['babel-polyfill', './src/containers/Login.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/(node_modules)/, /server.js/],
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};