<template>
	<div>
		<el-row>
			<div class="logo-title-section">
				<img class="logo-img" :class="[isCollapse ? '' : 'logo-img-left']" src="../assets/home/logo.png" />
				<div class="logo-name-section" :class="[isCollapse ? 'rightBlock' : 'leftNone']">
					<p class="logo-name-cn">医生工作站</p>
					<p class="logo-name-en">DOCTOR WORKSTATION</p>
				</div>
			</div>
			<div class="logo-line" :class="[isCollapse ? '' : 'leftWidth']"></div>
		</el-row>
		<!-- 左边侧边栏 -->
		<div class="left-menu-aside">
			<div class="doctor-info-box">
				<div class="doc-head-box" :class="[isCollapse ? '' :'doc-head-left-box']">
					<img class="doc-head-img" :src="getDocInfo.doctorAvatarUrl" />
				</div>
				<p class="doc-name" :class="[isCollapse ? 'rightBlock' : 'leftNone']">{{getDocInfo.doctorName}}</p>
				<div class="doc-detail-info" :class="[isCollapse ? 'rightBlock' : 'leftNone']">
					<span>{{getDocInfo.deptName}}</span>
					<span>{{getDocInfo.doctorTitle}}</span>
				</div>
			</div>
			<ul class="menu-list-section">
				<li v-for="(item,index) in parentMenu" :key="index" @click="clickMenuLi(index,item.name,item.url)">
					<div class="menu-li" :class="[currentIndex == index ? 'menu-li-active' : '',isCollapse ? '' : 'paddingLeft']">
						<img class="img-icon" :src="item.icon" :title="isCollapse ? '' : item.name" />
						<span class="menu-name" :class="[isCollapse ? 'rightBlock' : 'leftNone']">{{item.name}}</span>
						<img class="right-arrow-img" :class="[isCollapse ? 'rightBlock' : 'leftNone']" src="../assets/common/rightArrowMenu@2x.png" />
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: 'asideMenu',
		computed: {
			...mapState(["isCollapse","clickedSecondItem"])
		},
		props: {
			getMenuList: {
				type: Array,
				value: []
			},
			docInfo: {
				type: String,
				value: ''
			}
		},
		data() {
			return {
				currentIndex: 0,
				getDocInfo: {},
				menuStatus: false,
				breadcrumbList: [],
				parentMenu: [],
			}
		},
		methods: {
			...mapMutations(['getMenuItem','getClickedSecondItem']),
			//点击菜单
			clickMenuLi(idx, name, path) {
				this.currentIndex = idx
				this.getMenuItem(name)
				this.getClickedSecondItem('')
				this.$router.push(path)
			},


		},
		mounted() {
			let data = [{
					"id": "1",
					"name": "问诊工作台",
					"icon": require("../assets/common/inquiryDesk@2x.png"),
					"url": '/index'
				},
				{
					"id": "2",
					"name": "我的排班",
					"icon": require("../assets/common/viewScheduling@2x.png"),
					"url": '/viewScheduling'
				},
				{
					"id": "3",
					"name": "患者评价",
					"icon": require("../assets/common/patientEvaluation@2x.png"),
					"url": '/patientEvaluation'
				},
				{
					"id": "4",
					"name": "账号设置",
					"icon": require("../assets/common/accountSettingmenu@2x.png"),
					"url": '/accountSettingmenu'
				}
			]
			this.parentMenu = data;
			this.getDocInfo = JSON.parse(this.$cache.get('userInfo'))
		},
		created() {
			console.log(this.$route.path)
		}
	}
</script>
<!-- logo和名字 -->
<style lang="less">
	.rightBlock {
		display: block;
	}

	.leftNone {
		display: none;
	}

	.logo-title-section {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.logo-line {
		width: 289px;
		height: 1px;
		background: linear-gradient(270deg, #1B79FD 0%, rgba(255, 255, 255, 0.09) 100%);
	}

	.logo-line.leftWidth {
		width: 70px;
	}

	.logo-img {
		width: 33px;
		height: 33px;
		margin: 20px 5px 20px 23px;
	}

	.logo-img.logo-img-left {
		margin: 17px 20px 20px 17px;
	}

	.logo-name-section {
		text-align: left;
	}

	.logo-name-cn {
		font-size: 20px;
		font-weight: 500;
		color: #FFFFFF;
	}

	.logo-name-en {
		margin-top: 3px;
		font-size: 8px;
		font-weight: 500;
		color: #FFFFFF;
	}

	.img-icon {
		width: 15px;
		height: 15px;
		margin-right: 10px;
	}
</style>
<!-- 医生信息 -->
<style lang="less">
	.left-menu-aside {
		padding-top: 30px;
	}

	.doctor-info-box {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.doc-head-box {
		width: 108px;
		height: 108px;
		border-radius: 100%;
		overflow: hidden;
	}

	.doc-head-left-box {
		width: 46px;
		height: 46px;
	}

	.doc-head-box .doc-head-img {
		width: 100%;
		height: 100%;
	}

	.doc-name {
		margin-top: 13px;
		margin-bottom: 7px;
		font-size: 18px;
		font-weight: 500;
		color: #FFFFFF;
	}

	.doc-name.leftNone {
		display: none;
	}

	.doc-name.rightBlock {
		display: block;
	}

	.doc-detail-info {
		display: flex;
		align-items: center;
	}

	.doc-detail-info.leftNone {
		display: none;
	}

	.doc-detail-info.rightBlock {
		display: block;
	}

	.doc-detail-info span {
		font-size: 14px;
		font-weight: 500;
		color: #FFFFFF;
	}

	.doc-detail-info span:nth-child(2) {
		margin-left: 30px;
	}
</style>
<!-- 菜单列表 -->
<style lang="less">
	.menu-list-section {
		margin-top: 26px;
	}

	.menu-li {
		display: flex;
		align-items: center;
		padding: 0 45px 0 34px;
		height: 48px;
		font-size: 14px;
		font-weight: 400;
		color: #FFFFFF;
	}

	.paddingLeft {
		padding: 0 25px 0 23px;
	}

	.menu-li.menu-li-active {
		background: linear-gradient(270deg, #1B79FD 0%, rgba(255, 255, 255, 0.09) 100%);
	}

	.img-icon {
		width: 22px;
		height: 22px;
	}

	.menu-name {
		margin-left: 13px;
	}

	.right-arrow-img {
		width: 6px;
		height: 10px;
		margin-left: auto;
	}
</style>
