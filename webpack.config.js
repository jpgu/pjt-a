const path = require('path');
const MyWebpackPlugin = require('./my-webpack-plugin.js');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/app.js',
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV === 'prod'
                    ? MiniCssExtractPlugin.loader 
                    : 'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    publicPath: './dist/',
                    name: '[name].[ext]?[hash]',
                    limit: 20000,  // 20 kB
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: `
                Build Date: ${new Date().toLocaleString()}               
                `
        }),
        new webpack.DefinePlugin({
            TWO: '1+1',
            FOUR: JSON.stringify('2+2'),  // 문자열 그대로 출력
            'api.domain': JSON.stringify('http://dev.api.domain.com'),
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            templateParameters: {
                env: process.env.NODE_ENV === 'dev'? '(개발용)':'개발용 아님'
            },
            minify: process.env.NODE_ENV === 'prod' ? {
                collapseWhitespace: true,
                removeComments: true,
            } : false
        }),
        new CleanWebpackPlugin(),

        ...(process.env.NODE_ENV === 'prod' 
            ? [new MiniCssExtractPlugin({filename: '[name].css'})]
            : []
        )
    ]
}