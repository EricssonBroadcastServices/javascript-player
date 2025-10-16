// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import dotenv from 'dotenv';

dotenv.config({ path: new URL('../../.env', import.meta.url).pathname });

export default {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "index.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/i,
        exclude: [/node_modules\/(?!@ericssonbroadcastservices)/],
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(ts|tsx|js)?$/,
        // hls.js breaks if we try to run it through SWC, however it targets chrome 39 so we don't need to do anything with it.
        exclude: /(node_modules\/hls.js)/,
        use: {
          loader: "swc-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        npm_package_version: JSON.stringify(process.env.npm_package_version),
        BITMOVIN_KEY: JSON.stringify(process.env.BITMOVIN_KEY)
      }
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: "./src",
    },
    port: 1234,
    host: "0.0.0.0",
    allowedHosts: "all",
  },
  stats: {
    warningsFilter: [/Failed to parse source map/],
  },
};
