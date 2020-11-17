<template>
	<div class="is-recieve-section">
		<div class="is-recieve-box">
			<p class="is-recieve-tips">若患者咨询的病情不对症，您可以提前操作退诊</p>
			<div class="is-recieve-btn-groups">
				<div class="recieve-btn" @click="recieveConsultClick">接诊</div>
				<div class="refuse-consult-btn" @click="refuseConsultClick">退诊</div>
			</div>
		</div>
		<el-dialog title="退诊退费" :visible.sync="dialogVisible" :width="dialogWidth" class="radio-dialog-section">
			<div class="choose-refuse-reason-section">
				<el-form ref="form" :model="form" label-width="0" class="form">
					<el-form-item label="">
						<el-radio-group v-model="form.resource" @change="radioChange">
							<el-radio label="不对症">不对症</el-radio>
							<el-radio label="缺少医疗根据">缺少医疗根据</el-radio>
							<div class="other-reason-section">
								<el-radio label="其他原因">其他原因</el-radio>
								<el-input :disabled="radioDisabled" v-model="form.otherReason" placeholder="请输入其他原因" show-word-limit maxlength="10" @change="otherReasonChange"></el-input>
								<!-- <div v-if="radioDisabled == false" class="conut-other-reason-length">{{form.otherReason.length}}/10</div> -->
							</div>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button size="small" @click="cancelRefuseBtn">取 消</el-button>
					<el-button size="small" type="primary" @click="confirmConsultBtn">确 定</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: 'IsRecieve',
		inject: ['reload'],
		computed: {
			...mapState(['isRecieveConsult', 'consultType']),
		},
		props: ['orderId', 'avataUrl', 'startDate', 'endDate'],
		data() {
			return {
				params: {},
				dialogVisible: false,
				form: {
					resource: '不对症',
					otherReason: ''
				},
				dialogWidth: '531px',
				radioDisabled: true
			}
		},
		methods: {
			...mapMutations(["getClickedSecondItem",
				'showDrawerChange', 'getIsRecieveConsult',
				'getIsReload', 'getReloadDetail',
				'getRoomNumsObj'
			]),
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
				this.dialogVisible = false
				if (this.withdrawalReason == '其他原因') {
					this.withdrawalReason = this.form.otherReason
				}
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
						this.reloadPageRefuse()
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
						this.reloadPageRefuse()
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
						return;
					}
				})
			},
			//接诊
			recieveConsultClick() {
				this.reloadPageRecieve()
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
			//reloadPage 接诊
			reloadPageRecieve() {
				console.log(this.orderId)
				this.getClickedSecondItem('问诊详情')
				let id = {
					"medicalOrderId": this.orderId
				}
				if (this.consultType == 1) {
					this.inquiryBeginConsult(this.avataUrl, this.orderId, id)
				}
				if (this.consultType == 2) {
					this.beginConsult(this.avataUrl, this.orderId, id)
				}
			},
			//网络问诊 接诊
			inquiryBeginConsult(url, orderId, id) {
				this.api.inquiryStartService(id).then(res => {
					if (res.code == 0) {
						this.getIsRecieveConsult(true)
						this.refreshPage(url, orderId)
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},
			//咨询接诊
			beginConsult(url, orderId, id) {
				this.api.startService(id).then(res => {
					if (res.code == 0) {
						this.getIsRecieveConsult(true)
						this.refreshPage(url, orderId)
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},
			//刷新
			refreshPage(url, orderId) {
				this.reload()
				this.showDrawerChange(3)
				this.getRoomsTotal()
				this.getIsReload(true)
				let currentRoom;
				if (this.consultType == 1) {
					currentRoom = 1
				}
				if (this.consultType == 2) {
					currentRoom = 0
				}
				let params = {
					// types: 2,
					src: url,
					orderId: orderId,
					currentRoom: currentRoom
				}
				this.getReloadDetail(params)
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
		},
		mounted() {
			this.withdrawalReason = this.form.resource
		}
	}
</script>

<style lang="less">
	.is-recieve-box {
		width: 100%;
		height: 166px;
		background: #FFFFFF;
		border-radius: 0px 0px 10px 10px;
		border: 1px solid #E9E9E9;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.is-recieve-tips {
		margin-top: 45px;
		font-size: 18px;
		font-weight: 400;
		color: #666666;
	}

	.is-recieve-btn-groups {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 24px;
	}

	.recieve-btn {
		cursor: pointer;
		width: 127px;
		height: 36px;
		background: #2490FF;
		border-radius: 4px;
		text-align: center;
		line-height: 36px;
		font-size: 14px;
		font-weight: 400;
		color: #FFFFFF;
	}

	.refuse-consult-btn {
		cursor: pointer;
		margin-left: 68px;
		width: 127px;
		height: 36px;
		border-radius: 4px;
		border: 1px solid #2490FF;
		text-align: center;
		line-height: 36px;
		font-size: 14px;
		font-weight: 400;
		color: #2490FF;
	}
</style>

<style lang="less">
	.radio-dialog-section .el-dialog__body {
		padding: 24px 35px !important;
		height: 215px !important;
	}

	.form .el-radio-group {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.form .el-radio-group .el-radio {
		display: flex;
		align-items: center;
		margin-top: 18px;
	}

	.other-reason-section {
		display: flex;
		align-items: center;
		margin-top: 18px;
	}

	.form .el-radio-group .other-reason-section .el-radio {
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
