/* title ： 创建公共工具类函数集合
 * date ： 2020-09-25
 * author : alisa
 */

import {
	MessageBox,
	Message,
	Notification
} from 'element-ui';
import cache from '../common/storage';
import moment from 'moment';
let systemStop = false; //判断当前系统是否停止运行了，原因-接口报错/登录过期/网络断开
 let countTime;
const utils = {
	//登录过期验证
	loginOverdue(line, result, showLog = true) {
		if (showLog) {
			console.log('登录验证？？？？')
			console.log(
				`${line}\n result.code==>${result.code}\n result.msg==>${result.msg}\n result.status==>${result.status}\n`,
				result.data);
		}

		if (!result.status && !systemStop && !!result.msg) {

			if (result.msg.indexOf('Error') !== -1 || result.msg.indexOf('error') !== -1) {
				Notification({
					title: '数据请求异常，请立即联系开发人员！',
					message: result.msg,
					duration: 0,
					type: "error"
				})
			} else {
				console.log('走到这里了')
				// Message.warning(!result.msg ? "" : result.msg);
			}


			//多加一层判断，如果出现限制接口多次调用，不强制用户退出登录
			if (result.msg !== '请先登录') {
				return false;
			}
			systemStop = true;
			//登录过期
			MessageBox.alert(`${result.msg}`, {
				type: "warning",
				confirmButtonText: '确定',
				closeOnClickModal: true,
				closeOnPressEscape: true
			}).then(() => {
				this.logout();
			}).catch(() => {
				this.logout();
			});
			cache.set("loginStatus.isLogin", false);
			return false;
		}
		return true;
	},

	//登录检查 接口返回error时调用
	loginError(error) {
		console.error(error);
		MessageBox.alert('提示', {
			type: "warning",
			confirmButtonText: '关闭',
			closeOnClickModal: true,
			closeOnPressEscape: true
		}).then(() => {
			window.location.hash === '#/login' ? () => {} : this.logout(); //退出登录
		}).catch(() => {});
	},
	//获取当前页面的地址
	getCurrentPage(that) {
		return that.$router.history.current.path;
	},
	//是否返回上一页面
	isBackPrePage(url) {
		return url === '/' || url === '/login' ? false : true;
	},
	//退出登录
	logout() {
		cache.set("loginStatus.isLogin", false);
		window.location.reload(); //跳转至登录页
	},
	//判断参数值是否为数组
	isArray(o) {
		console.log(o)
		return Object.prototype.toString.call(o) == '[object Array]';
	},
	//时间过滤器
	dateFrm(date) {
		return (date !== '' && date !== undefined && date !== null) ? moment(date).format(["YYYY-MM-DD", "YYYY/MM/DD"]) : '';
	},
	/*获取下个月的第一天*/
	nextMonthFirstDay() {
		var time = new Date();
		var year = time.getFullYear();
		var month = time.getMonth() + 2;
		if (month > 12) {
			month = month - 12;
			year = year + 1;
		}
		var day = 1;
		return year + '-' + month + '-' + day;
	},
	/**
	 * 获取当前时间前15天的日期
	 * */
	preCurrentTime(time) {
		let startTime = time.getTime() - 15 * 24 * 60 * 60 * 1000;
		return this.transformTimeYMD(startTime)
	},
	/**
	 * 获取当前时间前7天的日期
	 * */
	preSevenCurrentTime(time) {
		let startTime = time.getTime() - 7 * 24 * 60 * 60 * 1000;
		return this.transformTimeYMD(startTime)
	},
	//判断时间周期是否大于1年
	judgeDatePeriodGTYear(startDate, endDate) {
		return this.countingTheDays(startDate, endDate) > 365;
	},
	/**
	 * 天数计算
	 * @param {*} startDate 开始日期
	 * @param {*} endDate 结束日期
	 */
	countingTheDays(startDate, endDate) {
		return (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24 + 1;
	},
	/**
	 *  //判断两时间熟早熟晚
	 * @param {*} firstDate
	 * @param {*} secondDate
	 * return res > 0 ---- firstDate > secondDate
	 * return res < 0 ---- firstDate < secondDate
	 * return res = 0 ---- firstDate = secondDate
	 */
	judgeDate(firstDate, secondDate) {
		firstDate = moment(firstDate).format(["YYYY-MM-DD", "YYYY/MM/DD"]);
		secondDate = moment(secondDate).format(["YYYY-MM-DD", "YYYY/MM/DD"]);
		return new Date(firstDate) - new Date(secondDate);
	},
	/**
	 *
	 * @param {时间} date
	 */
	transformDate(date) {
		return !date ? "" : moment(date).format("YYYY-MM-DD");
	},
	/**
	 *
	 * @param {时间} time
	 */
	transformTime(time) {
		return moment(time).format("YYYY-MM-DD HH:mm:ss");
	},
	timeConvert(timestamp,num){//num:0 YYYY-MM-DD  num:1  YYYY-MM-DD hh:mm:ss // timestamp:时间戳 
	  timestamp = timestamp+'';
	  timestamp = timestamp.length==10?timestamp*1000:timestamp;
	  var date = new Date(timestamp);
	    var y = date.getFullYear();  
	    var m = date.getMonth() + 1;  
	    m = m < 10 ? ('0' + m) : m;  
	    var d = date.getDate();  
	    d = d < 10 ? ('0' + d) : d;  
	    var h = date.getHours();
	    h = h < 10 ? ('0' + h) : h;
	    var minute = date.getMinutes();
	    var second = date.getSeconds();
	    minute = minute < 10 ? ('0' + minute) : minute;  
	    second = second < 10 ? ('0' + second) : second; 
	  if(num==0){
	      return y + '-' + m + '-' + d;  
	  }else{
	      return y + '-' + m + '-' + d +' '+ h +':'+ minute +':' + second;  
	  }
	}
	,
	/**
	 *
	 * @param {时间} time 年月日
	 */
	transformTimeYMD(time) {
		return moment(time).format("YYYY-MM-DD");
	},
	/**
	 * 毫秒转换友好的显示格式
	 * 输出格式：21小时前
	 * @param  {[string]} date [2020-10-01 12:12:12] [2020/10/01 12:12:12] [时间戳]
	 * @return {[type]}      [description]
	 */
	setTimeTransformStr(date) {
		const getDateForStr = this.transformTime(date);
		let tempDate = new Date(getDateForStr).getTime();

		//获取js 时间戳
		let time = new Date().getTime();
		//去掉 js 时间戳后三位，与php 时间戳保持一致
		time = parseInt((time - tempDate) / 1000);

		//存储转换值
		let s;
		if (time < 60 * 10) { //十分钟内
			return '刚刚';
		} else if ((time < 60 * 60) && (time >= 60 * 10)) {
			//超过十分钟少于1小时
			s = Math.floor(time / 60);
			return s + "分钟前";
		} else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
			//超过1小时少于24小时
			s = Math.floor(time / 60 / 60);
			return s + "小时前";
		} else if ((time < 60 * 60 * 24 * 31) && (time >= 60 * 60 * 24)) {
			//超过1天少于31天内
			s = Math.floor(time / 60 / 60 / 24);
			return s + "天前";
		} else if ((time < 60 * 60 * 24 * 61) && (time >= 60 * 60 * 31)) {
			return "1个月前";
		} else {
			//超过61天 即超过2个月
			return getDateForStr;
		}
	},

	/**
	 * 获取一个数组返回一个对象，此对象中的字段是由数组中的每一个对象的index组成
	 */

	arrFormatObject(tempArr = []) {
		const tempObject = {};
		if (tempArr.length) {
			tempArr.forEach(element => {
				tempObject[element.index] = "";
			});
		}
		return tempObject;
	},
	/**
	 * 下载文件 从后台返回的Blob流文件
	 */
	downloadFile(response, filename, ext) {
		// 如果服务器错误返回
		if (response.type === "application/json") {
			let reader = new FileReader();
			reader.readAsText(response, "utf-8");
			reader.onload = e => {
				if (JSON.parse(e.target.result).status === false) {
					// 这里只判断status = false的情况，为了排除underfinded
					const info = !JSON.parse(e.target.result).msg ? '下载出错' : JSON.parse(e.target.result).msg
					Message.warning(info);
					return false;
				}
			};
		} else {
			let link = document.createElement("a");
			let blobURL = window.URL.createObjectURL(new Blob([response], {
				type: 'application/msexcel'
			}));

			// this.downloadFileTemp(blobURL);

			// for (let index = 1; index < 3; index++) {
			//   this.createIFrame(blobURL, index * 100, 1000);
			// }
			// window.URL.revokeObjectURL(blobURL);
			// return false;

			link.style.display = "none";
			link.href = blobURL;
			link.setAttribute("download", filename + `.${ext}`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link); // 下载完毕删除a标签
			window.URL.revokeObjectURL(blobURL);
		}
	},
	downloadFileTemp(url) {
		const iframe = document.createElement("iframe");
		iframe.style.display = "none"; // 防止影响页面
		iframe.style.height = 0; // 防止影响页面
		iframe.src = url;
		document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
		// 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
		setTimeout(() => {
			iframe.remove();
		}, 5 * 60 * 1000);
	},
	// 使用iframe 下载文件(目前使用它进行登录操作)
	createIFrame(url, triggerDelay, removeDelay) {
		//动态添加iframe，设置src，然后删除
		// setTimeout(() => {
		const iframe = document.createElement("iframe");
		iframe.style.display = "none"; // 防止影响页面
		iframe.style.height = 0; // 防止影响页面
		iframe.src = url;
		document.body.appendChild(iframe);
		setTimeout(function() {
			iframe.remove();
		}, 2000);
		// }, triggerDelay);
	},
	/**
	 * 导出txt文件  start
	 * @param {要导出的字符串} str
	 */
	exportTxtFile(name, str) {
		this.onClickDownDaily(name, str)
	},
	onClickDownDaily(name, val) {
		var export_blob = new Blob([val]);
		var save_link = document.createElement("a");
		save_link.href = window.URL.createObjectURL(export_blob);
		save_link.download = name;
		this.fakeClick(save_link);
	},
	fakeClick(obj) {
		var ev = document.createEvent("MouseEvents");
		ev.initMouseEvent(
			"click",
			true,
			false,
			window,
			0,
			0,
			0,
			0,
			0,
			false,
			false,
			false,
			false,
			0,
			null
		);
		obj.dispatchEvent(ev);
	},
	/**
	 * 导出txt文件  end
	 */

	/**
	 * 导出Excel start
	 */
	//导出列表
	exportList(title, data, name) {
		if (!data.length) {
			Message.info("当前没有数据，暂无法导出。");
			return false;
		}
		exportExcel(title, data, name);
	},
	/**
	 * 导出Excel end
	 */

	/**
	 * 使用A标签链接方式下载文件 start
	 *  */
	downloadFileForALabel(URL, PARAMS = "") {

		const link = document.createElement('a')
		link.setAttribute('target', '_top'); //_blank  _top  _self
		link.setAttribute('download', '')
		link.setAttribute('href', `${URL}${this.queryParams(PARAMS)}`)
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link); // 下载完毕删除a标签
	},
	/**
	 * 使用A标签链接方式下载文件 end
	 *  */


	/**
	 * json对象和url参数互转 start
	 */

	queryParams(data, isPrefix = true) {
		let prefix = isPrefix ? '?' : ''
		let _result = []
		for (let key in data) {
			let value = data[key]
			// 去掉为空的参数
			if (['', undefined, null].includes(value)) {
				continue
			}
			if (value.constructor === Array) {
				value.forEach(_value => {
					_result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
				})
			} else {
				_result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
			}
		}
		return _result.length ? prefix + _result.join('&') : '';
	},
	/**
	 * end
	 */
	//使用iframe url登录
	loginForALabel(URL, PARAMS) {
		this.createIFrame(`${URL}${this.queryParams(PARAMS)}`)

	},
	/**
	 *
	 * @param {*} startDateArr [开始时间对象]
	 * @param {*} endDateArr [结束时间对象]
	 */
	checkDateOverlap(startDateArr, endDateArr) {
		/*
		 * 思路: 把开始日期、结束日期分别存进两个数组，如此循环判断，不能第n项与第n项进行对比
		 * 如果开始时间n小于等于结束日期n+1  且  结束日期n小于等于开始日期n+1，就代表时间段有交叉，直接跳出循环.
		 */

		const startTime = startDateArr.filter((item) => {
			return !!item
		});
		const endTime = endDateArr.filter((item) => {
			return !!item
		});
		if (!startTime.length) {
			return false;
		}

		/*
		 *@params "2018/5/25"
		 *@return "20180525"
		 */
		let getFormatDate = str => {
			let date = str.indexOf('/') === -1 ? str.split('-') : str.split('/');
			let month = date[1].padStart(2, '0');
			let day = date[2].padStart(2, '0');
			return parseInt(`${date[0]}${month}${day}`);
		};

		let startArr = [],
			endArr = [];
		startTime.map((item) => {
			startArr.push(getFormatDate(item));
		});
		endTime.map((item) => {
			endArr.push(getFormatDate(item));
		});


		for (let order = 0, len = endArr.length; order < len; order++) {
			for (let index = 0, len2 = startArr.length - 1; index < len2; index++) {
				if (order !== (index + 1) && startArr[order] <= endArr[index + 1] && startArr[index + 1] <= endArr[order]) {
					return {
						status: false,
						range: [order, index + 1]
					};
					break;
				}
			}
		}
		return {
			status: true
		};

	},

	//深克隆
	deepClone(target) {
		// console.log('我是深克隆=======');
		// 定义一个变量
		let result;
		// 如果当前需要深拷贝的是一个对象的话
		if (typeof target === 'object') {
			// 如果是一个数组的话
			if (Array.isArray(target)) {
				result = []; // 将result赋值为一个数组，并且执行遍历
				for (let i in target) {
					// 递归克隆数组中的每一项
					result.push(this.deepClone(target[i]))
				}
				// 判断如果当前的值是null的话；直接赋值为null
			} else if (target === null) {
				result = null;
				// 判断如果当前的值是一个RegExp对象的话，直接赋值
			} else if (target.constructor === RegExp) {
				result = target;
			} else {
				// 否则是普通对象，直接for in循环，递归赋值对象的所有值
				result = {};
				for (let i in target) {
					result[i] = this.deepClone(target[i]);
				}
			}
			// 如果不是对象的话，就是基本数据类型，那么直接赋值
		} else {
			result = target;
		}
		// 返回最终结果
		return result;
	}


}

export default utils;
