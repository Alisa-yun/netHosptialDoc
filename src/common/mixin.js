/**
 * 腾讯云即时通信的初始化sdk
 * **/
export default {
	data() {
		return {
		}
	},
	created() {
		this.onlineState == 0 ? this.timLoginOut() : this.timLogined() //tim 上下线状态
		this.changeState = this.onlineState == 0 ? 0 : 1
	},
	mounted() {
		//默认下线
		// this.timLoginOut()
		// 初始化监听器
		// this.timLogined()
		console.log(this.onlineState)
		// if( this.onlineState != null ){//之前进来过
			// this.onlineState == 0 ? this.timLoginOut() : this.timLogined() //tim 上下线状态
			// this.changeState = this.onlineState == 0 ? 0 : 1
		// }
		
	},
	methods: {
		async timLogined() {
			try {
				let loginState = await this.initListener()
				this.login()
			} catch (e) {
				throw Error(e)
			}
		},
		
		initListener() {
			// 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
			this.tim.on(this.TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this)
			// SDK NOT READT
			this.tim.on(this.TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate, this)
			// 被踢出
			this.tim.on(this.TIM.EVENT.KICKED_OUT, this.onKickOut)
			// SDK内部出错
			this.tim.on(this.TIM.EVENT.ERROR, this.onError)
			// 收到新消息
			this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage)
			// 会话列表更新
			this.tim.on(this.TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onUpdateConversationList)
			// 群组列表更新
			this.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, this.onUpdateGroupList)
			// 网络监测
			this.tim.on(this.TIM.EVENT.NET_STATE_CHANGE, this.onNetStateChange)
			// 已读回执
			this.tim.on(this.TIM.EVENT.MESSAGE_READ_BY_PEER, this.onMessageReadByPeer)
		},
		
		
		onReadyStateUpdate(event) {
				  console.log(event)
		},
		onUpdateConversationList(event) {
		 console.log(event)
		},
		onError(event) {
			console.log(event)
		},
		onMessageReadByPeer(event) {
			console.log(event)
		},
		onNetStateChange(event) {
			console.log(event)
		},
		onKickOut(event) {
			console.log(event)
		},

		onUpdateGroupList(event) {
			console.log(event)
		},
		onReceiveGroupSystemNotice(event) {
			console.log(event)
		},
	}
}
