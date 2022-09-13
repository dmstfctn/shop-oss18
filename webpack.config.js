const path = require('path');
const webpack = require('webpack');




module.exports = {
  mode: 'production',
  entry: './assets/javascript/src/main.js',

  output: {
    path: path.resolve(__dirname, 'assets/javascript/dist/')
  },

  plugins: [new webpack.ProgressPlugin()],

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: [path.resolve(__dirname, 'assets/javascript/src')],
      loader: 'babel-loader'
    }, {
      test: /.(sa|sc|c)ss$/,

      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader",

        options: {
          sourceMap: true
        }
      }, {
        loader: "sass-loader",

        options: {
          sourceMap: true
        }
      }]
    }]
  }
}