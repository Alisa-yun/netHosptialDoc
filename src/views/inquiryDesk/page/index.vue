<template>
	<div>
		<div v-for="(homeItem,homeIndex) in inquiryDeskList" :key="homeIndex">
		<!-- 头部 -->
			<el-row type="flex" class="header-top"  justify="space-between">
			<el-col :span="12">
				<div class="todo-list-section">
					<img class="todo-icon" :src="homeItem.icon" />
					<span class="todo-title">{{homeItem.name}}</span>
				</div>
			</el-col>
			<template v-if="homeItem.id == 1">
				<el-col :span="12">
					<div class="btn-gruop-section">
						<div class="online-state-section">
							<div class="lines-box" :class="[changeState == 0 ? 'lines-box-active' : ''] " @click="changeLineState(0)">下线</div>
							<div class="lines-box" :class="[changeState == 1 ? 'lines-box-active' : '']" @click="changeLineState(1)">上线</div>
						</div>
						<el-button type="primary" round icon="el-icon-refresh" @click="refreshState">刷新</el-button>
					</div>
				</el-col>
			</template>
		</el-row>
		<!-- 内容区 -->
		<el-row type="flex" :gutter="20"  justify="space-between">
			<!-- 待处理事项 -->
			<template v-if="homeItem.id == 1">
				<el-col :span="12"  v-for="(item,index) in todoList" :key="index">
					<div class="todo-list-section-second">
						<p class="todo-list-title">{{item.title}}</p>
						<div class="todo-list-li-section">
							<div class="todo-list-li-content" v-for="(item2,index2) in item.todoList"
							 :key="index2">
								<p class="todo-list-li-title">{{item2.title}}</p>
								<div class="rooms-todo-list-section" v-for="(item3,index3) in item2.todoList" 
								:key="index3"   @click="goRoomList(item.type,item.title,item3.type)">
									<div class="rooms-todo-list-content">
										<div class="rooms-todo-list-icon-box">
											<img class="rooms-todo-list-icon" :src="item3.icon" />
										</div>
										<div class="rooms-todo-list-nums-box">
											<p class="rooms-todo-list-nums-txt">{{item3.todoNums}}</p>
											<p class="rooms-todo-list-nums-describle">当前有{{item3.todoNums}}个订单待处理</p>
										</div>
									</div>
									<p class="look-current-room-btn">
										查看
										<img class="look-arrow-icon" :src="lookArrowIcon" />
									</p>
								</div>
							</div>
						</div>
					</div>
				</el-col>	
			</template>
			<!-- 订单统计 -->
			<template v-else>
				<el-col :span="24">
					<div class="todo-list-section-second">
						<p class="todo-list-title">订单数量统计</p>
						<div class="todo-list-li-section">
							<echart :echartsWidth="echartsWd" ref="echartChild" :preCurrentDate="startDate" 
							:currentDate="endDate" @changDate="getChildDate"></echart>
						</div>
					</div>
				</el-col>	
			</template>
		</el-row>
		</div>	
	</div>
</template>

