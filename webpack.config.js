const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist'),
    data: path.join(__dirname, 'src/data')
};

module.exports = {
    entry: {
        main:'./src/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: paths.dist
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: { minimize: true }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, "css-loader"
                ]
            },
            { test: /\.woff(\d+)?$/, loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff' },
            { test: /\.ttf$/, loader: 'file-loader?prefix=font/' },
            { test: /\.eot$/, loader: 'file-loader?prefix=font/' },
            { test: /\.svg$/, loader: 'file-loader?prefix=font/' },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff"},
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            { test: /\.(png|svg|jpg|gif)$/, loader:"file-loader"}
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        compress: true
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyWebpackPlugin([{
            from: paths.data,
            to: paths.dist + '/data'
            }
        ])
    ]
};
