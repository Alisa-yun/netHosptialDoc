<template>
	<div>
		<ul class="consult-patient-list">
			<li class="consult-patient-li" v-for="(item,index) in patinetData[consultType]" :key="index">
				<div class="consult-patient-info-section">
					<div class="consult-patient-img-box">
						<img :src="item.avatarUrl" />
					</div>
					<div class="consult-patient-info-detail">
						<template v-if="consultType == 2">
							<ul class="consult-patient-detail-box">
								<li class="consult-patient-name">{{item.patientName}} ({{item.gender}} {{item.age}}岁)</li>
								<template v-if="idx == 0">
									<li class="consult-patient-other-info">创建时间：{{item.createTime}}</li>
									<li class="consult-patient-other-info">等待时长：{{item.waitTime}}分钟</li>
									<li class="consult-patient-other-info">￥{{item.orderMoney}}</li>
								</template>
								<template v-if="idx == 1">
									<li class="consult-patient-other-info">接诊时间：{{item.serviceStartTime}}</li>
									<li class="consult-patient-other-info">接诊持续时长：{{item.waitTime}}分钟</li>
								</template>
								<template v-if="idx == 2">
									<li class="consult-patient-other-info">接诊时间：{{item.serviceStartTime}}</li>
									<li class="consult-patient-other-info">接诊医生：{{item.doctorName}}</li>
								</template>
								<template v-if="idx == 3">
									<li class="consult-patient-other-info">退诊时间：{{item.serviceStartTime}}</li>
									<li class="consult-patient-other-info">接诊医生：{{item.doctorName}}</li>
								</template>
							</ul>
						</template>
						<template v-if="consultType == 1">
							<ul class="consult-patient-detail-box">
								<li class="consult-patient-name">{{item.patientName}} ({{item.gender}} {{item.age}}岁)</li>
								<template v-if="idx == 0">
									<li class="consult-patient-other-info">创建时间：{{item.createTime}}</li>
									<li class="consult-patient-other-info">预约时间：{{item.appointmentTime}}</li>
									<li class="consult-patient-other-info">就诊号：{{item.visitNum}}</li>
									<li class="consult-patient-other-info">￥{{item.orderMoney}}</li>
								</template>
								<template v-if="idx == 1">
									<li class="consult-patient-other-info">创建时间：{{item.createTime}}</li>
									<li class="consult-patient-other-info">预约时间：{{item.appointmentTime}}</li>
									<li class="consult-patient-other-info">就诊号：{{item.visitNum}}</li>
									<li class="consult-patient-other-info">￥{{item.orderMoney}}</li>
								</template>
								<template v-if="idx == 2">
									<li class="consult-patient-other-info">接诊时间：{{item.serviceStartTime}}</li>
									<li class="consult-patient-other-info">接诊持续时长：{{item.waitTime}}分钟</li>
									<li class="consult-patient-other-info">就诊号：{{item.visitNum}}</li>
								</template>
								<template v-if="idx == 3">
									<li class="consult-patient-other-info">接诊时间：{{item.serviceStartTime}}</li>
									<li class="consult-patient-other-info">接诊医生：{{item.doctorName}}</li>
								</template>
								<template v-if="idx == 4">
									<li class="consult-patient-other-info">退诊时间：{{item.serviceStartTime}}</li>
									<li class="consult-patient-other-info">接诊医生：{{item.doctorName}}</li>
								</template>
							</ul>
						</template>
					</div>
				</div>
				<div class="consult-patient-look-btn">
					<div v-if="consultType == 1 && idx == 1 " class="agree-consult-btn" @click="agreeConsult(item.avatarUrl,item.medicalOrderId,index)">接诊</div>
					<div v-if="consultType == 2 && idx == 0 " class="agree-consult-btn" @click="agreeConsult(item.avatarUrl,item.medicalOrderId,index)">接诊</div>
					<div class="look-detial-btn" @click="lookDetail(item.avatarUrl,item.medicalOrderId)">查看详情</div>
				</div>
				<div class="symbol-section" :class="[consultType == 1 ? 'net-symbol' : 'consult-symbol']">{{item.serviceType}}</div>
			</li>
		</ul>
		<!-- 分页 -->
		<el-pagination :page-size="pageObj[consultType][idx].pageSize" :page-count="pageObj[consultType][idx].pageNumber"
		 layout="prev, pager, next" :total="pageObj[consultType][idx].total"
		 @current-change="currentChange" @prev-click="prevClick" @next-click="nextClick"
		 >
		</el-pagination>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: "patientList",
		computed: {
			...mapState(['loginOut', 'consultType', 'roomType']),
		},
		data() {
			return {
				patinetData: {
					1: [],
					2: []
				},
				pageObj: {
					1: {
						0: {
							pageSize: 9,
							pageNumber: 1,
							total: 0
						},
						1: {
							pageSize: 9,
							pageNumber: 1,
							total: 0
						},
						2: {
							pageSize: 9,
							pageNumber: 1,
							total: 0
						},
						3: {
							pageSize: 9,
							pageNumber: 1,
							total: 0
						},
						4: {
							pageSize: 9,
							pageNumber: 1,
							total: 0
						}
					},
					2: {
						0: {
							pageSize: 9,
							pageNumber: 1,
							total: 0
						},
						1: {
							pageSize: 9,
							pageNumber: 1,
							total: 0
						},
						2: {
							pageSize: 9,
							pageNumber: 1,
							total: 0
						},
						3: {
							pageSize: 9,
							pageNumber: 1,
							total: 0
						}
					}
				},
				infoJson: {},
				params: {},
				idx: 0,
				waitingRoomNums: 0,
				myRoomNums: 0,
				pageInfoObj:''
			}
		},
		methods: {
			...mapMutations(['getClickedSecondItem', 'getRoomNumsObj','getIsReload','showDrawerChange','getIsRecieveConsult']),
			//分页
			currentChange(e){
				console.log(e)
				this.pageObj[this.consultType][this.idx].pageNumber = e
				this.getInterFaces(this.idx, this.pageInfoObj,false)
			},
			prevClick(e){
				console.log(e)
				this.pageObj[this.consultType][this.idx].pageNumber = e
				this.getInterFaces(this.idx, this.pageInfoObj,false)
			},
			nextClick(e){
				console.log(e)
				this.pageObj[this.consultType][this.idx].pageNumber = e
				this.getInterFaces(this.idx, this.pageInfoObj,false)
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
					if(index != 0){
						this.$message({
							type:'error',
							message:'请按顺序接诊'
						})
						return;
					}else{
						this.beginConsult(url,orderId,id)
					}
				}
			},
			//网络问诊 接诊
			inquiryBeginConsult(url,orderId,id){
				this.api.inquiryStartService(id).then(res=>{
					if(res.code == 0){
						this.getRoomsTotal()
						this.getIsReload(false)
						this.showDrawerChange(3)
						this.getIsRecieveConsult(true)
						this.$router.push({
							name: 'consultDetail',
							params: {
								// types: 1,
								src: url,
								orderId: orderId,
								currentRoom:this.idx
							}
						})
						localStorage.setItem('orderId',orderId)
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
						this.getRoomsTotal()
						this.getIsReload(false)
						this.showDrawerChange(3)
						this.getIsRecieveConsult(true)
						this.$router.push({
							name: 'consultDetail',
							params: {
								// types: 1,
								src: url,
								orderId: orderId,
								currentRoom:this.idx
							}
						})
						localStorage.setItem('orderId',orderId)
					}else{
						this.$message({
							type:'warning',
							message:res.message
						})
					}
				})
			},
			//查看详情
			lookDetail(url, orderId) {
				this.getClickedSecondItem('问诊详情')
				this.getRoomsTotal()
				this.getIsReload(false)
				this.showDrawerChange(3)
				this.getIsRecieveConsult(false)
				if(this.consultType == 2 && this.idx == 1){//咨询 我的诊室 查看详情
					this.getIsRecieveConsult(true)
				}
				if(this.consultType == 1 && this.idx == 2){//问诊 我的诊室 查看详情
					this.getIsRecieveConsult(true)
				}
				
				this.$router.push({
						name: 'consultDetail',
						params: {
							// types: 2,
							src:url,
							orderId:orderId,
							currentRoom:this.idx
						}
					})
					localStorage.setItem('orderId',orderId)
			},

			//获取列表
			getInterFaces(idx, info,state) {//state: true 代表是搜索 点击tab 每次都是第一页   false代表分页加载
				// console.log(idx)
				// console.log(info)
				this.patientArr = []
				this.idx = idx
				this.pageInfoObj = {
					"startDate":info.startDate,
					"endDate":info.endDate,
					"patientName":info.patientName,
					"patientPhone":info.patientPhone
				}
				let pageInfo = {}
				if(state == true){
					pageInfo = {
						"pageNumber": 1,
						"pageSize": this.pageObj[this.consultType][idx].pageSize,
					}
				}
				if(state == false){
					pageInfo = {
						"pageNumber": this.pageObj[this.consultType][idx].pageNumber,
						"pageSize": this.pageObj[this.consultType][idx].pageSize,
					}
				}
				this.params = Object.assign(this.pageInfoObj, pageInfo)
				console.log(this.params)
				this.getList()
				this.infoJson[idx]()
			},
			getList() {
				if (this.consultType == 1) { //问诊 1  咨询 2
					this.infoJson = {
						0: this.getInquiryWaitingList,
						1: this.getInquiryRoomingList,
						2: this.getInquiryWorkList,
						3: this.getInquiryCompleteList,
						4: this.getInquiryWithdrawalList
					}
				} else if (this.consultType == 2) {
					this.infoJson = {
						0: this.getConsultRoomingList,
						1: this.getConsultWorkList,
						2: this.getConsultCompleteList,
						3: this.getConsultWithdrawalList
					}
				}
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
			/*
			图文咨询
			*/
			// 候诊室
			getConsultRoomingList() {
				this.api.waitingRoomList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.idx].total = res.data.total
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
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.idx].total = res.data.total
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			// 已完成
			getConsultCompleteList() {
				this.api.completeList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.idx].total = res.data.total
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			// 已退诊
			getConsultWithdrawalList() {
				this.api.withdrawalList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.idx].total = res.data.total
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
			// 待就诊
			getInquiryWaitingList() {
				this.api.WaitingList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.idx].total = res.data.total
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			// 候诊室
			getInquiryRoomingList() {
				this.api.inquiryWaitingRoomList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.idx].total = res.data.total
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
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.idx].total = res.data.total
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			// 已完成
			getInquiryCompleteList() {
				this.api.inquiryCompleteList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.idx].total = res.data.total
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			// 已取消
			getInquiryWithdrawalList() {
				this.api.inquiryWithdrawalList(this.params).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.patinetData[this.consultType] = res.data.rows
						this.pageObj[this.consultType][this.idx].total = res.data.total
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},

		},
		mounted() {
			console.log(this.roomType)
		}
	}
</script>

<style lang="less" scoped="scoped">
	.consult-patient-list {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.consult-patient-li {
		cursor: pointer;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 29px 20px 17px 25px;
		margin-top: 32px;
		margin-left: 38px;
		width: 422px;
		// height: 150px;
		background: #FFFFFF;
		border-radius: 10px;
		border: 1px solid #D8D8D8;
	}

	.consult-patient-list .consult-patient-li:nth-child(3n-2) {
		margin-left: 0;
	}

	.consult-patient-li:hover {
		box-shadow: 0px 0px 9px 0px rgba(89, 171, 255, 0.5);
	}

	.consult-patient-li:hover .consult-patient-look-btn {
		color: #2490FF;
	}

	.consult-patient-info-section {
		display: flex;
		align-items: flex-start;
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
