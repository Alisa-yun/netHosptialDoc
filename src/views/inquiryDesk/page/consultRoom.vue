<template>
	<div class="main-home">
		<!-- tabbartitle -->
		<el-row type="flex" justify="space-between">
			<el-col :span="12">
				<div class="tabbar-title-section">
					<ul class="tabbar-title-list">
						<li class="tabbar-title-li" v-for="(item,index) in tabbarTitleList[consultType]" @click="bindTabbarTitle(item,index)">
							<div class="tabbar-title-li-name" :class="[tabbarTitleCurrentIndex == index ? 'tabbar-title-li-name-active' : '']">{{item.name}}</div>
							<div v-if="tabbarTitleCurrentIndex == index" class="tabbar-title-li-active-line"></div>
						</li>
					</ul>
				</div>
			</el-col>
			<!-- 个人觉得这个地方不需要再有上下线按钮了，上个页面有了，冗余，到时，你看着和设计产品商量下 -->
			<!-- <el-col :span="12">
				<div class="btn-gruop-section">
					<div class="online-state-section">
						<div class="line-box" :class="[changeState == 0 ? 'line-box-active' : ''] " @click="changeLineState(0)">下线</div>
						<div class="line-box" :class="[changeState == 1 ? 'line-box-active' : '']" @click="changeLineState(1)">上线</div>
					</div>
				</div>
			</el-col> -->
		</el-row>
		<!-- content -->
		<el-row type="flex">
			<el-col :span="24">
				<div class="condition-options-section">
					<el-form :inline="true" :model="formInline[consultType][tabbarTitleCurrentIndex]" class="demo-form-inline consult-room-form">
						<el-form-item label="">
							<el-date-picker @change="changeDate" v-model="formInline[consultType][tabbarTitleCurrentIndex].date" type="daterange"
							 value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="患者姓名">
							<el-input @change="patientNameChange" v-model="formInline[consultType][tabbarTitleCurrentIndex].patientName"
							 placeholder="患者姓名"></el-input>
						</el-form-item>
						<el-form-item label="手机号">
							<el-input @change="patientPhoneChange" v-model="formInline[consultType][tabbarTitleCurrentIndex].patientPhone"
							 placeholder="患者手机号"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" size="small" @click="onSubmit">搜索</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="consult-patient-list-section">
					<patient-list ref="patientList"></patient-list>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import PatientList from './patientList.vue'
	import mixin from '@/common/mixin.js'; // 引入mixin文件
	export default {
		name: 'consultRoom',
		// mixins:[mixin],
		computed: {
			...mapState(['clickedSecondItem', 'updateConversationList', 'getLoginOut', 'consultType', 'roomType']),
		},
		components: {
			PatientList,
		},
		data() {
			return {
				// updateConList:{},
				changeState: 0, //0 下线 1 上线
				tabbarTitleCurrentIndex: 0,
				tabbarTitleList: {
					2: [{
							id: 1,
							name: '候诊室'
						},
						{
							id: 2,
							name: '我的诊室'
						},
						{
							id: 3,
							name: '已完成'
						},
						{
							id: 4,
							name: '已退诊'
						}
					],
					1: [{
							id: 1,
							name: '待就诊'
						},
						{
							id: 2,
							name: '候诊室'
						},
						{
							id: 3,
							name: '我的诊室'
						},
						{
							id: 4,
							name: '已完成'
						},
						{
							id: 5,
							name: '已退诊'
						}
					],
				},
				formInline: {
					1: {
						0: {
							date: "",
							patientName: '',
							patientPhone: ''
						},
						1: {
							date: "",
							patientName: '',
							patientPhone: ''
						},
						2: {
							date: "",
							patientName: '',
							patientPhone: ''
						},
						3: {
							date: "",
							patientName: '',
							patientPhone: ''
						},
						4: {
							date: "",
							patientName: '',
							patientPhone: ''
						}
					},
					2: {
						0: {
							date: "",
							patientName: '',
							patientPhone: ''
						},
						1: {
							date: "",
							patientName: '',
							patientPhone: ''
						},
						2: {
							date: "",
							patientName: '',
							patientPhone: ''
						},
						3: {
							date: "",
							patientName: '',
							patientPhone: ''
						}
					}
				},
				defaultInfo: {},
				recievedSoundLength: 0,
			}
		},
		methods: {
			...mapMutations(['getUpdateConversationList','getIsRecieveConsult']),
			// 上线下线 0 下线 1 上线
			// changeLineState(state) {
			// 	this.changeState = state == 0 ? 0 : 1 //按钮状态
			// 	// timLoginOut
			// 	state == 0 ? this.timLoginOut() : this.timLogined() //tim 上下线状态
			// },
			patientNameChange(e) {
				this.formInline[this.consultType][this.tabbarTitleCurrentIndex].patientName = e
				console.log(this.formInline[this.consultType][this.tabbarTitleCurrentIndex].patientName)
			},
			patientPhoneChange(e) {
				this.formInline[this.consultType][this.tabbarTitleCurrentIndex].patientPhone = e
			},
			//tabbartitle
			bindTabbarTitle(name, index) {
				this.tabbarTitleCurrentIndex = index
				this.getDefaultInfo()
				let params = this.defaultInfo[this.consultType][index]
				this.$refs.patientList.getInterFaces(this.tabbarTitleCurrentIndex, this.defaultInfo[this.consultType][this.tabbarTitleCurrentIndex],true)
			},
			//日期
			changeDate(e) {
				console.log(e)
				this.formInline.date = e == null ? '' : e
			},
			// 搜索
			onSubmit() {
				this.getDefaultInfo()
				// console.log(this.formInline[this.consultType][this.tabbarTitleCurrentIndex].patientName)
				// console.log(this.defaultInfo[this.consultType][this.tabbarTitleCurrentIndex])
				this.$refs.patientList.getInterFaces(this.tabbarTitleCurrentIndex, this.defaultInfo[this.consultType][this.tabbarTitleCurrentIndex],true)
			},
			//获取初始默认信息
			getDefaultInfo() {
				let repInfo = this.formInline[this.consultType][this.tabbarTitleCurrentIndex]
				this.defaultInfo = {
					1: {
						0: {
							"startDate": repInfo.date[0],
							"endDate": repInfo.date[1],
							"patientName": repInfo.patientName,
							"patientPhone": repInfo.patientPhone,
						},
						1: {
							"startDate": repInfo.date[0],
							"endDate": repInfo.date[1],
							"patientName": repInfo.patientName,
							"patientPhone": repInfo.patientPhone,
						},
						2: {
							"startDate": repInfo.date[0],
							"endDate": repInfo.date[1],
							"patientName": repInfo.patientName,
							"patientPhone": repInfo.patientPhone,
						},
						3: {
							"startDate": repInfo.date[0],
							"endDate": repInfo.date[1],
							"patientName": repInfo.patientName,
							"patientPhone": repInfo.patientPhone,
						},
						4: {
							"startDate": repInfo.date[0],
							"endDate": repInfo.date[1],
							"patientName": repInfo.patientName,
							"patientPhone": repInfo.patientPhone,
						}
					},
					2: {
						0: {
							"startDate": repInfo.date[0],
							"endDate": repInfo.date[1],
							"patientName": repInfo.patientName,
							"patientPhone": repInfo.patientPhone,
						},
						1: {
							"startDate": repInfo.date[0],
							"endDate": repInfo.date[1],
							"patientName": repInfo.patientName,
							"patientPhone": repInfo.patientPhone,
						},
						2: {
							"startDate": repInfo.date[0],
							"endDate": repInfo.date[1],
							"patientName": repInfo.patientName,
							"patientPhone": repInfo.patientPhone,
						},
						3: {
							"startDate": repInfo.date[0],
							"endDate": repInfo.date[1],
							"patientName": repInfo.patientName,
							"patientPhone": repInfo.patientPhone,
						}
					}
				}
				if (this.consultType == 1) {
					this.defaultInfo[this.consultType][this.tabbarTitleCurrentIndex]
				}
				if (this.consultType == 2) {
					this.defaultInfo[this.consultType][this.tabbarTitleCurrentIndex]
				}
			},
			formInlineInquiry(preSevenDate, currentDate) {
				this.formInline[this.consultType][0].date = [preSevenDate, currentDate]
				this.formInline[this.consultType][1].date = [preSevenDate, currentDate]
				this.formInline[this.consultType][2].date = [preSevenDate, currentDate]
				this.formInline[this.consultType][3].date = [preSevenDate, currentDate]
				this.formInline[this.consultType][4].date = [preSevenDate, currentDate]
			},
			formInlineConsult(preSevenDate, currentDate) {
				this.formInline[this.consultType][0].date = [preSevenDate, currentDate]
				this.formInline[this.consultType][1].date = [preSevenDate, currentDate]
				this.formInline[this.consultType][2].date = [preSevenDate, currentDate]
				this.formInline[this.consultType][3].date = [preSevenDate, currentDate]
			},
			//初始化部分数据
			initData() {
				let newDate = new Date()
				let preSevenDate = this.$utils.preSevenCurrentTime(newDate)
				let currentDate = this.$utils.transformTimeYMD(newDate)
				console.log(this.formInline[this.consultType])
				this.consultType == 1 ? this.formInlineInquiry(preSevenDate, currentDate) : this.formInlineConsult(preSevenDate,
					currentDate)
				if (this.consultType == 1 && this.roomType == 11) {
					this.tabbarTitleCurrentIndex = 1
				}
				if (this.consultType == 1 && this.roomType == 12) {
					this.tabbarTitleCurrentIndex = 2
				}
				if (this.consultType == 2 && this.roomType == 22) {
					this.tabbarTitleCurrentIndex = 1
				}
			},
		},
		mounted() {
			this.getIsRecieveConsult(false)
			this.getDefaultInfo()
			this.$refs.patientList.getInterFaces(this.tabbarTitleCurrentIndex, this.defaultInfo[this.consultType][this.tabbarTitleCurrentIndex],false)
		},
		created() {
			this.initData()
		}
	}
