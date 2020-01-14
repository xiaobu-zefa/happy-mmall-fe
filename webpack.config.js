const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


function getHtmlWebpackPlugin(name) {
    return new HtmlWebpackPlugin({
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        inject: true,
        hash: true,
        chunks: ['common', name]
    });
}

module.exports = {
    entry: {
        index: ['./src/page/index/index.js'],
        login: ['./src/page/login/index.js'],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name].js',
        publicPath: '/dist/',
    },
    externals: {
        "jquery": "window.jQuery"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(gif|png|jpg|woff|svg|eot|ttfn)$/,
                use: ['url-loader?limit=100&name=resource/[name].[ext]'],
            },
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            cacheGroups: {
                commons: {
                    name: "common",  // 指定公共模块 bundle 的名称
                    chunks: "initial",
                    minChunks: 2
                }
            }
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        getHtmlWebpackPlugin('index'),
        getHtmlWebpackPlugin('login'),
    ],
};