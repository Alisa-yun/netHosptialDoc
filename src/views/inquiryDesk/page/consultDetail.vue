<template>
	<div class="container">
		<el-row type="flex">
			<el-col :span="24">
				<div class="patient-detail-info-section">
					<img :src="patientImgs" class="patinet-img" />
					<div class="patient-detail-info-box">
						<div class="patient-name-sex-box">
							<span>{{docObj.patientName}}</span>
							<span>({{docObj.gender}} {{docObj.age}}岁)</span>
						</div>
						<div class="patient-phone-id-section">
							<div class="patient-phone-id-li">
								<i class="el-icon-mobile-phone"></i>
								<span>{{docObj.patientPhone}}</span>
							</div>
							<div class="patient-phone-id-li">
								<i class="el-icon-mobile-phone"></i>
								<span>{{docObj.idCard}}</span>
							</div>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<!-- tabttitle -->
		<div class="tab-title-section">
			<template v-if="consultType == 1">
				<ul class="tab-title-list">
					<li class="tab-title-li" :class="[tabTitleIndex == 0 ? 'tab-title-li-active' : '']" @click="hanlderClick(0)">
						<div>健康记录</div>
					</li>
					<li class="tab-title-li" :class="[tabTitleIndex == 1 ? 'tab-title-li-active' : '']" @click="hanlderClick(1)">
						<div>问诊</div>
					</li>
					<template v-if="currentRoom == 2 || currentRoom == 3">
						<li class="tab-title-li" :class="[tabTitleIndex == 2 ? 'tab-title-li-active' : '']" @click="hanlderClick(2)">
							<div>病例</div>
						</li>
					</template>
					<template v-if="currentRoom == 2 || currentRoom == 3">
						<li class="tab-title-li" :class="[tabTitleIndex == 3 ? 'tab-title-li-active' : '']" @click="hanlderClick(3)">
							<div>处方</div>
						</li>
					</template>
				</ul>
			</template>
			<template v-if="consultType == 2">
				<ul class="tab-title-list">
					<li class="tab-title-li" :class="[tabTitleIndex == 0 ? 'tab-title-li-active' : '']" @click="hanlderClick(0)">
						<div>健康记录</div>
					</li>
					<li class="tab-title-li" :class="[tabTitleIndex == 1 ? 'tab-title-li-active' : '']" @click="hanlderClick(1)">
						<div>问诊</div>
					</li>
					<template v-if="currentRoom == 1 || currentRoom == 2">
						<li class="tab-title-li" :class="[tabTitleIndex == 2 ? 'tab-title-li-active' : '']" @click="hanlderClick(2)">
							<div>咨询小结</div>
						</li>
					</template>
				</ul>
			</template>
			<!-- 按钮部分 -->
			<div class="tab-btn-groups-section">
				<template v-if="(currentRoom == 0 || currentRoom == 1 || currentRoom == 2) && isRecieveConsult == true">
					<div v-if="tabTitleIndex == 1">
						<div class="end-consult-section" @click="endCosultBtn">
							<img class="end-consult-img" :src="consultEndBtnImg" />
							<div class="end-consult-btn">结束问诊</div>
						</div>
					</div>
				</template>
				<template v-if=" (currentRoom == 1 || currentRoom == 2) && tabTitleIndex == 2">
					<div class="end-consult-section" v-show="summarySubmitState" @click="consultSummary">
						<img class="end-consult-img" :src="summaryEditImg" />
						<div class="end-consult-btn">编辑</div>
					</div>
					<div class="end-consult-section" v-show="!summarySubmitState" @click="summarySubmit">
						<img class="end-consult-img" :src="summarySubmitImg" />
						<div class="end-consult-btn">提交</div>
					</div>
				</template>
			</div>
		</div>
		<!-- tabcontent -->
		<div class="tab-content-section">
			<template v-if="consultType == 1">
				<ul class="tab-content-list">
					<li class="tab-content-li" v-show="tabTitleIndex == 0">
						健康记录
					</li>
					<li class="tab-content-li" v-show="tabTitleIndex == 1">
						<div class="consult-state-section" :class="[docObj.orderState == 9 || docObj.orderState == 10 || docObj.orderState == 11  ? 'has-refuse-state-section' : '']">
							<div v-if="docObj.orderState == 9 || docObj.orderState == 10 || docObj.orderState == 11" class="refuse-consult-reason">
								退诊原因：{{docObj.withdrawalReason}}
							</div>
							<div class="consult-state-box" :class="[docObj.orderState == 9 || docObj.orderState == 10 || docObj.orderState == 11 ? 'has-refuse-state-box' : '']">
								<template v-if="docObj.orderState == 1">
									<img class="consult-state-img" :src="waitingRecieveImg" />
									<div class="consult-state-tips-section">
										<!-- 候诊中也就是待接诊 -->
										<div class="consult-state-tips-li">候诊中</div>
										<div class="consult-state-tips-li">预约时间：{{docObj.appointmentTime}}</div>
										<div class="consult-state-tips-li">就诊号：{{docObj.visitNum}}</div>
										<div class="consult-state-tips-li">已等待：<span class="consult-state-tips-li-time">{{consultWaiting}}</span></div>
									</div>
								</template>
								<template v-if="docObj.orderState == 2">
									<img class="consult-state-img" :src="waitingRecieveImg" />
									<div class="consult-state-tips-section">
										<div class="consult-state-tips-li">待就诊</div>
										<div class="consult-state-tips-li">预约时间：{{docObj.appointmentTime}}</div>
										<div class="consult-state-tips-li">就诊号：{{docObj.visitNum}}</div>
									</div>
								</template>
								<template v-if="docObj.orderState == 3">
									<img class="consult-state-img" :src="consultingImg" />
									<div class="consult-state-tips-section">
										<div class="consult-state-tips-li">咨询中</div>
										<div class="consult-state-tips-li">就诊号：{{docObj.visitNum}}</div>
										<div class="consult-state-tips-li">剩余时间：<span class="consult-state-tips-li-time">{{consulting}}</span></div>
									</div>
								</template>
								<!-- 已完成 -->
								<template v-if="docObj.orderState == 4">
									<img class="consult-state-img" :src="consultEndImg" />
									<div class="consult-state-tips-section">
										<div class="consult-state-tips-li">问诊已结束</div>
										<div class="consult-state-tips-li">持续时长：<span class="consult-state-tips-li-time">{{consultEnd}}</span></div>
									</div>
								</template>
								<!-- 退诊，没有原因 -->
								<template v-if="docObj.orderState == 8">
									<img class="consult-state-img" :src="consultEndImg" />
									<div class="consult-state-tips-section">
										<div class="consult-state-tips-li">问诊已结束</div>
										<div class="consult-state-tips-li">持续时长：<span class="consult-state-tips-li-time">{{consultEnd}}</span></div>
									</div>
								</template>
								<!-- 退诊，有原因 -->
								<template v-if="docObj.orderState == 9 || docObj.orderState == 10 || docObj.orderState == 11">
									<img class="consult-state-img" :src="consultEndImg" />
									<div class="consult-state-tips-section">
										<div class="consult-state-tips-li">问诊已结束</div>
										<div class="consult-state-tips-li">持续时长：<span class="consult-state-tips-li-time">{{consultEnd}}</span></div>
									</div>
								</template>
							</div>
						</div>
						<tim ref="tim" :patientImg="patientImgs" :wxUserId="docObj.userId" :timeRemaining="consulting"></tim>
						<template v-if="currentRoom == 1 && isRecieveConsult == false">
							<is-recieve :orderId="docObj.medicalOrderId" :avataUrl="docObj.avatarUrl" :startDate="startDate" :endDate="endDate"></is-recieve>
						</template>
					</li>
					<template v-if="currentRoom == 2 || currentRoom == 3">
						<li class="tab-content-li" v-show="tabTitleIndex == 2">
							病例
						</li>
					</template>
					<template v-if="currentRoom == 2 || currentRoom == 3">
						<li class="tab-content-li" v-show="tabTitleIndex == 3">
							处方
						</li>
					</template>
				</ul>
			</template>
			<template v-if="consultType == 2">
				<ul class="tab-content-list">
					<li class="tab-content-li" v-show="tabTitleIndex == 0">
						健康记录
					</li>
					<li class="tab-content-li" v-show="tabTitleIndex == 1">
						<div class="consult-state-section" :class="[docObj.orderState == 9 || docObj.orderState == 10 || docObj.orderState == 11  ? 'has-refuse-state-section' : '']">
							<div v-if="docObj.orderState == 9 || docObj.orderState == 10 || docObj.orderState == 11" class="refuse-consult-reason">
								退诊原因：描述与病情不符
							</div>
							<div class="consult-state-box" :class="[docObj.orderState == 9 || docObj.orderState == 10 || docObj.orderState == 11 ? 'has-refuse-state-box' : '']">
								<template v-if="docObj.orderState == 2">
									<img class="consult-state-img" :src="waitingRecieveImg" />
									<div class="consult-state-tips-section">
										<div class="consult-state-tips-li">待接诊</div>
										<div class="consult-state-tips-li">已等待：<span class="consult-state-tips-li-time">{{consultWaiting}}</span></div>
									</div>
								</template>
								<template v-if="docObj.orderState == 3">
									<img class="consult-state-img" :src="consultingImg" />
									<div class="consult-state-tips-section">
										<div class="consult-state-tips-li">咨询中</div>
										<div class="consult-state-tips-li">剩余时间：<span class="consult-state-tips-li-time">{{consulting}}</span></div>
									</div>
								</template>
								<!-- 已完成 -->
								<template v-if="docObj.orderState == 4">
									<img class="consult-state-img" :src="consultEndImg" />
									<div class="consult-state-tips-section">
										<div class="consult-state-tips-li">问诊已结束</div>
										<div class="consult-state-tips-li">持续时长：<span class="consult-state-tips-li-time">{{consultEnd}}</span></div>
									</div>
								</template>
								<!-- 退诊，没有原因 -->
								<template v-if="docObj.orderState == 8">
									<img class="consult-state-img" :src="consultEndImg" />
									<div class="consult-state-tips-section">
										<div class="consult-state-tips-li">问诊已结束</div>
										<div class="consult-state-tips-li">持续时长：<span class="consult-state-tips-li-time">{{consultEnd}}</span></div>
									</div>
								</template>
								<!-- 退诊，有原因 -->
								<template v-if="docObj.orderState == 9 || docObj.orderState == 10 || docObj.orderState == 11">
									<img class="consult-state-img" :src="consultEndImg" />
									<div class="consult-state-tips-section">
										<div class="consult-state-tips-li">问诊已结束</div>
										<div class="consult-state-tips-li">持续时长：<span class="consult-state-tips-li-time">{{consultEnd}}</span></div>
									</div>
								</template>
							</div>
						</div>
						<tim ref="tim" :patientImg="patientImgs" :wxUserId="docObj.userId"></tim>
						<template v-if="currentRoom == 0 && isRecieveConsult == false">
							<is-recieve :orderId="docObj.medicalOrderId" :avataUrl="docObj.avatarUrl" :startDate="startDate" :endDate="endDate"></is-recieve>
						</template>
					</li>
					<template v-if="currentRoom == 1 || currentRoom == 2">
						<li class="tab-content-li" v-show="tabTitleIndex == 2">
							咨询小结
						</li>
					</template>
				</ul>
			</template>
		</div>
		<!-- 卡片 -->
		<transition name="fade">
			<div v-if="showDrawers == 1 || showDrawers == 2" class="rooms-section">
				<card ref="childCard" @closeDrawerEvt="closeDrawerChange" :startDate="startDate" :endDate="endDate"></card>
			</div>
		</transition>
		<!-- 结束问诊弹窗 -->
		<div class="end-consult-dialog-section">
			<el-dialog title="结束问诊" :visible.sync="outerVisible" :width="outerWidth" class="radio-dialog-section">
				<el-dialog title="退诊退费" :visible.sync="dialogVisible" :width="dialogWidth"
				 class="radio-dialog-section-detail"
				 append-to-body>
					<div class="choose-refuse-reason-section">
						<el-form ref="form" :model="form" label-width="0" class="formRadio">
							<el-form-item label="">
								<el-radio-group v-model="form.resource" @change="radioChange">
									<el-radio label="不对症">不对症</el-radio>
									<el-radio label="缺少医疗根据">缺少医疗根据</el-radio>
									<div class="other-reason-section">
										<el-radio label="其他原因">其他原因</el-radio>
										<el-input :disabled="radioDisabled" v-model="form.otherReason" placeholder="请输入其他原因" maxlength="10" @change="otherReasonChange"></el-input>
										<div v-if="radioDisabled == false" class="conut-other-reason-length">{{form.otherReason.length}}/10</div>
									</div>
								</el-radio-group>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer" style="text-align: right;">
							<el-button size="small" @click="cancelRefuseBtn">取 消</el-button>
							<el-button size="small" type="primary" @click="confirmConsultBtn">确 定</el-button>
						</div>
					</div>
				</el-dialog>
				<div class="is-end-consult-tips-section">
					<i class="el-icon-warning"></i>
					<div class="is-end-consult-tips">是否确认结束问诊?</div>
				</div>
				<div class="operate-section">
					<div class="operate-section-li">
						<img class="end-consult-modal-img" :src="refuseConsultImg" />
						<div class="end-consult-modal-btn end-consult-refuse-btn" @click="endConsultRefuseBtn">退诊</div>
					</div>
					<div class="operate-section-li">
						<img class="end-consult-modal-img" :src="endConsultImg" />
						<div class="end-consult-modal-btn end-consult-end-btn" @click="endConsultEndBtn">结束</div>
					</div>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import Tim from '@/components/Tim.vue'
	import Card from '@/components/Card.vue'
	import IsRecieve from '@/components/IsRecieve.vue'
	let countTime;
	export default {
		name: 'consultDetail',
		inject: ['reload'],
		computed: {
			...mapState(['timChatHeight',
				'consultType', 'roomType',
				'showDrawers', 'isRecieveConsult',
				'isReload', 'reloadDetail','hisMsgLists'
			]),
		},
		watch: {
			showDrawers(newValue, oldValue) {
				console.log(newValue)
				this.showDrawerChange(newValue)
				this.$nextTick(function() {
					if (newValue == 1) {
						this.$refs.childCard.getInterFaces(newValue)
					}
					if (newValue == 2) {
						this.$refs.childCard.getInterFaces(newValue)
					}
				})
			},
			getHisMsgList:{
				handler(newVal,oldVal){
					console.log(newVal)
					this.getHisMsgLists([])
					this.getHisMsgLists([...newVal])
					this.$refs.tim.hisMsglistRecord()
				},
				deep:true
			},
		},
		components: {
			Tim,
			Card,
			IsRecieve,
		},
		data() {
			return {
				showDrawerVal: 3,
				clickType: 1, //1 接诊 2 查看详情
				patientImgs: '', //患者头像
				doctorInfo: '', //医生头像
				docObj: {},
				endDate: '',
				startDate: '',
				activeName: 'second',
				currentRoom: 2, //当前诊室
				tabTitleIndex: 1,
				consultEndBtnImg: require('../../../assets/tim/consultEnd@2x.png'),
				summaryEditImg: require('../../../assets/tim/summaryEdit.png'),
				summarySubmitImg: require('../../../assets/tim/summarySubmit.png'),
				summarySubmitState: true, //点击咨询小结编辑时，为false 提交按钮出现
				waitingRecieveImg: require('../../../assets/tim/waitingRecieve.png'), //待就诊 待候诊
				consultingImg: require('../../../assets/tim/consulting.png'), //咨询中
				consultEndImg: require('../../../assets/tim/consultEnd.png'), //咨询结束 问诊结束 
				outerVisible: false, //结束问诊弹窗 false默认
				outerWidth: '531px',
				dialogVisible: false,
				form: {
					resource: '不对症',
					otherReason: ''
				},
				dialogWidth: '531px',
				radioDisabled: true,
				params: {},
				refuseConsultImg: require('../../../assets/tim/refuseConsult.png'), //结束问诊 退诊
				endConsultImg: require('../../../assets/tim/endConsult.png'), //结束问诊 结束
				consultWaiting: '', //待接诊 等待时间
				consulting: '', //咨询中
				consultEnd: '', //已完成 已结束
				serviceStartTime: '',
				consultLimitTime: '',
				orderId:'',
				getHisMsgList:[],//拉取历史消息列表
			}
		},
		methods: {
			...mapMutations(["getClickedSecondItem",
				'showDrawerChange', 'getIsRecieveConsult',
				'getIsReload', 'getReloadDetail',
				'getRoomNumsObj','getUpdateConversationList',
				'getHisMsgLists'
			]),
			//结束问诊
			endCosultBtn() {
				this.outerVisible = true
			},
			//结束问诊 大的退诊按钮
			endConsultRefuseBtn() {
				this.refuseConsultClick()
			},
			//结束问诊 结束服务
			endConsultEndBtn() {
				this.endService()
			},
			//结束服务 
			endService() {
				let serviceOrderId = {
					"medicalOrderId": this.docObj.medicalOrderId
				}
				if (this.consultType == 1) {
					this.inquiryEndService(serviceOrderId)
				}
				if (this.consultType == 2) {
					this.consultEndService(serviceOrderId)
				}
			},
			//问诊 结束服务
			inquiryEndService(serviceOrderId) {
				this.api.inquiryCompleteService(serviceOrderId).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.reloadPageRefuse()
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},
			//咨询 结束服务
			consultEndService(serviceOrderId) {
				this.api.completeService(serviceOrderId).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.reloadPageRefuse()
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},
			//退诊
			refuseConsultClick() {
				this.dialogVisible = true
				this.form.resource = '不对症'
				this.form.otherReason = ''
			},
			//relaodPage 退诊
			reloadPageRefuse() {
				this.getClickedSecondItem('问诊详情')
				this.getIsRecieveConsult(false)
				this.reload()
				this.showDrawerChange(3)
				this.getRoomsTotal()
				this.getIsReload(true)
				let currentRoom;
				if (this.consultType == 1) {
					currentRoom = 4
				}
				if (this.consultType == 2) {
					currentRoom = 3
				}
				let params = {
					// types: 2,
					src: this.avataUrl,
					orderId: this.orderId,
					currentRoom: currentRoom
				}
				this.getReloadDetail(params)
			},
			//退诊原因
			radioChange(e) {
				this.withdrawalReason = e
				if (e == '其他原因') {
					this.radioDisabled = false
				}else{
					this.radioDisabled = true
					this.form.otherReason = ''
				}
			},
			//其他原因
			otherReasonChange(e) {
				this.form.otherReason = e
			},
			//取消退诊
			cancelRefuseBtn() {
				this.dialogVisible = false
			},
			//确定退诊
			confirmConsultBtn() {
				console.log('退诊----------')
				this.dialogVisible = false
				if (this.withdrawalReason == '其他原因') {
					this.withdrawalReason = this.form.otherReason
				}
				console.log(this.withdrawalReason)
				let refuseReason = {
					"medicalOrderId": this.orderId,
					"withdrawalReason": this.withdrawalReason
				}
				console.log(refuseReason.withdrawalReason)
				if (this.consultType == 1) {
					this.inquiryWithdrawalService(refuseReason)
				}
				if (this.consultType == 2) {
					this.withdrawalService(refuseReason)
					this.reloadPageRefuse()
				}
			},
			//问诊 退诊
			inquiryWithdrawalService(refuseReason) {
				this.api.inquiryWithdrawalService(refuseReason).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.$message({
							type: 'success',
							message: res.message
						})
						this.reloadPage()
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
						return;
					}
				})
			},
			//咨询 退诊
			withdrawalService(refuseReason) {
				this.api.withdrawalService(refuseReason).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.$message({
							type: 'success',
							message: res.message
						})
						this.reloadPage()
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
						return;
					}
				})
			},
			//获取 候诊室 就诊室 总数
			getRoomsTotal() {
				this.params = {
					"patientPhone": '',
					"patientName": '',
					"startDate": this.startDate,
					"endDate": this.endDate,
					"pageNumber": 1,
					"pageSize": 3,
				}
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
			//咨询小结 编辑
			consultSummary() {
				this.summarySubmitState = !this.summarySubmitState
			},
			//咨询小结提交
			summarySubmit() {
				this.summarySubmitState = !this.summarySubmitState
			},
			hanlderClick(index) {
				if (this.isRecieveConsult == false && index == 0) {
					this.$message({
						type: 'warning',
						message: '请先接诊！'
					})
				} else {
					this.tabTitleIndex = index
				}

			},
			closeDrawerChange(e) {
				// console.log(e)
				this.showDrawerChange(e)
			},
			//咨询详情
			getConsultDetail(id) {
				this.docObj = {}
				let info = {
					"medicalOrderId": id
				}
				if (this.consultType == 1) {
					this.getInquryDetail(info)
				}
				if (this.consultType == 2) {
					this.getConsultDetails(info)
				}
			},
			getInquryDetail(info) {
				this.api.inquiryDetail(info).then((res) => {
					console.log(res)
					if (res.code == 0) {
						this.docObj = res.data
						this.patientImgs = this.docObj.avatarUrl
						this.getHistoryMsgList(res.data.userId)
						let self = this
						if (res.data.orderState == 1) {
							this.getDynamicTime(self, res.data.payTime)
						}
						if (res.data.orderState == 2) {
							this.getDynamicTime(self, res.data.payTime)
						}
						if (res.data.orderState == 3) {
							this.serviceStartTime = res.data.inquiryEndTime
							this.countDown(self)
						}
						if (res.data.orderState == 4 || res.data.orderState == 8 || res.data.orderState == 9 ||
							res.data.orderState == 10 || res.data.orderState == 11) {
							this.timeDuration(self, res.data.serviceDuration)
						}
					} else {
						this.$message({
							message: res.message,
							type: "warning"
						})
						this.showDrawerChange(3)
					}
				})
			},
			getConsultDetails(info) {
				this.api.consultDetail(info).then((res) => {
					console.log(res)
					if (res.code == 0) {
						this.docObj = res.data
						this.patientImgs = this.docObj.avatarUrl
						this.getHistoryMsgList(res.data.userId)
						let self = this
						if (res.data.orderState == 2) {
							this.getDynamicTime(self, res.data.payTime)
						}
						if (res.data.orderState == 3) {
							this.serviceStartTime = res.data.serviceStartTime
							this.consultLimitTime = res.data.consultLimitTime
							this.countDown(self)
						}
						if (res.data.orderState == 4 || res.data.orderState == 8 || res.data.orderState == 9 ||
							res.data.orderState == 10 || res.data.orderState == 11) {
							this.timeDuration(self, res.data.serviceDuration)
						}
					} else {
						this.$message({
							message: res.message,
							type: "warning"
						})
						this.showDrawerChange(3)
					}
				})
			},
			/**
			 * 持续时长 时分
			 * **/
			timeDuration(self, duration) {
				let dur = Number(duration)
				let hours = parseInt((dur % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				let minutes = parseInt((dur % (1000 * 60 * 60)) / (1000 * 60));
				let seconds = parseInt((dur % (1000 * 60)) / 1000);
				self.consultEnd = hours + " 小时 " + minutes + " 分钟 " + seconds + ' 秒 '
			},
			/**
			 * 获取倒计时
			 * **/
			countDown(self) {
				countTime = setInterval(function() {
					let end;
					let start = new Date(self.serviceStartTime).getTime()
					if(self.consultType == 1){
						end = start
					}
					if(self.consultType == 2){
						end = start + self.consultLimitTime * 60000
					}
					// console.log(start)
					let nowTime = new Date()
					let now = nowTime.getTime()
					let gameover = end - now
					if (gameover > 0) {
						var h = Math.floor(gameover / 1000 / 60 / 60);
						var m = Math.floor(gameover / 1000 / 60 % 60);
						var s = Math.floor(gameover / 1000 % 60);
						h = h < 10 ? ('0' + h) : h
						m = m < 10 ? ('0' + m) : m
						s = s < 10 ? ('0' + s) : s
						self.consulting = h + '：' + m + "：" + s
					} else {
						console.log('已截止')
						clearInterval(countTime)
						self.consulting = '00:00:00'
					}
				}, 1000)
			},
			/***
			动态时间：dynamic time
			***/
			getDynamicTime(self, time) {
				setInterval(function() {
					let timeStamp = new Date(time).getTime()
					let currentTime = new Date().getTime()
					let timeDuration = currentTime - timeStamp
					if (timeDuration > 0) {
						var h = Math.floor(timeDuration / 1000 / 60 / 60);
						var m = Math.floor(timeDuration / 1000 / 60 % 60);
						var s = Math.floor(timeDuration / 1000 % 60);
						h = h < 10 ? ('0' + h) : h
						m = m < 10 ? ('0' + m) : m
						s = s < 10 ? ('0' + s) : s
						var hours = self.checkTime(h); //获取时
						var minite = self.checkTime(m); //获取分
						var second = self.checkTime(s); //获取秒  
						/****当时、分、秒、小于10时，则添加0****/
						// console.log(hours + ':' +minite + ':' + second)
						self.consultWaiting = minite + ':' + second
					}

				}, 1000)
			},
			checkTime(i) {
				return i;
			},
			// 拉取历史消息
			getHistoryMsgList(id){
				let that = this
				let msgObjOne = {}
				that.getHisMsgList = []
				let _messageList=[]
				// 打开某个会话时，第一次拉取消息列表 
				let promise = that.tim.getMessageList({conversationID: `C2C${id}`, count: 15});
				promise.then(function(imResponse) {
					console.log('拉取历史消息成功----------')
					console.log(imResponse)
				  const messageList = imResponse.data.messageList; // 消息列表。
				  const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
				  const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
				if(messageList.length > 0){
				      // that.data.historyList = [...messageList]
				      for(let i=0;i<messageList.length;i++){
				    if (messageList[i].type == "TIMCustomElem"){//先判断是否有自定义类型，如果有，判断订单id是否相等，如果相等只拿该自定义消息之后的数据，如果没有，就拿全部数据，说明是当前订单之前的历史数据
				      if(Number((messageList[i].payload).extension) == that.orderId){
				        console.log((messageList[i].payload).extension)
				        console.log(that.orderId)
				        _messageList = messageList.slice(i)
				        console.log(_messageList)
				        break;
				      }else{
				        _messageList.unshift(messageList[i]) 
				      }
				  }else{
				    _messageList.unshift(messageList[i]) 
				  }
				}
				}
				
					_messageList.forEach(ele=>{
						if (ele.type == "TIMTextElem") {
							ele.payload = ele._elements[0].content.text
						}
						if (ele.type == "TIMFaceElem") {
							ele.payload =  JSON.parse(ele._elements[0].content.data)
						}
						if (ele.type == "TIMImageElem") {
							ele.payload = ele._elements[0].content.imageInfoArray[0].url
						}
						if (ele.type == "TIMSoundElem") {
							ele.payload = ele._elements[0].content
						}
						if (ele.type == "TIMCustomElem") {
							let msgObj = {
								data: JSON.parse(ele._elements[0].content.data),
								description: ele._elements[0].content.description,
								extension: ele._elements[0].content.extension
							}
							ele.payload = msgObj
						}
						if( 'time' in ele){
							ele.time = that.$utils.timeConvert(ele.time)
						}
						
						if(ele._elements[0].content.extension != "video"){
							msgObjOne = ele
							that.getHisMsgList.push(ele) 
						}
						
						// console.log(msgObjOne)
						// that.getUpdateConversationList(msgObjOne)
					})
					
				});
			},
		},
		mounted() {
			this.$refs.tim.getQuickReply()
			this.$refs.tim.fromHisMsg = true
			this.withdrawalReason = this.form.resource
		},
		created() {
			// console.log(this.roomType)
			if (this.isReload == true) {
				// this.clickType = this.reloadDetail.types
				this.patientImgs = this.reloadDetail.src
				this.orderId = this.reloadDetail.orderId
				this.currentRoom = this.reloadDetail.currentRoom
				// console.log(this.currentRoom)
			} else {
				// this.clickType = this.$route.params.types
				this.patientImgs = this.$route.params.src
				this.orderId = this.$route.params.orderId
				this.currentRoom = this.$route.params.currentRoom
			}
			console.log(localStorage.getItem('orderId'))
			this.doctorInfo = JSON.parse(this.$cache.get('userInfo'))
			this.endDate = this.$utils.transformTimeYMD(new Date())
			this.startDate = this.$utils.preCurrentTime(new Date())
			this.getConsultDetail(localStorage.getItem('orderId'))
		}
	}
</script>
<!-- 结束问诊弹窗 -->
<style lang="less">
	.radio-dialog-section-detail .el-dialog__header{
		padding: 20px 20px 10px 20px!important;
	}
	.radio-dialog-section-detail .el-dialog__body {
		padding: 0 35px  22px!important;
		// height: 215px !important;
	}
	.formRadio .el-form-item{
		margin-bottom: 22px!important;
	}
	.formRadio .el-radio-group {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.formRadio .el-radio-group .el-radio {
		display: flex;
		align-items: center;
		margin-top: 10px;
	}

	.other-reason-section {
		display: flex;
		align-items: flex-start;
		margin-top: 10px;
	}

	.formRadio .el-radio-group .other-reason-section .el-radio {
		margin-top: 0;
	}

	.other-reason-section .el-input {
		width: 285px !important;
	}

	.other-reason-section .el-input .el-input__inner {
		height: 32px;
	}

	.other-reason-section .conut-other-reason-length {
		margin-left: 11px;
		font-size: 14px;
		font-weight: 400;
		color: #999999;
	}
</style>
<style>
	.operate-section {
		margin-top: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.operate-section .operate-section-li {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.end-consult-modal-img {
		width: 45px;
		height: 45px;
	}

	.end-consult-modal-btn {
		cursor: pointer;
		margin-top: 20px;
		width: 74px;
		height: 32px;
		text-align: center;
		line-height: 32px;
		border: 1px solid #1890FF;
		font-size: 14px;
		font-weight: 400;
	}

	.end-consult-refuse-btn {
		color: #1890FF;
	}

	.end-consult-end-btn {
		background: #1890FF;
		color: #FFFFFF;
	}

	.operate-section .operate-section-li:last-child {
		margin-left: 157px;
	}

	.is-end-consult-tips-section {
		display: flex;
		align-items: center;
	}

	.is-end-consult-tips-section i {
		font-size: 23px;
		color: #2490FF;
	}

	.is-end-consult-tips {
		margin-left: 15px;
		font-size: 16px;
		font-weight: 400;
		color: #666666;
	}
</style>
<!-- 接诊状态栏 -->
<style>
	.consult-state-section {
		width: 100%;
		height: 50px;
		background: rgba(36, 144, 255, 0.05);
		border-radius: 0px 0px 10px 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.has-refuse-state-section {
		justify-content: flex-start;
	}

	.has-refuse-state-box {
		width: 33%;
		text-align: left;
	}

	.refuse-consult-reason {
		width: 33%;
		text-align: left;
		margin-left: 22px;
		font-size: 18px;
		font-weight: 400;
		color: #FF0000;
	}

	.consult-state-box {
		display: flex;
		align-items: center;
	}

	.consult-state-img {
		width: 25px;
		height: 25px;
	}

	.consult-state-tips-section {
		display: flex;
		align-items: center;
		font-size: 18px;
		font-weight: 400;
		color: #2490FF;
	}

	.consult-state-tips-section .consult-state-tips-li {
		margin-left: 24px;
	}

	.consult-state-tips-li-time {
		color: #FF2424;
	}
</style>
<!-- tab -->
<style lang="less">
	.tab-title-section {
		width: 100%;
		height: 82px;
		display: flex;
		align-items: center;
		background-color: #fff;
	}

	.tab-title-list {
		width: 50%;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.tab-title-li {
		padding: 0 17px;
		cursor: pointer;
	}

	.tab-title-li>div {
		width: 100%;
		text-align: center;
		font-size: 24px;
		font-weight: 500;
		color: #666666;
		padding-bottom: 5px;
	}

	.tab-title-li.tab-title-li-active>div {
		color: #1890FF;
		border-bottom: 3px solid #1890FF;
	}

	.tab-btn-groups-section {
		width: 50%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-right: 24px;
	}

	.end-consult-section {
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 8px 17px;
		background: #2490FF;
		border-radius: 4px;
	}

	.end-consult-img {
		width: 20px;
		height: 20px;
	}

	.end-consult-btn {
		margin-left: 13px;
		font-size: 14px;
		font-weight: 400;
		color: #FFFFFF;
	}

	.tab-content-section {
		width: 100%;
	}

	.tab-content-li {
		width: 100%;
	}
</style>
<style lang="less">
	.container {
		position: relative;
	}

	.rooms-section {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 10;
		width: 526px;
		height: 816px;
		background: #FFFFFF;
		box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.47);
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s;
	}

	.fade-enter,
	.fade-leave-to

	/* .fade-leave-active below version 2.1.8 */
		{
		opacity: 0;
	}
</style>
<style lang="less">
	.patient-detail-info-section {
		display: flex;
		align-items: center;
		padding: 34px 22px;
		background: #FFFFFF;
		margin: 24px 0;
	}

	.patinet-img {
		width: 90px;
		height: 90px;
		border-radius: 100%;
	}

	.patient-detail-info-box {
		margin-left: 24px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.patient-name-sex-box {
		display: flex;
		align-items: center;
		font-size: 18px;
		font-weight: 400;
		color: #333333;
	}

	.patient-name-sex-box span:nth-child(2) {
		margin-left: 15px;
	}

	.patient-phone-id-section {
		margin-top: 15px;
		display: flex;
		align-items: center;
		font-size: 14px;
		font-weight: 400;
		color: #333333;
	}

	.patient-phone-id-section .patient-phone-id-li:last-child {
		margin-left: 20px;
	}

	.patient-phone-id-li>span {
		margin-left: 10px;
	}
</style>
