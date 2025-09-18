const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AssetsPlugin = require("assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isProductionMode = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    init: path.join(__dirname, "src", "init.js"),
    main: path.join(__dirname, "src", "index.js"),
  },

  output: {
    path: path.join(__dirname, "docs"),
  },

  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "[hash].[ext]",
        },
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isProductionMode ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                silenceDeprecations: ['color-functions', 'global-builtin', 'import'],
              }
            }
          }
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        "docs/**/*.js",
        "docs/**/*.css",
        "site/data/webpack.json",
      ],
    }),
    new AssetsPlugin({
      filename: "webpack.json",
      path: path.join(process.cwd(), "site/data"),
      removeFullPathAutoPrefix: true,
      prettyPrint: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/fonts/",
          to: "fonts/",
        },
      ],
    }),
  ],
};
