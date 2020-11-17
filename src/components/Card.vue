<template>
	<div>
		<!-- 候诊室 我的诊室   列表栏 -->
		<div class="drawer-title-section">
			<i class="el-icon-arrow-right back-right-arrow" @click="closeDrawer"></i>
			<div v-if="showDrawers == 1" class="drawer-title">候诊室</div>
			<div v-if="showDrawers == 2" class="drawer-title">我的诊室</div>
		</div>
		<div class="drawer-list">
			<ul class="consult-patient-list" infinite-scroll-immediate="false" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
				<li class="consult-patient-li" v-for="(item,index) in patinetData[consultType]" :key="index">
					<div class="consult-patient-info-section">
						<div class="consult-patient-img-box">
							<img :src="item.avatarUrl" />
						</div>
						<div class="consult-patient-info-detail">
							<template v-if="consultType == 2">
								<ul class="consult-patient-detail-box">
									<li class="consult-patient-name">{{item.patientName}} ({{item.gender}} {{item.age}}岁)</li>
									<template v-if="roomIdx == 1">
										<li class="consult-patient-other-info">创建时间：{{item.createTime}}</li>
										<li class="consult-patient-other-info">等待时长：{{item.waitTime}}分钟</li>
										<li class="consult-patient-other-info">￥{{item.orderMoney}}</li>
									</template>
									<template v-if="roomIdx == 2">
										<li class="consult-patient-other-info">接诊时间：{{item.serviceStartTime}}</li>
										<li class="consult-patient-other-info">接诊持续时长：{{item.waitTime}}分钟</li>
									</template>
								</ul>
							</template>
							<template v-if="consultType == 1">
								<ul class="consult-patient-detail-box">
									<li class="consult-patient-name">{{item.patientName}} ({{item.gender}} {{item.age}}岁)</li>
									<template v-if="roomIdx == 1">
										<li class="consult-patient-other-info">创建时间：{{item.createTime}}</li>
										<li class="consult-patient-other-info">预约时间：{{item.waitTime}}</li>
										<li class="consult-patient-other-info">就诊号：{{item.visitNum}}</li>
										<li class="consult-patient-other-info">￥{{item.orderMoney}}</li>
									</template>
									<template v-if="roomIdx == 2">
										<li class="consult-patient-other-info">创建时间：{{item.createTime}}</li>
										<li class="consult-patient-other-info">预约时间：{{item.waitTime}}</li>
										<li class="consult-patient-other-info">就诊号：{{item.visitNum}}</li>
										<li class="consult-patient-other-info">￥{{item.orderMoney}}</li>
									</template>
								</ul>
							</template>
						</div>
					</div>
					<div class="consult-patient-look-btn">
						<div v-if="consultType == 1 && roomIdx == 1 " class="agree-consult-btn" @click="agreeConsult(item.avatarUrl,item.medicalOrderId,index)">接诊</div>
						<div v-if="consultType == 2 && roomIdx == 1 " class="agree-consult-btn" @click="agreeConsult(item.avatarUrl,item.medicalOrderId,index)">接诊</div>
						<div class="look-detial-btn" @click="lookDetail(item.avatarUrl,item.medicalOrderId)">查看详情</div>
					</div>
					<div class="symbol-section" :class="[consultType == 1 ? 'net-symbol' : 'consult-symbol']">{{item.serviceType}}</div>
				</li>
			</ul>
			<p v-if="loading">加载中...</p>
		    <p v-if="noMore">没有更多了</p>
		</div>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: 'card',
		inject:['reload'],
		computed: {
			...mapState(['consultType', 'roomType','showDrawers']),
			 noMore () {
				 console.log(this.pageObj[this.consultType][this.roomIdx].total)
			        return this.pageObj[this.consultType][this.roomIdx].total == 0
			      },
			      disabled () {
			        return this.loading || this.noMore
			      }
		},
		props: ['startDate','endDate'],
		data() {
			return {
				showDrawer: '候诊室',
				patinetData: {
					1: [],
					2: []
				},
				infoJson: {},
				params: {},
				roomIdx: 1,
				loading:false,
				pageObj: {
					1: {
						1: {
							pageSize: 3,
							pageNumber: 1,
							total: null,
							loading: false
						},
						2: {
							pageSize: 3,
							pageNumber: 1,
							total: null,
							loading: false
						},
					},
					2: {
						1: {
							pageSize: 3,
							pageNumber: 1,
							total: null,
							loading: false
						},
						2: {
							pageSize: 3,
							pageNumber: 1,
							total: null,
							loading: false
						}
					}
				},
			}
		},
		watch: {
		},
		methods: {
			...mapMutations(['getClickedSecondItem', 'getRoomNumsObj','showDrawerChange','getIsReload','getReloadDetail','getIsRecieveConsult']),
			closeDrawer() {
				this.$emit('closeDrawerEvt', 3)
			},
			//列表加载
			load () {
				// this.loading = true
				this.getInterFaces(this.roomIdx)
			      },
			//接诊
			agreeConsult(url, orderId,index) {
				this.getClickedSecondItem('问诊详情')
				let id = {
					"medicalOrderId":orderId
				}
				if(this.consultType == 1){
					if(index != 0){
						this.$message({
							type:'error',
							message:'请按顺序接诊'
						})
						return;
					}else{
						this.inquiryBeginConsult(url,orderId,id)
					}
				}
				if(this.consultType == 2){
					this.beginConsult(url,orderId,id)
				}
				
			},
			//网络问诊 接诊
			inquiryBeginConsult(url,orderId,id){
				this.api.inquiryStartService(id).then(res=>{
					if(res.code == 0){
						this.getIsRecieveConsult(true)
						this.refreshPage(url,orderId)
					}else{
						this.$message({
							type:'warning',
							message:res.message
						})
					}
				})
			},
			//咨询接诊
			beginConsult(url,orderId,id){
				this.api.startService(id).then(res=>{
					if(res.code == 0){
						this.getIsRecieveConsult(true)
						this.refreshPage(url,orderId)
					}else{
						this.$message({
							type:'warning',
							message:res.message
						})
					}
				})
			},
			//刷新
			refreshPage(url,orderId){
				this.reload()
				this.showDrawerChange(3)
				this.getRoomsTotal()
				this.getIsReload(true)
				console.log(this.roomIdx)
				let currentRoom;
				if(this.consultType == 1 && this.roomIdx == 1){
					currentRoom = 1
				}
				if(this.consultType == 1 && this.roomIdx == 2){
					currentRoom = 2
				}
				if(this.consultType == 2 && this.roomIdx == 1){
					currentRoom = 0
				}
				if(this.consultType == 2 && this.roomIdx == 2){
					currentRoom = 1
				}
				let params =  {
						// types: 1,
						src: url,
						orderId: orderId,
						currentRoom:currentRoom
					}
				this.getReloadDetail(params)
			},
			//查看详情
			lookDetail(url, orderId) {
				this.getClickedSecondItem('问诊详情')
				this.reload()
				this.showDrawerChange(3)
				this.getRoomsTotal()
				this.getIsReload(true)
				this.getIsRecieveConsult(false)
				this.getIsRecieveConsult(false)
				let currentRoom;
				if(this.consultType == 1 && this.roomIdx == 1){//问诊 候诊室
					currentRoom = 1
				}
				if(this.consultType == 1 && this.roomIdx == 2){//问诊 我的诊室
					currentRoom = 2
					this.getIsRecieveConsult(true)
				}
				if(this.consultType == 2 && this.roomIdx == 1){//咨询 候诊室
					currentRoom = 0
				}
				if(this.consultType == 2 && this.roomIdx == 2){//咨询 我的诊室
					currentRoom = 1
					this.getIsRecieveConsult(true)
				}
				let params =  {
						types: 2,
						src: url,
						orderId: orderId,
						currentRoom:currentRoom
					}
				this.getReloadDetail(params)
			},
			//获取 候诊室 就诊室 总数
			getRoomsTotal() {
				if (this.consultType == 1) {
					this.api.inquiryWaitingRoomList(this.params).then(res => {
						console.log(res)
						if (res.code == 0) {
							let inquiry = res.data.total
							this.getMyRoomInquiry(inquiry)
						} else {
							this.$message({
								type: "warning",
								message: res.message
							})
						}
					})
				} else if (this.consultType == 2) {
					this.api.waitingRoomList(this.params).then(res => {
						console.log(res)
						if (res.code == 0) {
							let waitingRoomNums = res.data.total
							this.getMyRoom(waitingRoomNums)
						} else {
							this.$message({
								type: "warning",
								message: res.message
							})
						}
					})
				}
			},
			// 网络问诊 total就诊室
			getMyRoomInquiry(waitingRoomNums) {
				this.api.inquiryWorkList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						let myRoomNums = res.data.total
						let numsData = {
							waitingRoomNums: waitingRoomNums,
							myRoomNums: myRoomNums
						}
						this.getRoomNumsObj(numsData)
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			//咨询 total就诊室
			getMyRoom(waitingRoomNums) {
				this.api.workList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						let myRoomNums = res.data.total
						let numsData = {
							waitingRoomNums: waitingRoomNums,
							myRoomNums: myRoomNums
						}
						this.getRoomNumsObj(numsData)
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			//获取列表
			getInterFaces(roomIdx) {
				console.log(roomIdx)
				this.roomIdx = roomIdx
				// this.pageObj[this.consultType][this.roomIdx].loading = true
				if(this.pageObj[this.consultType][this.roomIdx].pageNumber != 1){
					this.pageObj[this.consultType][this.roomIdx].pageNumber ++ 
				}
				
				let pageInfo = {
					"patientPhone":'',
					"patientName":'',
					"startDate":this.startDate,
					"endDate":this.endDate,
					"pageNumber": this.pageObj[this.consultType][roomIdx].pageNumber,
					"pageSize": this.pageObj[this.consultType][roomIdx].pageSize,
				}
				this.params = pageInfo
				console.log(this.params)
				this.getList()
				this.infoJson[roomIdx]()
			},
			getList() {
				if (this.consultType == 1) { //问诊 1  咨询 2
					this.infoJson = {
						1: this.getInquiryRoomingList,
						2: this.getInquiryWorkList
					}
				} else if (this.consultType == 2) {
					this.infoJson = {
						1: this.getConsultRoomingList,
						2: this.getConsultWorkList
					}
				}
			},
			/*
			图文咨询
			*/
			// 候诊室
			getConsultRoomingList() {
				this.api.waitingRoomList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.loading = false
						// this.pageObj[this.consultType][this.roomIdx].loading = false
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.roomIdx].total = res.data.total
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			// 就诊室
			getConsultWorkList() {
				this.api.workList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.loading = false
						// this.pageObj[this.consultType][this.roomIdx].loading = false
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.roomIdx].total = res.data.total
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			/*
			网络问诊
			*/
			// 候诊室
			getInquiryRoomingList() {
				this.api.inquiryWaitingRoomList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.loading = false
						// this.pageObj[this.consultType][this.roomIdx].loading = false
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.roomIdx].total = res.data.total
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			// 我的诊室
			getInquiryWorkList() {
				this.api.inquiryWorkList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.loading = false
						// this.pageObj[this.consultType][this.roomIdx].loading = false
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.roomIdx].total = res.data.total
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
		},
	}
</script>

<style lang="less" scoped="scoped">
	.drawer-title-section {
		padding: 0 30px;
		height: 92px;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #D8D8D8;
	}

	.back-right-arrow {
		cursor: pointer;
		font-size: 30px;
		color: #999999;
	}

	.drawer-title {
		width: 436px;
		text-align: center;
		font-size: 24px;
		font-weight: 400;
		color: #333333;
	}

	.drawer-list {
		height: 743px;
	}
	.drawer-list>ul{
		height: 743px;
		overflow-y: auto;
	}
</style>
<style lang="less" scoped="scoped">
	.consult-patient-list {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.consult-patient-li {
		cursor: pointer;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 29px 20px 17px 25px;
		margin-top: 26px;
		width: 422px;
		height: 150px;
		background: #FFFFFF;
		border-radius: 10px;
		border: 1px solid #D8D8D8;
	}


	.consult-patient-li:hover {
		box-shadow: 0px 0px 9px 0px rgba(89, 171, 255, 0.5);
	}

	.consult-patient-li:hover .consult-patient-look-btn {
		color: #2490FF;
	}

	.consult-patient-info-section {
		display: flex;
		align-items: center;
	}

	.consult-patient-img-box {
		width: 82px;
		height: 82px;
		overflow: hidden;
	}

	.consult-patient-img-box img {
		width: 100%;
		height: 100%;
	}

	.consult-patient-info-detail {
		margin-left: 18px;
	}

	.consult-patient-detail-box li {
		margin-top: 10px;
		text-align: left;
	}

	.consult-patient-detail-box li:first-child {
		margin-top: 0;
	}

	.consult-patient-name {
		font-size: 18px;
		font-weight: 400;
		color: #333333;
	}

	.consult-patient-other-info {
		font-size: 14px;
		font-weight: 400;
		color: #999999;
	}

	.symbol-section {
		position: absolute;
		top: 0;
		right: 0;
		width: 76px;
		height: 40px;
		border-radius: 0px 10px 0px 10px;
		text-align: center;
		line-height: 40px;
		font-size: 14px;
		font-weight: 400;
		color: #FFFFFF;
	}

	.consult-symbol {
		background: #2490FF;
	}

	.net-symbol {
		background: #FFAA03;
	}

	.consult-patient-look-btn {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 14px;
		font-weight: 400;
		color: #B2B2B2;
	}

	.look-detial-btn {
		margin-left: 54px;
	}
</style>