</script>
<!-- content list -->
<style lang="less">
	.consult-patient-list-section {}
</style>
<!-- content condition options -->
<style lang="less">
	.condition-options-section {
		margin-top: 22px;
		border-top: 1px solid #d8d8d8;
		padding-top: 24px;
	}

	.btn-gruop-section {
		display: flex;
		justify-content: flex-end;
	}

	.online-state-section {
		display: flex;
		line-height: 36px;
		margin-right: 29px;
		width: 200px;
		height: 36px;
		border: 1px solid #59ABFF;
		border-radius: 10px;
		font-size: 14px;
		font-weight: 400;
		color: #2490FF;
	}

	.line-box {
		width: 100px;
		border-radius: 10px;
	}

	.line-box-active {
		color: #FFFFFF;
		background: #2490FF;
	}

	.consult-room-form {
		text-align: left;
	}
</style>
<!-- 修改eleui样式 -->
<style>
	.consult-room-form .el-input__inner {
		height: 32px!important;
	}
	.consult-room-form  .el-button--small {
		    padding: 0 15px!important;
		    height: 32px!important;
			line-height: 0.166667rem!important;
	}

	.consult-room-form .el-date-editor .el-range-separator {
		line-height: 24px !important;
	}

	.consult-room-form .el-date-editor .el-range__icon {
		line-height: 24px !important;
	}

	.consult-room-form .el-date-editor .el-range__close-icon {
		line-height: 24px !important;
	}

	.consult-room-form .el-date-editor--daterange.el-input__inner {
		width: 350px !important;
	}
</style>
<!-- tabbarttitle -->
<style lang="less">
	.tabbar-title-list {
		display: flex;
		align-items: center;
	}

	.tabbar-title-li {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-left: 34px;
	}

	.tabbar-title-li-name {
		font-size: 24px;
		font-weight: 400;
		color: #858585;
		margin-bottom: 10px;
	}

	.tabbar-title-list .tabbar-title-li:first-child {
		margin-left: 0;
	}

	.tabbar-title-li-name-active {
		color: #2490FF;
	}

	.tabbar-title-li-active-line {
		width: 60%;
		height: 2px;
		background: #1890FF;
		border-radius: 2px;
	}
</style>
