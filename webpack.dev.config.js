/* eslint-disable quotes */
const { createConfig } = require("@edx/frontend-build");
const path = require("path");

module.exports = createConfig("webpack-dev", {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
      },
      {
        test: /\.svg$/,
        exclude: path.resolve(__dirname, "node_modules", "src"),
        use: ["babel-loader", "@svgr/webpack"],
      },
    ],
  },
  devServer: {
    host: "0.0.0.0",
    allowedHosts: ["login.local.overhang.io"],
  },
});