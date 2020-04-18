const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.join(__dirname, 'src', 'index.js')
    },

    output: {
        path: path.join(__dirname, 'dist')
    },

    module: {
        rules: [{
                test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader?name=/[hash].[ext]'
            },
            {
                loader: 'babel-loader',
                test: /\.js?$/,
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                exclude: /node_modules/,
                use: [
                    'style-loader', // 5. Inject Styles into DOM (? currently not I guess)
                    MiniCssExtractPlugin.loader, // 4.
                    'css-loader', // 3. Turn CSS into CommonJs
                    'postcss-loader', // 2.
                    'sass-loader' // 1. Turn Sass into CSS
                ]
            }
        ]
    },

    plugins: [
        new AssetsPlugin({
            filename: 'webpack.json',
            path: path.join(process.cwd(), 'site/data'),
            prettyPrint: true
        }),
        new CopyWebpackPlugin([{
            from: './src/fonts/',
            to: 'fonts/',
            flatten: true
        }])
    ]
};
