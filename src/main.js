import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { MessageBox } from 'element-ui'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import http from './http/http'
import api from './http/api'
import utils from './common/utils';
import cache from './common/storage';
import mock from './mock/mock.js'

import tim from './tim.js'
import TIM from 'tim-js-sdk'
import './assets/icon/iconfont.css'
import './assets/icon/tim.css'
window.tim = tim
window.TIM = TIM
window.store = store
Vue.prototype.tim = tim
Vue.prototype.TIM = TIM
Vue.prototype.$store = store
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$bus = new Vue() // event Bus 用于无关系组件间的通信。

import 'lib-flexible'
Vue.use(ElementUI);
Vue.prototype.$ajax = axios
Vue.prototype.api = api   
// Vue.prototype.http = http;
Vue.use(http);//将全局函数当做插件来进行注册
Vue.utils = Vue.prototype.$utils = utils;
Vue.cache = Vue.prototype.$cache = cache;
Vue.use(require('vue-moment'));
Vue.config.productionTip = false
// console.log(process.env.VUE_APP_BASE_URL)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
