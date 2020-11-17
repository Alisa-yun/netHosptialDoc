const path = require('path')

function resolve(dir) {
	return path.join(__dirname, dir)
}
module.exports = {
	// 项目部署的基础路径
	// 我们默认假设你的应用将会部署在域名的根部，
	// 比如 https://www.my-app.com/
	// 如果你的应用时部署在一个子路径下，那么你需要在这里
	// 指定子路径。比如，如果你的应用部署在
	// https://www.foobar.com/my-app/
	// 那么将这个值改为 `/my-app/`
	//publicPath: 'vuePro/hlvy/',//github打包放开
	publicPath: './',
	// 将构建好的文件输出到哪里
	outputDir: 'dist',

	// 是否在保存的时候使用 `eslint-loader` 进行检查。
	// 有效的值：`ture` | `false` | `"error"`
	// 当设置为 `"error"` 时，检查出的错误会触发编译失败。
	lintOnSave: true,
	// 使用带有浏览器内编译器的完整构建版本
	// 查阅 https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时
	// compiler: false,
	runtimeCompiler: true, //关键点在这
	// 调整内部的 webpack 配置。
	// 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/webpack.md
	chainWebpack: config => {
		config.module
			.rule("css")
			.test(/\.css/)
			.oneOf("vue")
			.resourceQuery(/\?vue/)
			.use("px2rem")
			.loader("px2rem-loader")
			.before('postcss-loader') // this makes it work.
			.options({
				remUnit: 192 // 设计稿大小比例 / 10
			})
			.end()
		config.module
			.rule("less")
			.test(/\.less/)
			.oneOf("vue")
			.resourceQuery(/\?vue/)
			.use("px2rem")
			.loader("px2rem-loader")
			.before('postcss-loader') // this makes it work.
			.options({
				remUnit: 192 // 设计稿大小比例 / 10
			})
			.end()
		config.resolve.alias
			.set('@', resolve('src'))
			.set('tim', resolve('src/tim.js'))
			.end()
	},
	configureWebpack: () => {},
	css: {
		loaderOptions: {
			stylus: {
				'resolve url': true,
				// 自定义主题场景
				import: [path.resolve(__dirname, './src/assets/css/base.styl')]
			},
		}
	},
	// vue-loader 选项
	// 查阅 https://vue-loader.vuejs.org/zh-cn/options.html
	// vueLoader: {},

	// 是否为生产环境构建生成 source map？
	productionSourceMap: true,
	// 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
	// 在多核机器下会默认开启。
	parallel: require('os').cpus().length > 1,

	// 是否使用 `autoDLLPlugin` 分割供应的包？
	// 也可以是一个在 DLL 包中引入的依赖的显性的数组。
	// 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#dll-模式
	// dll: false,

	// PWA 插件的选项。
	// 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli-plugin-pwa/README.md
	pwa: {},
	//  pages: {
	// index: {
	// page 的入口
	//  entry: 'src/index/main.js',
	// 模板来源
	// template: 'public/index.html',
	// 在 dist/index.html 的输出
	//   filename: 'index.html',
	// 当使用 title 选项时，
	// template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
	// title: 'Index Page',
	// 在这个页面中包含的块，默认情况下会包含
	// 提取出来的通用 chunk 和 vendor chunk。
	//   chunks: ['chunk-vendors', 'chunk-common', 'index']
	//  },
	// 当使用只有入口的字符串格式时，
	// 模板会被推导为 `public/subpage.html`
	// 并且如果找不到的话，就回退到 `public/index.html`。
	// 输出文件名会被推导为 `subpage.html`。
	//subpage: 'src/subpage/main.js'
	//  },
	// 配置 webpack-dev-server 行为。
	devServer: {
		open: process.platform === 'darwin',
		host: '0.0.0.0',
		port: 8080,
		https: false,
		hotOnly: false,
		// 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#配置代理
		proxy: {
			'/api': {
				target: process.env.VUE_APP_BASE_URL,
				ws: true,
				changeOrigin: true, //是否跨域
				pathRewrite: {
					'^/api': '/' // 替换target中的请求地址，也就是说，在请求的时候，url用'/proxy'代替'http://ip.taobao.com'
				}
			}
		},
		before: app => {
			// `app` 是一个 express 实例
		},

	},
}
