const state = {
	timChatHeight:0,//聊天框高度
	menuItem:'问诊工作台',//点击的左边菜单
	clickedSecondItem:'',//点击 某些模块的名字
	isCollapse:true,//左边侧边栏展开/折叠状态 true 展开 false 折叠
	consultType:1,//问诊 1  咨询 2
	roomType:11,// 11 问诊候诊室 12 问诊就诊室 21 咨询候诊室 22 咨询就诊室 
	roomNumsObj:{//waitingRoomNums候诊室 myRoomNums 我的诊室
		waitingRoomNums:0,
		myRoomNums:0
	},
	onlineState:1,//tim 上下线状态 默认1 上线
	loginOut:true,//退出登录状态 默认 true
	/**
	 * TIM TRTC
	 * **/
	 updateConversationList: {},//对话列表更新
	 showDrawers:3,//候诊室 1 我的诊室 2  关闭 3
	 isReload:false,
	 reloadDetail:{},//问诊详情页重新刷新 拿到的患者信息
	 isRecieveConsult:false,//是否接诊 默认false 未接诊
	 hisMsgLists:[],//拉取历史消息
}
export default state