<script>
	import { mapState, mapMutations} from 'vuex'
	import Echart from '@/components/echart.vue' 
	import mixin from '@/common/mixin.js'; // 引入mixin文件
	export default{
		name:'inquiryDesk',
		mixins:[mixin],
		components: {
			Echart
		},
		computed: {
			...mapState(['onlineState','loginOut']),
		},
		data() {
			return {
				echartsWd:0,//echarts得宽度
				todoIcon:require('@/assets/common/todoIcon@2x.png'),
				changeState:0,
				lookArrowIcon:require('@/assets/common/lookarrow.png'),
				inquiryDeskList:[
					{
						id:1,
						name:'待处理事项',
						icon:require('@/assets/common/todoIcon@2x.png'),
					},
					{
						id:2,
						name:'订单统计',
						icon:require('@/assets/common/orderStatisticsIcon@2x.png'),
					}
				],
				todoList:[
					{
						title:'网络问诊',
						type:1,
						todoList:[
							{
								title:'候诊室',
								todoList:[
									{
										icon:require("@/assets/common/waitingNet@2x.png"),
										type:11,
										todoNums:0
									}
								]
							},
							{
								title:'我的诊室',
								todoList:[
									{
										type:12,
										icon:require("@/assets/common/seekingPatientNet@2x.png"),
										todoNums:0
									}
								]
							}
						]
					},
					{
						title:'图文咨询',
						type:2,
						todoList:[
							{
								title:'候诊室',
								todoList:[
									{
										icon:require("@/assets/common/waitingPictxt@2x.png"),
										type:21,
										todoNums:0
									}
								]
							},
							{
								title:'我的诊室',
								todoList:[
									{
										icon:require("@/assets/common/seekingpictxt@2x.png"),
										type:22,
										todoNums:0
									}
								]
							}
						]
					}
				],
				orderStatisticsList:[
					{
						title1:'订单数量增长统计'
					},
					{
						title1:'今日订单数量统计'
					}
				]
				,repalceTodoList:[],
				startDate:'',
				endDate:'',
				getConsultTotal:{},//咨询/问诊总量信息
				refreshBtn:false
			}
		},
		watch: {
			startDate(newValue, oldValue) {
				this.getChildMethod()
			}
		},
		methods: {
			...mapMutations(['getConsultType','getLoginOut','getRoomType','getClickedSecondItem',"getRoomNumsObj","getOnlineState",'getUpdateConversationList']),
			login() {
				let that = this
				that.tim
					.login({
						userID: that.$cache.get('userID'),
						userSig: that.$cache.get('userSig')
					})
					.then(() => {
						console.log('TIM登陆成功')
						that.getLoginOut(false)
						// console.log(that.loginOut)
						that.editWorkState(1)
					})
					.catch(error => {
						// console.log('TIM登陆失败')
					})
			},
			//退出登录
			timLoginOut(){
				let that = this
				let promise = that.tim.logout();
				promise.then(function(imResponse) {
				  console.log(imResponse.data); // 登出成功
				  console.log('退出成功')
				  that.getLoginOut(true)
				  that.editWorkState(2)
				}).catch(function(imError) {
				  console.warn('logout error:', imError);
				});
			},
			//后台接口上下线
			editWorkState(workState){//工作状态(1上线2下线）
				let workInfo = {
					workState:workState
				}
				this.api.editWorkState(workInfo).then(res=>{
					console.log(res)
					if(res.code == 0){
						
					}else{
						this.$message({
							type:'warning',
							message:res.message
						})
					}
				})
			},
			//刷新状态
			refreshState(){
				this.refreshBtn = true
				this.getTodoCount()
			},
			//查看 =》对应类型房间列表
			goRoomList(consultType,consultName,roomType){
				console.log(`consultType---${consultType}</br>roomType---${roomType}`)
				this.getConsultType(consultType)
				this.getRoomType(roomType)
				this.getClickedSecondItem(consultName)
				this.$router.push('./consultRoom')
			},
			//echart 日期改变的值
			getChildDate(e){
				this.startDate = e
			},
			// 待处理事项 上线下线
			changeLineState(state) {
				let _linesBoxOff =  document.getElementsByClassName('lines-box')[0].getAttribute('class')
				let _linesBoxOn =  document.getElementsByClassName('lines-box')[1].getAttribute('class')
				if(state == 0){
					if(_linesBoxOff.indexOf('lines-box-active') == -1){//下线当前没有选中样式
					this.$confirm('是否确认下线', '提示', {
							 confirmButtonText: '确定',
							 cancelButtonText: '取消',
							 type: 'warning'
						   }).then(() => {
							 this.changeState = 0
						   }).catch(() => {
							this.changeState = 1
							 this.$message({
							   type: 'info',
							   message: '已取消下线'
							 });          
						   });
					}
					}else{
						if(_linesBoxOn.indexOf('lines-box-active') == -1){//当前没有选中样式
							this.changeState = 1
							this.timLogined()
						}
					}
				this.getOnlineState(this.changeState)
			},
			onReceiveMessage(event) {
			  console.log(event)
			  let msgObjOne ={}
			   // this.updateConList = event.data[0]
			   if (event.data[0].type == "TIMTextElem") {
			   	event.data[0].payload = event.data[0]._elements[0].content.text
			   }
			   if (event.data[0].type == "TIMFaceElem") {
			   	event.data[0].payload =  JSON.parse(event.data[0]._elements[0].content.data)
			   }
			   if (event.data[0].type == "TIMImageElem") {
			   	event.data[0].payload = event.data[0]._elements[0].content.imageInfoArray[0].url
			   }
			   if (event.data[0].type == "TIMSoundElem") {
			   	event.data[0].payload = event.data[0]._elements[0].content
			   }
			   if (event.data[0].type == "TIMCustomElem") {
					   let msgObj = {
					   	data: JSON.parse(event.data[0]._elements[0].content.data),
					   	description: event.data[0]._elements[0].content.description,
					   	extension: event.data[0]._elements[0].content.extension
					   }
					   event.data[0].payload = msgObj
				  
			   	
			   }
			   if( 'time' in event.data[0]){
			   	event.data[0].time = this.$utils.timeConvert(event.data[0].time)
			   }
			   if(event.data[0]._elements[0].content.extension != "video"){
				   msgObjOne = event.data[0]
				   this.getUpdateConversationList(msgObjOne)
				   console.log(msgObjOne)
			   }
			  
			},
			//待处理数量计算
			getTodoCount(){
				// let that = this
				this.api.getTodoCount({}).then((res)=>{
					console.log(res)
					if(res.code == 0 ){
						if(this.refreshBtn == true){
							this.$message({
								type:'success',
								message:'刷新成功'
							})
						}
						this.todoList[0].todoList[0].todoList[0].todoNums = res.data.inquiryWaitingRoom
						this.todoList[0].todoList[1].todoList[0].todoNums = res.data.inquiryMyRoom
						this.todoList[1].todoList[0].todoList[0].todoNums = res.data.consultWaitingRoom
						this.todoList[1].todoList[1].todoList[0].todoNums = res.data.consultMyRoom
							// this.getThirdTodoList(this.todoList,res.data)
					}else{
						this.$message({
							type: 'warning',
							message:res.message
						})
					}
				})
			},
			//三级todolist
			getThirdTodoList(json,data){
				json.forEach(item=>{
					if(item.type == 11){
						item.todoNums = data.inquiryWaitingRoom
					}
					if(item.type == 12){
						item.todoNums = data.inquiryMyRoom
					}
					if(item.type == 21){
						item.todoNums = data.consultWaitingRoom
					}
					if(item.type == 22){
						item.todoNums = data.consultMyRoom
					}
					if(item.todoList && item.todoList.length > 0){
						this.getThirdTodoList(item.todoList,data)
					}
				})
				
			},
		    //获取咨询/问诊总量
			getTotal(){
				this.api.getTotal({}).then(res=>{
					console.log(res)
					if(res.code == 0){
						this.getConsultTotal = res.data
					}else{
						this.$message({
							type: 'warning',
							message:res.message
						})
					}
				})
			},
			// echart 请求数据方法
			getChildMethod(){
				this.$refs.echartChild[0].initEchart()
			},
		},
		created() {
			this.refreshBtn = false
			/**
			 * 暂时不用
			 * */
			// this.getTotal()
		},
		mounted(){
			this.$nextTick(function(){
				this.getTodoCount()
				this.endDate = this.$utils.transformTimeYMD(new Date())
				this.startDate = this.$utils.preCurrentTime(new Date())
				// this.getChildMethod()
			})
			
		}
	}
