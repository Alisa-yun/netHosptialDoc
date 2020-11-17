<template>
	<div class="echarts-box">
		<el-row>
			<el-col :span="24">
				<div class="condition-options-section">
					<div class="block">
						<el-date-picker class="startDateClass" @change="dateChange" value-format="yyyy-MM-dd" v-model="startDate"
						 :clearable="false" type="date" placeholder="开始日期">
						</el-date-picker>
						<span>-</span>
						<div class="end-date-section">
							<el-date-picker class="endDateClass" :disabled="true" v-model="currentDate" type="date">
							</el-date-picker>
						</div>
					</div>
					<div class="consulting-nums-section">
						<div class="consulting-nums-li">网络问诊：{{inquiryNum}}</div>
						<div class="consulting-nums-li consulting-nums-li-second">咨询问诊：{{consultNum}}</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<div id="myChart" :style="{width: '90%', height: '300px'}"></div>
	</div>
</template>

<script>
	// 引入 ECharts 主模块
	var echarts = require('echarts/lib/echarts');
	// 引入柱状图
	require('echarts/lib/chart/bar');
	// 引入legend组件
	require("echarts/lib/component/legend");
	// 引入dataZoom组件
	require("echarts/lib/component/dataZoom");
	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip');
	require('echarts/lib/component/title');
var myChart;
	export default {
		name: "echart",
		props:['preCurrentDate','currentDate','consultTotal'],
		data() {
			return {
				startDate: '',
				inquiryNum: '',
				consultNum: "",
			}
		},
		methods: {
			//日期改变
			dateChange(e) {
				this.startDate = e
				this.$emit('changDate', e)
			},
			initEchart() {
				this.$nextTick(function() {
					// 基于准备好的dom，初始化echarts实例
					myChart = echarts.init(document.getElementById('myChart'));
					var option = null;
					// 绘制图表
					option = {
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'shadow'
							}
						},
						legend: {
							left: "right",
							data: ["问诊量", "咨询量"]
						},
						dataZoom: [{
							show: true, //是否显示滑动条
							type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
							startValue: 0, // 从头开始。
							endValue: 14 // 一次性展示15个。
						}],
						toolbox: {
							show: true,
							orient: 'vertical',
							left: 'right',
							top: 'center',
							feature: {
								mark: {
									show: true
								},
								dataView: {
									show: true,
									readOnly: false
								},
								magicType: {
									show: true,
									type: ['line', 'bar', 'stack', 'tiled']
								},
								restore: {
									show: true
								},
								saveAsImage: {
									show: true
								}
							}
						},
						xAxis: [{
							type: 'category',
							axisTick: {
								show: false
							},
							data: []
						}],
						yAxis: [{
							type: 'value'
						}],
						series: [{
								name: "问诊量",
								type: 'bar',
								barWidth: 15,
								itemStyle: {
									color: "#78ADF9"
								},
								data: []
							},
							{
								name: "咨询量",
								type: 'bar',
								barWidth: 15,
								itemStyle: {
									color: "#52C3FF",
								},
								data: [],
							}
						],
					};
					myChart.setOption(option)
					myChart.showLoading();
					this.getEchartData(myChart,option)
					setTimeout(function(){
						window.onresize=function(){
							myChart.resize()
						}
					},200)
				})

			},
			//请求数据
			//订单统计
			getEchartData(myChart,option) {
				this.startDate = this.preCurrentDate
				this.inquiryNum = 0
				this.consultNum = 0
				myChart.hideLoading();
				let info = {
					"startDate": this.startDate
				}
				this.api.medicalOrderStatistics(info).then(res => {
					console.log(res)
					if (res.code == 0) {
						let data = res.data
						let list = res.data.details
						this.inquiryNum = data.inquiry
						this.consultNum = data.consult
						let _consultNum = []
						let _inquiryNum = []
						let _date = []
						list.forEach((item, i) => {
							// if (item.date) {
								_date.push(item.date)
							// }
							// if (item.consultNum) {
								_consultNum.push(item.consultNum)
							// }
							// if (item.inquiryNum) {
								_inquiryNum.push(item.inquiryNum)
							// }
						})
						// 每次向后滚动一个，最后一个从头开始。
						if (option.dataZoom[0].endValue == _date.length) {
							option.dataZoom[0].endValue = 14;
							option.dataZoom[0].startValue = 0;
						} else {
							option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
							option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
						}
						myChart.setOption({
							xAxis: {
								data: _date
							},
							series: [ // 根据名字对应到相应的系列
								{
									name: '问诊量',
									data: _inquiryNum
								},
								{
									name: '咨询量',
									data: _consultNum
								}
							]
						})
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},
		},
		mounted() {}
	}
</script>

<style lang="less">
	.echarts-box {
		width: 100%;
	}

	.condition-options-section {
		display: flex;
		align-items: center;
	}


	.startDateClass .el-input__inner {
		// border-right: none;
		// border-top-right-radius: 0;
		// border-bottom-right-radius: 0;
	}

	.endDateClass .el-input__prefix {
		display: none;
	}

	.endDateClass .el-input__inner {
		// border-left: none;
		// border-top-left-radius: 0;
		// border-bottom-left-radius: 0;
	}

	.endDateClass.el-input.is-disabled .el-input__inner {
		background-color: transparent !important;
		width: 200px!important;
	}

	.block {
		display: flex;
		align-items: center;
	}

	.end-date-section {
		// margin-left: -10px;
		// z-index: 2;
	}

	.end-date-section span {
		color: #DCDFE6;
		font-size: 24px;
	}

	.consulting-nums-section {
		margin-left: 59px;
		display: flex;
		align-items: center;
	}

	.consulting-nums-li {
		font-size: 14px;
		font-weight: 400;
		color: #227EFD;
	}

	.consulting-nums-li-second {
		margin-left: 30px;
	}
</style>
<style>
	.startDateClass.el-date-editor.el-input,
	.startDateClass.el-date-editor.el-input__inner {
		width: 200px !important;
	}

	.block .el-input__inner {
		height: 30px !important;
	}

	.block .el-input__icon {
		line-height: 30px !important;
	}
</style>
