# 从零打造电商平台-前端开发

点击打开[慕课网课程](https://coding.imooc.com/class/109.html)

打算从零开始跟一边这个课程，在此记录一下进度与收获。

## 项目执行方式

####  一、安装node环境

#### 二、下载源代码

#### 三、进入项目目录，执行 npm i

#### 四、执行 npm run dev

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

3. `user-pass-update` 模块

    修改密码模块。没有使用模板渲染，直接在 html 文件中写的代码。

4. `reset-password` 模块

    重置密码模块。分了三个步骤，1 输入用户名，2 输入问题答案，3 输入新密码。没有什么难度，主要是理顺逻辑。


##### 三、注意的问题

1. 事件委托与事件绑定

    在用户中心模块和修改用户信息模块中要对提交按钮绑定点击事件，但是由于提交按钮是动态渲染出来的，所以不能直接绑定。需要用到事件委托。

至此，用户这个大模块就基本开发完毕了，今天做的三个小模块组成了一个小型的SPA，后续还会补充一个订单模块在此SPA中。写顺畅了之后感觉代码写起来还是挺顺手的，就这样吧，等着把事件冒泡，事件委托，事件绑定再好好看一遍~

##### 四、补充

1. 事件冒泡

    当一个元素的事件被触发时，这个事件会一层层的向元素的父元素冒泡，如果父元素也对同样的事件绑定了方法，那么这个方法就会被执行。

    ```js
    <div id="parent">
        父元素
        <div id="son">
            子元素
        </div>
    </div>

    <script>
        document.querySelector("#parent").addEventListener('click', () => {
            console.log('父元素点击事件被触发');
        });
        document.querySelector("#son").addEventListener('click', () => {
            console.log('子元素点击事件被触发');
        });
    </script>
    ```
    可以阻止事件冒泡：
    ```js
    document.querySelector("#son").addEventListener('click', (e) => {
            // 这样就阻止了事件冒泡
            e.stopPropagation();
            console.log('子元素点击事件被触发');
    });
    ```

2. 事件捕获

    事件冒泡是从内而外的执行，与之相对的还有一个叫事件捕获的东西。当你点击一个元素的时候，事件会从你点击的最外层元素一层层的传播到你点击的元素，这就是事件捕获。
    addEventListener 这个方法其实有三个参数，第三个参数代表执行阶段，如果为 false，则在事件冒泡阶段执行，如果为 true，则在事件捕获阶段执行，默认为 false。

    ```js
    <div id="parent">
        父元素
        <div id="son">
            子元素
        </div>
    </div>

    <script>
        document.querySelector("#parent").addEventListener('click', () => {
            console.log('父元素点击事件被触发');
        },true);
        document.querySelector("#son").addEventListener('click', () => {
            console.log('子元素点击事件被触发');
        },true);
    </script>
    ```
    
    可以阻止事件捕获：

    ```js
    document.querySelector("#parent").addEventListener('click', (e) => {
        console.log('父元素点击事件被触发');
        // 这样就阻止了事件向下捕获
        e.stopImmediatePropagation();
    }, true);
    ```
    这样事件捕获到父元素就不会在向下捕获了。

3. 事件委托

    事件委托是事件冒泡的使用场景。
    考虑两种情况：
    - 一个 ul 元素 有大量的 li 元素，我们要为所有的 li 元素绑定事件，但是由于 li 元素太多，全部绑定需要耗费大量内存。
    - 一个 ul 列表是动态渲染出来的，我们要为其绑定事件需要在渲染完成之后再重新绑定，费时费力。

    这个时候我们就可以用到事件委托。
    我们为父元素绑定事件，然后由子元素事件冒泡到父元素，由父元素判断是哪个子元素冒泡过来的，再执行对应的逻辑。
    事件对象 event 有两个属性与其相关：
    
    ```js
        event.target // 触发事件的元素
        event.currentTarget // 执行事件逻辑的元素
    ```

    我们只需要用到 `event.target` 属性就可以了：
    
    ```js
    <div id="parent">
        父元素
        <div id="son">
            子元素
        </div>
    </div>

    <script>
        let parent_ele = document.querySelector("#parent");
        let son_ele = document.querySelector("#son");
        document.addEventListener('click', (e) => {
            if (e.target === parent_ele) {
                console.log('父元素事件');
            }
            if (e.target === son_ele) {
                console.log('子元素事件');
            }
        });
    </script>
    ```

## 2020/1/18 - 项目开发

##### 一、商品模块开发

1. `index` 模块

    主页模块。主体分两个部分：
    
    - 导航框
    - 楼层展示
    
    导航框又分为导航列表和轮播图。

##### 二、遇到的问题

本来应该是做商品模块开发的，结果再主页这个页面上墨迹了一天...

1. 图片的 src 路径问题

    使用 url-loader 打包图片的时候，路径变成了 `src = [Module Object]` ，shit，查了半天原来是新版的 url-loader 默认开启的是 es 模块支持，于是使用 commonjs 打包就会出错。在配置中修改：

    ```js
    module: {
        rules: [
            {
                test: /\.(gif|png|jpg|woff|woff2|svg|eot|ttf)$/,
                use: [
                    {
                        loader: 'url-loader?limit=100&name=resource/[name].[ext]',
                        options: {
                            // 关闭 es 模块支持
                            esModule: false,
                        }
                    }
                ],
            },
        ]
    },
    ```

    解决！！！

2. 轮播图插件问题

    项目使用的轮播图插件是 `unslider` ，我去官网发现官网都已经崩了，下载地址也无效了。去仓库，仓库居然都已经删了，去新版官网，发现官网域名正在出售...
    于是在网上随便找了个轮播图插件，结果是一个做的很一般的 demo 。demo 就 demo 吧，我自己改一下改成模块化组件吧，改了半天，勉强能用了，但是教程中的项目没有把轮播图组件化， 于是我又把文件全删了。从项目仓库中找到遗留的 `unslider` 来用。
    一切安好，结果运行的时候提示 `unslider is not a function`。怎么调试都不行，明明 `jquery` 都引了，调了半天，最后把已经压缩的源码格式化看了一下， 最后发现传入的是 `window.jQuery`，但是我的配置文件中没有暴露，于是修改配置文件：

    ```js
    new webpack.ProvidePlugin({
        '$': 'jquery',
        'jQuery': 'jquery',
        // 原先只配置了上面两项...
        'window.jQuery': 'jquery',
    }),
    ```
    
    好了，问题解决了，有点扎心....进度有点缓慢了。


## 2020/1/19 - 项目开发

##### 一、商品模块开发

终于把商品模块开发完了，总体来说不是很难，主要就是两个部分：
1. `list` 模块

    商品列表部分。展示商品。

2. `detail` 模块

    商品详情部分。展示某个商品的详细信息。

##### 二、一些总结

1. 商品列表模块

    商品列表模块看起来很简单，其实逻辑还是挺多的。商品列表由三个部分组成：
    - 排序
        这个没什么难点，主要是用 js 控制一下样式的改变。
        注意的是点击排序会将页码重置为 1 。 
    - 展示
        这个也没什么难点，用 css 控制一下样式就行，主要是模板渲染的事。
    - 分页
        这个被单独拆分出来了，放到 util 目录下当作一个模块。通过一个构造函数，而不是直接用的对象，这样避免重复。构造函数用的 ES5 的写法，没有用 ES6 的 class 写法，因为考虑了兼容性问题。
        将每一个按钮都作为一个对象放到数组中，然后模板渲染工具通过遍历数组将按钮渲染出来。
        要注意的是数字按钮显示范围的计算。
        点击按钮会调用分页里面的点击函数。 

2. 商品详情模块

    没什么需要注意的~

## 2020/1/20 - 项目开发

##### 购物车模块

做了购物车模块的开发。购物车模块只有一个页面，页面虽然少，而且许多内容都在后端做了，但是前端要做的内容也不少。事件绑定也是目前最多的一个页面。
##### 注意到的问题

1. 购物车页面接口太多

    购物车页面逻辑几乎都在后端做了，所以每个按钮点击几乎都会请求后端，这会不会对性能造成影响？

    因为按照流程来讲，客户既然已经到了购物车这一步，操作一般都会变少，所以这里对性能的影响其实不大。

2. 删除购物车商品接口问题

    删除一个商品和删除多个商品用的是同一个接口，接口接受的参数是一个数组，数组里面是所有要删除的商品ID，注意传入一个参数的时候也要用数组形式传。还要注意 `Array.join()` 函数的用法。 

3. 事件绑定的问题

    在一个 `<a>` 标签上绑定事件的时候，忘记把 href 去掉，结果每次点击按钮绑定的事件都不生效，但是开启代理软件 `Fiddler` 之后就生效了，
    而且这个 `<a>` 标签 还偏偏是加入购物车按钮，害我调了半天，粗心的结果！

4. 数据获取的问题

    在 js 中，可能需要获取接口的一些数据来做其他事情，不要傻乎乎的只会把数据存放到 js 中，完全可以将不重要的数据通过模板渲染的方式，以自定义属性的方式放到 DOM 元素上，这样在做逻辑处理的时候直接从 DOM 元素上取，s会省下不少事情。
    
## 2020/1/31 - 项目开发

整整10天没有写一点代码，过年了总想着玩，虽然以为疫情不能出门，但是居然没有一点学习的心那！（我好自豪）
学校推迟开学的事件还没有定下来，如果按照原先的正月16开学的话，那么就还有一周多了，毕业设计一点没动.....
今天终于狠下心来开始学习了，写了写代码，希望以后的路能顺顺利利把！（加油）

##### 订单模块

用到了数据适配，自己将后端传回的数据处理一下后，在用模板渲染的时候就方便多了!!!

1. 订单列表模块

   展示出自己所有的订单，点击某一条订单可以显示订单详情。

2. 订单详情模块

   展示一个订单的具体信息，包括订单内的所有商品。

3. 订单确认模块

   这个模块比较复杂，里面包含了一整套的地址的增删改查。
   增加、修改地址用的是同一个模态框模块。
   这里面的一些按钮用到了事件冒泡的内容。

##### 支付模块

对接支付宝作为第三方支付。

支付宝的两种接入方式：

1. return_url 方式

- 浏览器向后端服务器发送支付请求

- 后端服务器向支付宝发送支付认证

- 支付宝向后端服务器发送认证信息

- 后端服务器向浏览器发送认证信息

- 跳转到支付宝提供的支付页面

- 付款后跳转到 return_url

  这种方式是同步处理方式，return_url 必须由后端提供，而且支付完毕后如果用户把浏览器关掉支付结果是得不到通知的，所以需要做一些容错处理。

2. notify_url

- 浏览器向后端服务器发送支付请求

- 后端服务器向支付宝发送支付认证

- 支付宝向后端服务器发送二维码

- 后端服务器向浏览器发送二维码

- 浏览器显示二维码，用户扫码支付

- 轮询检查支付状态

- 如果支付成功跳转到 notify_url

##  2020/2/1 - 环境适配

#### 项目优化

1. 添加 favicon

2. 线上域名的分离

3. 添加 dns-prefetch

4. 线上项目回归测试

#### SEO优化

1. 基本SEO优化

   关键词排名 收录量 

   品牌词 高频关键词 长尾关键词

2. 常用机巧

   增加页面数量（这也是为什么不用单页框架的原因）

   减少页面层级（不超过三层，如果业务要求层级必须深，那么就需要做网站地图）

   关键词密度（做的关键词占的页面的比例 2%-8%）

   友情链接（被高质量网站做了友联）

   分析竞对（参照对手的关键词）

   SEO数据监控

#### 访问数据统计
[百度数据统计](https://tongji.baidu.com/web/welcome/login)