</script>
<!-- 待处理事项内容区 -->
<style lang="less">
	.todo-list-section-second{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		background: #fff;
		padding: 16px 22px 25px 22px;
		margin-top: 18px;
		border-radius: 10px;
	}
	.todo-list-title {
		font-size: 21px;
		font-weight: 400;
		color: #333333;
		margin-bottom: 21px;
	}
	.todo-list-li-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
	.todo-list-li-content{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 45%;
		padding: 12px;
		background: #FFFFFF;
		border-radius: 10px;
		border: 1px solid #F5F5F5;
	}
	.todo-list-li-title{
		width: 94%;
		text-align: left;
		padding:0 0 11px 11px;
		border-bottom: 1px solid #F3F3F3FF;
		font-size: 16px;
		font-weight: 400;
		color: #5E5E5E;
	}
	.rooms-todo-list-section{
		cursor: pointer;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.rooms-todo-list-content {
		display: flex;
		align-items: center;
		padding: 25px 12px 21px 12px;
	}
	.rooms-todo-list-icon-box{
		width: 65px;
		height: 65px;
	}
	.rooms-todo-list-icon {
		width: 100%;
		height: 100%;
	}
	.rooms-todo-list-nums-box {
		margin-left: 19px;
		text-align: left;
	}
	.rooms-todo-list-nums-txt {
		font-size: 35px;
		font-weight: 600;
		color: #5E5E5E;
	}
	.rooms-todo-list-nums-describle{
		font-size: 14px;
		font-weight: 400;
		color: #5E5E5E;
	}
	.look-current-room-btn{
		align-self: flex-end;
		font-size: 14px;
		font-weight: 400;
		color: #1B79FD;
	}
	.look-arrow-icon {
		width: 6px;
		height: 11px;
		margin-left: 4px;
	}
</style>
<!-- 待处理事项头部 -->
<style lang="less">
	.header-top {
		margin-top: 24px;
	}
	.todo-list-section{
		display: flex;
		align-items: center;
 	}
	.todo-icon{
		width: 22px;
		height: 22px;
	}
	.todo-title {
		margin-left: 8px;
		font-size: 26px;
		font-weight: 400;
		color: #333333;
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
	.lines-box {
		width: 100px;
		border-radius: 10px;
	}
	.lines-box-active{
		width: 101px;
		color: #FFFFFF;
		background: #2490FF;
	}
</style>
<!-- 修改elementui样式 -->
<style lang="less">
	.el-button.is-round{
		width: 101px;
		padding: 0!important;
		height: 36px;
		background: #2490FFFF;
	}
</style>