// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import TerserPlugin from "terser-webpack-plugin";

export default {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    library: "redBeeMedia",
    libraryTarget: "umd",
    filename: "redbee-player.min.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "../report/index.html", // relative to the webpack output dir "./dist"
      openAnalyzer: false,
    }),
    new webpack.DefinePlugin({
      "process.env.npm_package_version": JSON.stringify(
        process.env.npm_package_version
      ),
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          sourceMap: false,
          compress: {
            drop_console: false
          },
          format: {
            ecma: 5
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/i,
        exclude: [/node_modules\/(?!@ericssonbroadcastservices)/],
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(ts|js)?$/,
        // Hls.js WebWorker is broken by swc. Currently hls.js target chrome 39 which is compatible with our chrome 38 target
        exclude: /(node_modules\/hls.js)/,
        use: {
          loader: "swc-loader",
        },
      },
    ],
  },
};
