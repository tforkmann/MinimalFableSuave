var path = require("path");
var webpack = require("webpack");

var cfg = {
  devtool: "source-map",
  entry: {
    app: "./web/content/app.js",
    testpage: "./web/content/pages/testpage.js"
  },
  output: {
    path: "./web/content",
    filename: "[name].bundle.js"
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "source-map-loader"
      }
    ]
  }
};

module.exports = cfg;