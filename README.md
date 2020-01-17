# 从零打造电商平台-前端开发

点击打开[慕课网课程](https://coding.imooc.com/class/109.html)

打算从零开始跟一边这个课程，在此记录一下进度与收获。

## 2020/1/14 - 项目开始

##### 一、架构设计

1. 前后端分离
2. 分层架构（逻辑层，数据层，工具层）
3. 模块化

##### 二、工具选择

1. 框架：Jquery
2. 打包工具：webpack

##### 三、注意的问题

1. webpack 多入口的配置

   ```js
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
   ```

2. 全局模块的引用

   项目中用到了 jquery 这个库，如果一个模块要使用它，那么每次都需呀在开头引用一下，有些麻烦，所以使用 `ProvidePlugin` 插件，如果在模块中使用了 `$` 或者 `jQuery`，那么就会被自动引入。

   ```js
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            });
        ],
   ```

   当然也可以直接在文件中使用CDN提供的`jquery`，然后通过像这样的方式配置：

   ```js
        externals: {
            jquery: 'jQuery',
            $: 'jQuery',
        }
   ```

3. css 文件的分离

   webpack 支持打包 css 文件，只需要配置 `style-loader` 和 `css-loader`。

   默认css会被打包到 js 文件中，所以页面加载样式的时候需要先登 js 文件加载完成，影响用户体验，从这一方面考虑，需要做 css 文件的分离。

   使用插件 MiniCssExtractPlugin 来分离 css 文件。下面的配置是将 css 文件分离到输出目录的 css/ 目录下面，并使用源文件的文件名。

   ```js
        plugins: [
            new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            }),
        ],
   ```

4. html 文件的打包

   html文件也可以自动打包，这样就不需要手动在输出目录手动创建 html 文件了。

   使用插件 `HtmlWebpackPlugin` ，需要为每一个要打包的 html 文件 new 一个 `HtmlWebpackPlugin` 。

   ```js
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/view/index.html',  // 要打包的 html 文件的模板
                filename: 'view/index.html', // 打包到输出目录下的 view/index.html
                inject: true,
                hash: true, // 启用哈希
                title: '首页', // 打包后文件的标题
                chunks: ['common', 'index'], // 使用到的 chunk，这里会将 common 和 index 引入到文件中
            });
        ],
   ```

   由于每个 html 文件都需要这样的一个配置，全部这样写有些麻烦，所以封装一个方法简化操作：

   ```js
        function getHtmlWebpackPlugin(name, title) {
            return new HtmlWebpackPlugin({
                template: './src/view/' + name + '.html',
                filename: 'view/' + name + '.html',
                inject: true,
                hash: true,
                title: title,
                chunks: ['common', name]
            });
        }
   ```

   这样只需要在插件配置中这样写，就配置了三个 html 文件：

   ```js
        plugins: [
            getHtmlWebpackPlugin('index', '首页'),
            getHtmlWebpackPlugin('user-login', '用户登录'),
            getHtmlWebpackPlugin('result', '操作结果'),
        ],
   ```

5. 公共模块的提取

   一些项目中用到的第三方模块，如果直接在文件中引用，那么在打包这些文件的时候会在每个文件中都将第三方模块打包一编，造成重复打包问题，额外消耗资源，所以需要将这些模块分离出来。包括自己写的公共模块也是同理。

   webpack4 使用了 `splitChunks` 作为新的代码分离工具。

   ```js
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
   ```

   `vendors` 组用来分离第三方库，`common` 组用来分离自己的公共代码。需要注意，`vendors` 组的优先级被设置为 -10，这样如果一个模块同时也匹配到了 `common` 组，那么会按照优先级大的 `vendors` 组来分离。

## 2020/1/15 - 项目开发

##### 一、公共模块开发

1. 创建了工具模块 `mm.js`
2. 创建了全局样式
3. 创建了 `footer`,`header`,`nav`,`nav-side`,`nav-simple` 作为项目的公共模块

##### 二、其余模块开发

1. 主页模块
2. 结果页模块

##### 三、注意的问题

1. `nav-side` 模块

   侧边栏模块。使用 js 用动态的方式创建侧边栏，并使用 `hogan.js` 进行模板渲染，`hogan.js` 需要有一个模板，模板名称为 `index.string` ，并用 `require` 的方式导入，需要主义的是，.string 后缀的文件，`webpack` 默认不打包，所以在 `loader` 中指定使用 `html-loader` 进行打包。

   ```js
        module: {
            rules: [
                {
                    test: /\.string$/,
                    use: ['html-loader'],
                }
            ]
        },
   ```

2. `result` 模块

   结果展示页模块。`result.html` 有多个结果提示块，默认隐藏。该模块会从地址栏中获取键为 `type` 的参数值，根据参数值来将对应的结果提示块显示。

   ```js
        $(function () {
            let type = _mm.getUrlParam('type') || 'default';
            let $ele = $('.' + type + '-success');
            $ele.show();
        });
   ```

## 2020/1/16 - 项目开发

##### 一、用户模块开发

1. `login` 模块

    登录模块。主要就是表单验证与表单提交。值得注意的一点是，登录之后跳转到之前的页面是通过获取地址栏中的 `redirect` 参数值来实现的。
    通过此模块，也开始了服务层的开发，创建了第一个 service 模块 `user-service.js` ，是用户模块的服务封装。

2. `register` 模块

    注册模块，基本跟登录模块差不多，多了一些字段，注册成功之后跳转到结果显示页面。

##### 二、通用模块的补充
    
1. `nav` 模块

    导航栏模块。检查是否是登录状态，如果是，显示 欢迎你 xx，如果不是，显示 登录与注册。

##### 三、注意的问题

1. 跨域问题与cookie重写
    
    从今天开始的许多模块都需要调用后台接口了，本项目使用的是教程已经搭建好的[线上项目](http://www.happymmall.com/)的后台接口。且开发中使用的是 `webpack-dev-server` 插件启动服务。但是由于跨域问题，如果直接请求接口，会产生跨域问题导致失败，于是使用 `webpack-dev-server` 的代理功能。
   
    ```js
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
                    secue: false,
                    cookieDomainRewrite: {
                        ".happymmall.com": "",
                    }
                },
            },
        }
    ```

    这里的 `cookieDomainRewrite` 配置项非常重要，一些接口会在本地种 cookie ，比如登录接口就会在本地种一个 mmall-login-token 的 cookie，但是 cookie 的域被设置为了 .happymmall.com ，这会导致 cookie 无法被设置，从而无法保持登录状态。使用此配置将 cookie 的域重写就能解决问题。此外还有许多其他的配置项都可以从官方文档中找到。

## 2020/1/17 - 项目开发

##### 一、用户模块开发

1. `user-center` 模块

    用户中心模块。用来查看用户资料，使用了模板渲染的方式。

2. `user-center-update` 模块

    修改用户信息模块，基本跟用户中心模块差不多，用户名不能修改，其余项用输入框的形式存在。

2. `user-pass-update` 模块

    修改密码模块。没有使用模板渲染，直接在 html 文件中写的代码。

##### 三、注意的问题

1. 事件委托与事件绑定

    在用户中心模块和修改用户信息模块中要对提交按钮绑定点击事件，但是由于提交按钮是动态渲染出来的，所以不能直接绑定。需要用到事件委托。

至此，用户这个大模块就基本开发完毕了，今天做的三个小模块组成了一个小型的SPA，后续还会补充一个订单模块在此SPA中。写顺畅了之后感觉代码写起来还是挺顺手的，就这样吧，等着把事件冒泡，事件委托，事件绑定再好好看一遍~

