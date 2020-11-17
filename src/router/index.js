import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

//检索每一个模块router.js中的路由
var r=require.context("../views",true,/\.router\.js/)
var arr=[];
let homeArr=[]
r.keys().forEach((key)=>{
	if(r(key).default.length > 1 && r(key).default[0].name == "index"){
		for(let i=0;i<r(key).default.length;i++){
			homeArr.push(r(key).default[i])
		}
	}else{
		arr=arr.concat(r(key).default);
	}
})

homeArr = homeArr.concat(arr)
const routesArr = [
	{
			path: '/',
			redirect: '/Login',
		}, // 重定向
		{
			path: '/Login',
			name: 'Login',
			component: require('@/views/Login.vue').default
		},
		{
			path: '/Home',
			component: require('@/views/Home.vue').default,
			children:[...homeArr]
		}
]
var router = new VueRouter({
  routes: [
	 ...routesArr,
  ]
})
// console.log(router)
export default router

