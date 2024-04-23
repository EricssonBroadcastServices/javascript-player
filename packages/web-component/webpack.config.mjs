// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    libraryTarget: "umd",
    filename: "rbm-player-component.min.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/i,
        exclude: [/node_modules\/(?!@ericssonbroadcastservices)/],
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(ts|js)?$/,
        exclude: [/node_modules/],
        use: {
          loader: "swc-loader",
        },
      },
    ],
  },
};
