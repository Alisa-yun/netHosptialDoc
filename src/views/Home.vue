<template>
	<div class="home" :style="{height:heightHome}">
		<el-container>
			<el-aside class="elAside" :class="[isCollapse ? '' : 'elAsideLeft']">
				<aside-menu></aside-menu>
			</el-aside>
			<el-container style="display: flex;flex-direction: column;">
				<el-header class="elHeaderBox">
					<div ref="titleSection" class="elHeader">
						<headers></headers>
					</div>
				</el-header>
				<el-main class="elMainBox">
					<el-row>
						<el-col :span="24">
							<div>
								<div ref="menuItem" class="menu-item-box">
									<div class="item-section">
										<span class="title-text">
											{{menuItem}}
											<span v-if=" clickedSecondItem != '' ">/</span>
										</span>
										<span class="second-item">{{clickedSecondItem}}</span>
									</div>
									<div class="consult-section">
										<!-- v-if=" clickedSecondItem == '问诊详情' " -->
										 <!-- v-if=" clickedSecondItem == '问诊详情' && currentRouters == '/consultDetail'" -->
										 <template v-if=" clickedSecondItem == '问诊详情' && currentRouters == '/consultDetail'">
											<div class="consult-room-box">
												<div class="consult-room-li" @click="showDrawer(1)">候诊室( {{ roomNumsObjHome.waitingRoomNums}} )</div>
												<div class="consult-room-li-line"></div>
												<div class="consult-room-li" @click="showDrawer(2)">我的诊室( {{ roomNumsObjHome.myRoomNums}} )</div>
											</div> 
										 </template>
										
									</div>
								</div>
								<div ref="main" :style="{height:mainHeight}">
									<router-view></router-view>
								</div>
							</div>
						</el-col>
					</el-row>
					<!-- <el-row>
					<div ref="footSection" class="footer-section" >版权所属 ©系统管理平台</div>
				</el-row> -->
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	// @ is an alias to /src
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import AsideMenu from '@/components/AsideMenu.vue'
	import Headers from '@/components/Headers.vue'
	export default {
		name: 'home',
		computed: {
			...mapState(['menuItem', 'isCollapse', "clickedSecondItem","roomNumsObj","showDrawers"]),
		},
		components: {
			AsideMenu,
			Headers
		},
		data() {
			return {
				height: 0,
				asideHeight: 0,
				mainHeight: '',
				heightHome: '',
				roomNumsObjHome:{},
				currentRouters:''
			}
		},
		watch: {
			$route(to, from) {
				console.log(to, from)
				this.currentRouters = to.path
				let arr = ['undefined','null','']
				if(to.meta.requireAuth == true){
					if(arr.includes(this.$cache.get('userSig'))){
						this.$router.push('/')
					}
				}
			},
			roomNumsObj (newValue,oldValue){
				this.roomNumsObjHome = newValue
			},
		},
		methods: {
			...mapMutations(['showDrawerChange','getTimChatHeight']),
			//候诊室 我的诊室 弹框
			showDrawer(idx){
				// console.log(this.showDrawers)
				console.log(idx)
				this.showDrawerChange(idx)
				// console.log(this.showDrawers)
			}
		},
		mounted() {
			let windowH = document.documentElement.clientHeight;
			this.heightHome = document.documentElement.clientHeight
			let mainHt = windowH - 72 - 20 - 51.36 - 24
			this.mainHeight = (windowH - 72 - 20 - 51.36 - 24) + 'px'
			this.getTimChatHeight(mainHt)
			window.onresize = () => {
				let windowH = document.documentElement.clientHeight;
				this.heightHome = document.documentElement.clientHeight
				let mainHt = windowH - 72 - 20 - 51.36 - 24
				this.mainHeight = (windowH - 72 - 20 - 51.36 - 24) + 'px'
				this.getTimChatHeight(mainHt)
			}

		},
		created() {
			//全局监听，页面刷新的时候将store里state的值存到sessionStorage中，然后从sessionStorage中获取，再赋值给store。然后再把session里面存的删除即可，相当于中间件的作用。
			//在页面加载时读取sessionStorage里的状态信息
			if (sessionStorage.getItem("store")) {
				this.$store.replaceState(
					Object.assign({},
						this.$store.state,
						JSON.parse(sessionStorage.getItem("store"))
					)
				);
				sessionStorage.removeItem("store");
			}

			//在页面刷新时将vuex里的信息保存到sessionStorage里
			window.addEventListener("beforeunload", () => {
				sessionStorage.setItem("store", JSON.stringify(this.$store.state));
			});
			console.log('home------------')
			this.currentRouters = this.$route.path
			this.clickedSecondItem = this.clickedSecondItem
		},

	}
</script>
<style lang="less">
	.consult-section {
		margin-right: 26px;
	}
	.consult-room-box{
		display: flex;
		align-items: center;
		width: 309px;
		height: 46px;
		border-radius: 10px;
		border: 1px solid #2490FF;
	}
	.consult-room-li {
		cursor: pointer;
		width: 49%;
		font-size: 18px;
		font-weight: 500;
		color: #2490FF;
	}
	.consult-room-li-line{
		width: 1px;
		height: 46px;
		background: #2490FF;
	}
</style>
<style lang="less">
	.main-home{
		margin: 24px 0;
		padding: 28px 22px;
		background-color: #fff;
	}
	.elAside {
		width: 289px !important;
		box-shadow: 5px 0 10px -5px #f9fbfd;
		background-color: #1B79FDFF;
	}

	.elAsideLeft {
		width: 70px !important;
	}

	.title-line {
		display: inline-block;
		width: 3px;
		height: 15px;
		background: #1684f9;
		vertical-align: middle;
	}

	.title-text {
		border-left: 5px solid #1890FFFF;
		padding-left: 12px;
	}

	.second-item {
		margin-left: 5px;
		color: #333333;
	}

	.el-container {
		flex-direction: row;
	}

	.menu-item-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 20px;
		font-weight: 500;
		color: #333333;
		line-height: 72px;
		background: #fff;
		padding-left: 22px;
	}

	.footer-section {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px 0;
	}
</style>
<style lang="less">
	.elHeaderBox {
		background-color: #1B79FDFF;
		height: 72px !important;
	}

	.elMainBox {
		background-color: #F0F2F5;
		padding: 32px 24px 22px 24px;
	}
</style>
