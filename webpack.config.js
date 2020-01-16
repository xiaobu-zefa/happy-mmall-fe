const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


function getHtmlWebpackPlugin(name, title) {
    return new HtmlWebpackPlugin({
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        inject: true,
        hash: true,
        title: title,
        chunks: ['vendor', 'common', name]
    });
}

module.exports = {
    entry: {
        'common': ['./src/page/common/index.js'],
        'index': ['./src/page/index/index.js'],
        'user-login': ['./src/page/user-login/index.js'],
        'result': ['./src/page/result/index.js'],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'js/[name].js',
        publicPath: '/dist/',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(gif|png|jpg|woff|woff2|svg|eot|ttf)$/,
                use: ['url-loader?limit=100&name=resource/[name].[ext]'],
            },
            {
                test: /\.string$/,
                use: ['html-loader'],
            }
        ]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    // filename: 'js/vendors.js',
                    priority: -10,
                    minChunks: 1,
                    chunks: 'all',
                },
                common: {
                    test: path.resolve(__dirname, '/src/page/common/index.js'),
                    name: 'common',
                    chunks: 'all',
                    filename: 'js/common.js',
                    minSize: 0,
                    priority: -20,
                },
            }
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        getHtmlWebpackPlugin('index', '首页'),
        getHtmlWebpackPlugin('user-login', '用户登录'),
        getHtmlWebpackPlugin('result', '操作结果'),
    ],
    resolve: {
        alias: {
            Util: path.resolve(__dirname + '/src/util'),
            Page: path.resolve(__dirname + '/src/page'),
            Service: path.resolve(__dirname + '/src/service'),
            Image: path.resolve(__dirname + '/src/image'),
            Node_modules: path.resolve(__dirname + '/node_modules'),
        },
    },
    devServer: {
        hot: true,
        open: true,
        port: 8088,
        contentBase: path.join(__dirname, "dist"),
        proxy: {
            // 这里的意思是，只要本地用 /api 开头的请求，都被代理到 http://happymmall.com/api
            // 但是又配置了 pathRewrite ,将 /api 重写为 '' 所以实际上会被代理到 http://happymmall.com/
            // 比如 localhost:8088/api/lookup?key=123 会变为 http://happymmall.com/lookup?key=123
            '/api': {
                changeOrigin: true,
                target: 'http://happymmall.com/',
                pathRewrite: { '^/api': '' },
            },
        }
    }
};