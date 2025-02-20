// filepath: /Users/enditroqe/Documents/GitHub/swing-big/webpack.config.js
const path = require("path");

module.exports = {
  mode: "development", // Set the mode to 'development' or 'production'
  entry: "./login.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            sourceType: "module", // Ensure Babel handles ES6 modules
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      firebase: path.resolve(__dirname, "node_modules/@firebase"),
    },
  },
};
