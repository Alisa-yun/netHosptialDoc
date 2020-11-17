/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import router from '../router/index.js';
//提示框-目前注释，如需要则引入
import {
	Message
} from 'element-ui';
import {
	Loading
} from 'element-ui';
// 环境的切换
var API_api = '/api/';
// var API_api = '';
export default {
	install(Vue) {
		Vue.prototype.showFullScreenLoading = function() { //全局函数1
			if (needLoadingRequestCount === 0) {
				startLoading();
			}
			needLoadingRequestCount++;
		};
		Vue.prototype.tryHideFullScreenLoading = function() { //全局函数2
			if (needLoadingRequestCount <= 0) return;
			needLoadingRequestCount--;
			if (needLoadingRequestCount === 0) {
				endLoading();
			}
		};
	},
	API_api
};
let loading;

function startLoading() {
	return loading = Loading.service({
		fullscreen: true,
		background: "rgba(0, 0, 0, 0.05)"
	});
}

function endLoading() {
	return loading.close();
}

let needLoadingRequestCount = 0;

function showFullScreenLoading() {
	if (needLoadingRequestCount === 0) {
		startLoading();
	}
	needLoadingRequestCount++;
};

function tryHideFullScreenLoading() {
	if (needLoadingRequestCount <= 0) return;
	needLoadingRequestCount--;
	if (needLoadingRequestCount === 0) {
		endLoading();
	}
};

// 请求超时时间
axios.defaults.timeout = 1500000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
	(config) => {
		showFullScreenLoading();
		// if (config.method === 'post' || config.method === 'put') {
		//     // post、put 提交时，将对象转换为string, 为处理Java后台解析问题
		//     // debugger;
		//     config.headers['Content-Type'] = 'application/json;charset=UTF-8';
		//     config.data = JSON.stringify(config.data)
		//     showFullScreenLoading();
		// }
		// 请求发送前进行处理
		return config
	},
	(error) => {
		// 请求错误处理
		return Promise.reject(error)
	}
)

// 响应拦截器
axios.interceptors.response.use(
	response => {
		if (response.status === 200) {
			return Promise.resolve(response);
		} else {
			return Promise.reject(response);
		}
	},
	// 服务器状态码不是200的情况 
	error => {
		if (error.response != undefined) {
			switch (error.response.status) {
				case 401:
					Message({
						message: '账号或密码不正确！',
						type: 'warning'
					})
					break;
				case 403:
					Message({
						message: '账号异常，请联系后台技术人员！',
						type: 'warning'
					})
					break;
				case 404:
					Message({
						message: '网络请求不存在',
						type: 'warning'
					})
					break;
				case 500:
					Message({
						message: '网络异常...',
						type: 'error'
					})
					break;
				default:
					Message({
						message: '请求超时，请稍后重试...',
						type: 'error'
					})
			}
			return Promise.reject(error.response);
		} else {
			tryHideFullScreenLoading();
			Message({
				message: '请求超时，请稍后重试...',
				type: 'error'
			})
		}
	}
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(API_api + url, {
				params: params
			})
			.then(res => {
				tryHideFullScreenLoading();
				resolve(res.data);
				if(res.data.code == -100){
						router.push('/')
				}
			})
			.catch(err => {
				tryHideFullScreenLoading();
				reject(err.data)
			})
	});
}
export function getForm(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(API_api + url, {
				params: params,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			.then(res => {
				tryHideFullScreenLoading();
				resolve(res.data);
				if(res.data.code == -100){
						router.push('/')
				}
			})
			.catch(err => {
				tryHideFullScreenLoading();
				reject(err.data)
			})
	});
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(API_api + url, params)
			.then(res => {
				tryHideFullScreenLoading();
				resolve(res.data);
				if(res.data.code == -100){
						router.push('/')
				}
			})
			.catch(err => {
				tryHideFullScreenLoading();
			})
	});
}
export function postForm(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(API_api + url, {
				params,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			})
			.then(res => {
				tryHideFullScreenLoading();
				resolve(res.data);
				if(res.data.code == -100){
						router.push('/')
				}
			})
			.catch(err => {
				tryHideFullScreenLoading();
			})
	});
}
// POST 方法封装  (文件上传)
export const uploadExcelFile = (url, params) => {
	return new Promise((resolve, reject) => {
	axios({
		method: 'post',
		url: API_api + url,
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
	.then(res => {
		resolve(res);
		tryHideFullScreenLoading();
		if(res.data.code == -100){
				router.push('/')
		}
	})
	.catch(err => {
		tryHideFullScreenLoading();
	})
	});
}

// POST 方法封装  (文件导出)
export const exportExcelFile = (url, params) => {
	return  new Promise((resolve, reject) => {
	 axios({
		method: 'post',
		url: API_api + url,
		data: params,
		responseType: "arraybuffer",
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
	.then(res => {
		tryHideFullScreenLoading();
		resolve(res);
		if(res.data.code == -100){
				router.push('/')
		}
	})
	.catch(err => {
		tryHideFullScreenLoading();
	
	});
	});
}
export const exportExcelFileW = (url, params) => {
	return  new Promise((resolve, reject) => {
	axios({
		method: 'get',
		responseType: "arraybuffer",
		url: `${API_api + url}?${params}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
	.then(res => {
		tryHideFullScreenLoading();
		resolve(res);
		router.push('/')
	})
	.catch(err => {
		tryHideFullScreenLoading();
	})
	})
}
