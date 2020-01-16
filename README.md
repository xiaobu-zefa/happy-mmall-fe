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



