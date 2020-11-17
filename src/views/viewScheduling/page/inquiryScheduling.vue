<template>
	<div class="calendar-section">
		<div class="calendar-box">
			<el-calendar id="calendar" v-model="value">
				<template slot="dateCell" slot-scope="{date, data}">
					<!--自定义内容-->
					<div @click="calendarClick(data)">
						<div class="calendar-day"><span>{{ data.day.split('-').slice(2).join('-') }}</span></div>
						<div class="each-data-box" v-for="(item,index) in calendarDataList" :key="index" @click="infoClick(item)">
							<div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">
								<div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
									<div class="each-data-section">{{item.time}} {{item.surplusNum}}</div>
								</div>
								<div v-else></div>
							</div>
							<div v-else></div>
						</div>
					</div>
				</template>
			</el-calendar>
		</div>
	</div>
</template>

<script>
	export default {
		name: "viewScheduling",
		components: {},
		data() {
			return {
				value: new Date(),
				calendarDataList: []
			}
		},
		methods: {
			// 点击详情
			calendarClick(e) {
				console.log(e)
			},
			infoClick(e) {
				console.log(e)
			},
			//问诊 日期
			getScheduling(y, m) {
				let info = {
					"month": m,
					"year": y
				}
				this.api.inquiryScheduling(info).then(res => {
					console.log(res)
					let _calendarDataList = []
					let _monthsList = []
					let _daysList = []
					let _months = ''
					let _days = ''
					if (res.code == 0) {
						let data = res.data
						Object.keys(data).forEach(key => {
							if (data[key].length > 0) {
								_months = this.$utils.transformDate(key).split('-')[1]
								_days = this.$utils.transformDate(key).split('-')[2]
								_monthsList = [_months]
								_daysList = [_days]
								data[key].forEach(val => {
									if (this.$utils.transformDate(key).split('-')[2] == this.$utils.transformDate(val.date).split('-')[2]) {
										_calendarDataList.unshift({
											schedulingId: val.schedulingId,
											surplusNum: val.surplusNum,
											time: val.time,
											months: _monthsList,
											days: _daysList
										})
									}
								})
							}
						})
						this.calendarDataList = [..._calendarDataList]
						// console.log(this.calendarDataList)
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			}
		},
		created() {
			this.$nextTick(function() {
				//点击今天
				let todayBtn = document.querySelector(
					".el-calendar__button-group .el-button-group>button:nth-child(2)"
				);
				todayBtn.style.display = 'none'
				//点击上一个月
				let prevBtn = document.querySelector(
					".el-calendar__button-group .el-button-group>button:nth-child(1)"
				)
				prevBtn.innerHTML = `<span><i class="el-icon-arrow-left"></i></span>`
				prevBtn.style.marginRight = '114px'
				prevBtn.addEventListener('click',()=>{
					console.log(this.value)
					this.getScheduling(this.$utils.transformDate(this.value).split('-')[0], this.$utils.transformDate(this.value)
						.split('-')[1])
				})
				//点击下一个月
				let nextBtn = document.querySelector(
					".el-calendar__button-group .el-button-group>button:nth-child(3)"
				);
				nextBtn.innerHTML = `<span><i class="el-icon-arrow-right"></i></span>`
				nextBtn.addEventListener('click',()=>{
					console.log(this.value)
					this.getScheduling(this.$utils.transformDate(this.value).split('-')[0], this.$utils.transformDate(this.value)
						.split('-')[1])
				})
				this.getScheduling(this.$utils.transformDate(this.value).split('-')[0], this.$utils.transformDate(this.value)
					.split('-')[1])
			})
		}
	}
</script>

<style>
	.calendar-section {
		width: 100%;
		margin-top: 24px;
		background: #FFFFFF;
	}

	.calendar-box {
		margin: 18px 21px;
		box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		border: 1px solid #EEEEEE;
	}

	.calendar-section::before {
		display: table;
		content: ""
	}

	.calendar-day {
		padding: 8px 0 16px;
		text-align: left;
		font-size: 16px;
	}

	.each-data-section {
		background: #2490FF;
		color: #fff;
		padding: 4px;
		font-size: 14px;
		font-weight: 400;
		color: #FFFFFF;
	}

	.each-data-box {
		margin-top: 1px;
		/*no*/
	}
</style>
<style>
	.el-calendar__header {
		justify-content: center !important;
	}

	.el-calendar__title {
		position: absolute;
		z-index: 2;
	}

	.calendar-img-label {
		width: 28px;
		height: 28px;
	}

	.el-calendar-table td.is-selected {
		background-color: #E0FFF9 !important;
	}

	.el-calendar-table .el-calendar-day {
		height: 110px !important;
		/*no*/
		text-align: left;
	}

	.el-calendar-table td.is-selected .calendar-day {
		display: inline-block;
		padding: 6px;
		background: rgba(61, 206, 177, 0.32);
		border-radius: 100%;
		color: #FFFFFF;
		margin-bottom: 3px;
	}

	.el-calendar-table td.is-selected .calendar-day>span {
		padding: 4px;
		background: #3DCEB1;
		border-radius: 100%;
		display: inline-block;
	}
</style>
