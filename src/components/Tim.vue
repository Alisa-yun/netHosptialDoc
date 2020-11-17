<template>
	<div>
		<!-- :style="{height:timHeight}" -->
		<!-- 聊天列表 -->
		<ul class="chat-list" :style="{height:(timChatHeight -210)+'px'}">
			<li v-for="(item,index) in conversationList" :key="index" class="chat-list-li">
				<!-- in 为收到得消息  out 为发出的消息-->
				<!-- 自定义消息 -->
				<div v-if="item.type == 'TIMCustomElem'" class="chat-list-box">
					<p class="msg-time-section">{{item.time}}</p>
					<div class="header-msg-section" :class="[item.flow == 'out' ? 'chat-list-box-flex reserve' : 'chat-list-box-flex' ]">
						<div class="avatar">
							<template v-if="item.flow == 'out'">
								<img :src="doctorImg" />
							</template>
							<template v-else-if="item.flow == 'in'">
								<img :src="patientImg" />
							</template>
						</div>
						<template v-if="item.flow == 'in'">
							<template v-if="item.payload.data.state">
								<div class="custome-msg-video-section">
									<div class="custome-content-section">
										<div class="custome-content-video-pics" @click="sendVideo">
											<el-image class="custome-content-video-img" :fit="fit" :src="videoIconUrl">
											</el-image>
											<div class="video-msg">{{item.payload.data.name}}</div>
										</div>
									</div>
								</div>
							</template>
							<template v-else>
								<div class="custome-msg-section">
									<div class="custome-msg-title">
										<img class="custome-msg-title-img" :src="item.payload.data.title.titlePic" />
										<div class="custome-msg-title-item">{{item.payload.data.title.name}}</div>
									</div>
									<div class="custome-content-section">
										<div class="custome-content-patient-base-info"><span class="custome-content-patient-base-key">就诊人：</span>{{item.payload.data.contName}}
											{{item.payload.data.contSex}}
											{{item.payload.data.contAge}}岁</div>
										<div class="custome-content-patient-sick-dec"><span class="custome-content-patient-base-key">病情描述：</span>{{item.payload.data.contDecription}}</div>
										<div class="custome-content-patient-sick-pics">
											<el-image v-for="(picItem,picIndex) in  item.payload.data.contList" :key="picIndex" class="custome-content-patient-sick-img"
											 :fit="fit" :src="picItem.imgurl" :preview-src-list="srcList">
											</el-image>
										</div>
									</div>
								</div>
							</template>
						</template>
						<div v-if="item.flow == 'out'" class="custome-msg-video-section">
							<div class="custome-content-section">
								<template v-if="item.payload.data.state">
									<div class="custome-content-video-pics" @click="sendVideo">
										<el-image class="custome-content-video-img" :fit="fit" :src="videoIconUrl">
										</el-image>
										<div class="video-msg">{{item.payload.data.name}}</div>
									</div>
								</template>
								<template v-else>
									<div class="custome-content-video-pics">
										<el-image class="custome-content-video-img" :fit="fit" :src="videoIconUrl">
										</el-image>
										<div class="video-msg">{{item.payload.data.name}}</div>
									</div>
								</template>
							</div>
						</div>
					</div>
				</div>
				<!-- 文本消息  -->
				<div v-if="item.type == 'TIMTextElem'" class="chat-list-box">
					<p class="msg-time-section">{{item.time}}</p>
					<div class="header-msg-section" :class="[item.flow == 'out' ? 'chat-list-box-flex reserve' : 'chat-list-box-flex' ]">
						<div class="avatar">
							<template v-if="item.flow == 'out'">
								<img :src="doctorImg" />
							</template>
							<template v-else-if="item.flow == 'in'">
								<img :src="patientImg" />
							</template>
						</div>
						<div class="text-msg">{{item.payload}}</div>
					</div>
				</div>
				<!-- 表情消息  -->
				<div v-if="item.type == 'TIMFaceElem'" class="chat-list-box">
					<p class="msg-time-section">{{item.time}}</p>
					<div class="header-msg-section" :class="[item.flow == 'out' ? 'chat-list-box-flex reserve' : 'chat-list-box-flex' ]">
						<div class="avatar">
							<template v-if="item.flow == 'out'">
								<img :src="doctorImg" />
							</template>
							<template v-else-if="item.flow == 'in'">
								<img :src="patientImg" />
							</template>
						</div>
						<div class="face-msg-section">
							<div v-for="(faceItem,faceIndex) in item.payload" :key="faceIndex">
								<div v-if="faceItem.type === 1">{{faceItem.content}}</div>
								<div v-if="faceItem.type === 2" style="display: inline-block;" :style="emojiDivBg">
									<!-- :style="{width:lineHeight; height:lineHeight}" -->
									<div :class="[faceItem.imageClass]" :style="emojiBg"></div>
									<!-- :style="{backgroundImage: url('+emojiSource+');}" -->
									<!-- transform: scale('+faceLineHeight/64+'); transformOrigin: 0 0 -->
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 图片消息  -->
				<div v-if="item.type == 'TIMImageElem'" class="chat-list-box">
					<p class="msg-time-section">{{item.time}}</p>
					<div class="header-msg-section" :class="[item.flow == 'out' ? 'chat-list-box-flex reserve' : 'chat-list-box-flex' ]">
						<div class="avatar">
							<template v-if="item.flow == 'out'">
								<img :src="doctorImg" />
							</template>
							<template v-else-if="item.flow == 'in'">
								<img :src="patientImg" />
							</template>
						</div>
						<div class="img-msg-pic">
							<div class="demo-image__preview">
								<el-image :fit="fit" :src="item.payload" :preview-src-list="picsList">
								</el-image>
							</div>
						</div>
					</div>
				</div>
				<!-- 语音消息  -->
				<div v-if="item.type == 'TIMSoundElem'" class="chat-list-box">
					<p class="msg-time-section">{{item.time}}</p>
					<div class="header-msg-section" :class="[item.flow == 'out' ? 'chat-list-box-flex reserve' : 'chat-list-box-flex' ]">
						<div class="avatar">
							<template v-if="item.flow == 'out'">
								<img :src="doctorImg" />
							</template>
							<template v-else-if="item.flow == 'in'">
								<img :src="patientImg" />
							</template>
						</div>
						<div class="sound-msg-section" @click="audioPlay(item.payload.url,item.payload.uuid)">
							{{ item.payload.second + '"' }}
							<template v-if="item.payload.uuid == palyId">
								<img class="sound-icon" :src="palyingIcon" />
							</template>
							<template v-else>
								<img class="sound-icon" :src="pausedIcon" />
							</template>
							
						</div>
					</div>
				</div>
			</li>
		</ul>
		<!-- 聊天输入框 -->
		<div class="input-section" v-if="isRecieveConsult == true">
			<div class="self-msg-section">
				<div class="photo-video-section">
					<div class="upload-section">
						<input class="upload-picture" type="file" for="img" accept=".png,.jpg,.gif,.jpeg" @change="uploadChange" />
						<img class="chat-icon photo-icon" :src="photoIcon" />
						<span class="chat-icon-dec">图片</span>
					</div>
					<div v-if="consultType == 1" @click="sendVideo" class="upload-section">
						<img class="chat-icon video-icon" :src="videoIcon" />
						<span class="chat-icon-dec">视频</span>
					</div>
				</div>
				<div class="quickly-reply-section">
					<el-popover placement="top" width="435" :offset="170" trigger="manual" v-model="visiblePopover">
						<div class="quickly-reply-list-section">
							<div class="quickly-reply-list-title-section">
								<div class="quickly-reply-text">快捷回复</div>
								<img class="quickly-close-img" @click="quicklyCloseBtn" :src="quicklyCloseImg" />
							</div>
							<ul class="quickly-reply-list">
								<li class="quickly-reply-list-li" v-for="(item,index) in quicklyList" :key="index">
									<div class="quickly-reply-list-li-text">{{item.content}}</div>
									<div class="quickly-reply-operation-group">
										<ul class="quickly-reply-operation-group-list">
											<li class="quickly-reply-operation-group-list-li" @click="quicklySend(item.content)">发送</li>
											<li class="quickly-reply-operation-group-list-li" @click="quicklyEdit(item.content,item.replyId)">编辑</li>
											<li class="quickly-reply-operation-group-list-li" @click="quicklyDel(item.replyId)">删除</li>
										</ul>
									</div>
								</li>
							</ul>
							<template v-if="quicklyAddDisabled == false">
								<div class="quickly-reply-add-section" @click="quicklyAdd">
									<img class="quickly-add-img" :src="quicklyAddImg" />
									<div class="quickly-add-btn">添加快捷回复</div>
								</div>
							</template>
							<template v-if="quicklyAddDisabled">
								<div class="quickly-reply-add-section">
									<img class="quickly-add-img" :src="quicklyDisabledAddImg" />
									<div class="quickly-disabled-add-btn">快捷回复已达上线</div>
								</div>
							</template>
						</div>
						<div class="quickly-reply-btn" slot="reference" @click="clickQuicklyBtn">快捷回复</div>
					</el-popover>
				</div>
			</div>
			<div class="send-msg-section">
				<div>
					<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="sendMsg">
					</el-input>
				</div>
				<div class="send-btn">
					<el-button type="primary" size="small" @click="sendMsgEvent">发送</el-button>
				</div>
			</div>
		</div>
		<!-- 视频弹窗 -->
		<el-dialog title="视频通话" :visible.sync="dialogVisible" width="50%"
		:close-on-click-modal="false" :close-on-press-escape="false"
		 :before-close="beforeCloseVideo" class="videoDialog">
			<div>
				<div class="time-remaining-section">剩余时间：<span class="consult-state-tips-li-time">{{timeRemaining}}</span></div>
				<div class="center-page">
					<div v-html="remoteStream" :class="remoteStream?'distant-stream':''">
					</div>
					<div id='local_stream' class="local-stream">
					</div>
				</div>
			</div>
			<el-button type="danger" @click="quitVideo" class="hangUpBtn">挂断</el-button>
			<!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
			</span>
		</el-dialog>
		<!-- 快捷回复弹窗 -->
		<el-dialog class="quickly-dialog" title="快捷回复" :close-on-click-modal="false" :visible.sync="dialogVisibleQuicklyReply"
		 width="30%">
			<el-input class="add-modal-quickly-msg" type="textarea" placeholder="请输入要添加的常用语" v-model="addModalQuicklyMsg"
			 maxlength="100" resize="none" show-word-limit @change="addModalQuicklyMsgChange">
			</el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addModalQuicklyMsgCancle">取 消</el-button>
				<el-button type="primary" @click="addModalQuicklyMsgConfirm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	let conversationList = []
	const audio = document.createElement('audio')
	import '@/common/emoji.css'
	import videoMixin from '@/common/videoMixin.js'; // 引入mixin文件
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: 'tim',
		mixins: [videoMixin],
		props: ['patientImg', 'wxUserId', 'timeRemaining'],
		computed: {
			...mapState(['updateConversationList', 'timChatHeight', 'recievedSoundLength', 'consultType', 'roomType',
				'isRecieveConsult', 'hisMsgLists'
			]),
			soundWidth() {
				let wid = `width:calc(45px + ${this.soundLength}*5px)`
				// console.log(wid)
				return wid;
			},
			emojiBg() {
				let emojiBg =
					`backgroundImage: url(${this.emojiSource});transform: scale(${this.faceLineHeight / 160}); width:100%;height:100%;`
				return emojiBg;
			},
			emojiDivBg() {
				let emojiDivBg = `width: ${this.faceLineHeight}px; height: ${this.faceLineHeight}px`
				return emojiDivBg;
			},
		},
		watch: {
			hisMsgLists: {
				handler(newVal) {
					console.log(newVal)
					this.conversationList = []
					this.hisMsgLists.forEach(ele => {
						this.conversationList.push(ele)
					})
					// console.log('历史记录-------=')
					// console.log(this.conversationList)
				},
				deep: true
			},
			conversationList: {
				handler(newVal) {
					let that = this
					console.log(newVal)
					that.scrollToBottom()
					newVal.forEach(ele => {
						if (ele.type == "TIMImageElem") { //图片列表
							that.picsList.push(ele.payload)
							console.log('图片----------')
							console.log(that.picsList)
						}
						if (ele.type == 'TIMCustomElem') {
							if (!JSON.parse(ele._elements[0].content.data).state) {
								that.srcList = []
								ele.payload.data.contList.forEach(item => {
									that.srcList.push(item.imgurl)
								})
								console.log('患者端自定义消息-----------')
								console.log(that.srcList)
							}
						}
						if (ele.type == 'TIMCustomElem' && ele._elements[0].content.extension == 'refuseVideo') {
							if (that.fromHisMsg == false) {
								that.refuseVideoEvt(that)
							}
						}
					})
				},
				deep: true
			},
			updateConversationList(newValue, oldValue) {
				// console.log(oldValue)
				console.log(newValue)
				if ('time' in newValue) {
					newValue.time = this.$utils.timeConvert(newValue.time)
				}
				if (newValue.type == 'TIMCustomElem') {
					if (!JSON.parse(newValue._elements[0].content.data).state) {
						this.srcList = []
						newValue.payload.data.contList.forEach(item => {
							this.srcList.push(item.imgurl)
						})
						console.log('患者端自定义消息-----------')
						console.log(this.srcList)
					}
				}
				if (newValue.type == 'TIMCustomElem' && newValue._elements[0].content.extension == 'refuseVideo') {
					this.fromHisMsg = false
					this.refuseVideoEvt(this)
				}
				this.conversationList.push(newValue)
				console.log(this.conversationList)
				// this.soundLength = newValue._elements[0].content.second
			},
			['quicklyList.length'](newValue) {
				if (this.quicklyList.length >= 10) {
					this.quicklyAddDisabled = true
				} else {
					this.quicklyAddDisabled = false
				}
			},
			timeRemaining(newValue) {
				// console.log(newValue)
				// console.log('结束了----------')
				if (newValue == '00:00:00') {
					this.$message({
						message: '服务时长已用完',
						type: 'warning'
					});
					this.getIsRecieveConsult(false)
					console.log(this.isRecieveConsult)
					this.dialogVisible = false
					this.leaveRoom(this.client)
					
				}
			},
		},
		data() {
			return {
				picsList: [], //图片 预览的列表
				dialogVisible: false,
				timHeight: '', //聊天框高度
				doctorImg: '', //医生头像
				conversationList: [],
				sendMsg: '',
				faceLineHeight: 60, //表情
				emojiSource: 'http://img.mdesi.fun/emoji-sprite.b5bd1fe0.png', //表情图片
				playid: '', //语音id
				soundLength: 0, //语音的长度
				soundPause: false, //语音暂停
				photoIcon: require("../assets/common/chatPhoto.png"),
				videoIcon: require('../assets/common/chatVideo.png'),
				imageUrl: '', //选择图片的路径
				sendTypes: 'text', //发送消息类型
				soundPause: false, //语音暂停状态 默认false 
				palyId: '', //语音播放ID
				palyingIcon: require('../assets/common/recordsound.gif'),
				pausedIcon: require('../assets/common/soundrecord.png'),
				audio: '', //创建audio标签
				quicklyCloseImg: require('../assets/tim/quicklyClose@2x.png'), //快捷回复 关闭按钮
				quicklyAddImg: require('../assets/tim/quicklyAdd@2x.png'), //快捷回复 添加按钮
				quicklyDisabledAddImg: require('../assets/tim/quicklyDisabledAdd.png'), //快捷回复 添加按钮
				sendMsgQuickly: '', //快捷回复
				quicklyList: [],
				quicklyAddMsg: '', //添加快捷回复
				quicklyAddDisabled: false, //达到十条数据 为true
				dialogVisibleQuicklyReply: false, //快捷回复 
				addModalQuicklyMsg: '', //添加的快捷回复常用语
				visiblePopover: false,
				fit: 'cover',
				srcList: [], //自定义消息 图片列表
				videoIconUrl: require('../assets/tim/videoIcon.png'), //视频未接通的各种情况
				fromHisMsg: true, //判断拒绝消息是否来自历史消息 默认为true 来自历史消息为 true
			}
		},
		//每次页面渲染完之后滚动条在最底部
		methods: {
			...mapMutations(['getIsRecieveConsult']),
			//监听消息列表滚动
			scrollToBottom() {
				this.$nextTick(() => {
					var container = this.$el.querySelector(".chat-list ");
					container.scrollTop = container.scrollHeight;
				})
			},
			//快捷回复
			quicklyCloseBtn() {
				this.visiblePopover = false
			},
			clickQuicklyBtn() {
				this.visiblePopover = true
			},
			//删除
			quicklyDel(id) {
				this.delQuickReply(id)
			},
			//编辑
			quicklyEdit(cont, id) {
				this.dialogVisibleQuicklyReply = true
				this.addModalQuicklyMsg = cont
				this.replyId = id
			},
			// 发送
			quicklySend(cont) {
				this.visiblePopover = false
				this.sendTypes = 'text'
				this.sendMsgQuickly = cont
				this.sendMsgFun(this, this.wxUserId, this.sendMsgQuickly, this.sendTypes)
			},
			//添加 quicklyAddMsg
			quicklyAdd() {
				this.dialogVisibleQuicklyReply = true
				this.addModalQuicklyMsg = ''
				this.replyId = ''
			},
			//弹窗的快捷回复
			addModalQuicklyMsgChange(e) {
				this.addModalQuicklyMsg = e
			},
			//快捷回复 模态框 取消
			addModalQuicklyMsgCancle() {
				this.dialogVisibleQuicklyReply = false
			},
			//快捷回复 模态框 确定
			addModalQuicklyMsgConfirm() {
				if (this.replyId != '') {
					this.editQuickReply(this.replyId)
				} else {
					this.addQuickReplys()
				}
			},
			//获取快捷回复列表
			getQuickReply() {
				this.quicklyList = []
				this.api.getQuickReply({}).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.quicklyList = res.data
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},
			//添加快捷回复列表
			addQuickReplys() {
				let addInfo = {
					content: this.addModalQuicklyMsg
				}
				this.api.addQuickReply(addInfo).then((res) => {
					console.log(res)
					if (res.code == 0) {
						this.dialogVisibleQuicklyReply = false
						this.getQuickReply()
					} else {
						this.$message({
							message: res.message,
							type: "warning"
						})
					}
				})
			},
			//编辑快捷回复列表
			editQuickReply(id) {
				let info = {
					"content": this.addModalQuicklyMsg,
					"replyId": id
				}
				this.api.editQuickReply(info).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.dialogVisibleQuicklyReply = false
						this.getQuickReply()
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},
			//删除快捷回复列表
			delQuickReply(id) {
				let info = {
					replyId: id
				}
				this.api.delQuickReply(info).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.getQuickReply()
					} else {
						this.$message({
							type: 'warning',
							message: res.message
						})
					}
				})
			},
			//通话结束 
			endVideoEvt() {
				this.dialogVisible = false
				this.leaveRoom(this.client)
				let videoData = {
					state: false,
					name: `通话时长：1分22秒`
				}

				let videoInfo = {
					data: JSON.stringify(videoData), // 自定义消息的数据字段
					description: '', //自定义消息的说明字段
					extension: 'endVideo' //自定义消息的扩展字段
				}
				this.sendMsgFun(this, this.wxUserId, videoInfo, this.sendTypes)
			},
			//超时30s未接通
			notConnectedVideo() {
				this.dialogVisible = false
				this.leaveRoom(this.client)
				let videoData = {
					state: true,
					name: '未接通，点击重拨'
				}

				let videoInfo = {
					data: JSON.stringify(videoData), // 自定义消息的数据字段
					description: '', //自定义消息的说明字段
					extension: 'notConnectedVideo' //自定义消息的扩展字段
				}
				this.sendMsgFun(this, this.wxUserId, videoInfo, this.sendTypes)
			},
			//患者端拒绝
			refuseVideoEvt(that) {
				that.dialogVisible = false
				that.leaveRoom(that.client)
			},
			//离开取消视频
			quitVideo() {
				this.$confirm('确认关闭?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.dialogVisible = false
					this.leaveRoom(this.client)
					this.sendTypes = 'custome'
					let videoData = {
						state: true,
						name: '已取消，点击重拨'
					}

					let videoInfo = {
						data: JSON.stringify(videoData), // 自定义消息的数据字段
						description: '', //自定义消息的说明字段
						extension: 'leaveVideo' //自定义消息的扩展字段
					}
					this.sendMsgFun(this, this.wxUserId, videoInfo, this.sendTypes)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消关闭'
					});
				});
			},
			//开启视频
			sendVideo() {
				this.dialogVisible = true
				this.createClient(this.userId)
				this.sendTypes = 'custome'
				let sendVideoData = {
					name: '发送视频'
				}
				let sendVideo = {
					data: JSON.stringify(sendVideoData), // 自定义消息的数据字段 
					//data后续都用自定义消息的话，不想改的话，最好都写成对象模式，并字符串化
					description: '', //自定义消息的说明字段
					extension: 'video' ,//自定义消息的扩展字段 
					//目前extension发自定义消息主要用于视频模块，后续如果文本、图片，语音，等要是换成自定义消息的话，
					//建议description写成订单ID唯一标识，
				}
				this.sendMsgFun(this, this.wxUserId, sendVideo, this.sendTypes)
			},
			//视频关闭
			beforeCloseVideo(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
						this.leaveRoom(this.client)
					})
					.catch(_ => {});
			},
			//语音消息
			audioPlay(src, palyid) {
				// 目前移动端的语音消息采用 aac 格式，以前用 amr 格式。默认先用 audio 标签播放，若无法播放则尝试 amr 格式播放。
				audio.addEventListener('error', this.tryPlayAMR) // 播放出错，则尝试使用 AMR 播放
				this.soundPlay(audio)
				this.soundPaused(audio)
				this.soundEnd(audio)
				audio.src = src
				// console.log(audio.paused)
				// console.log(audio.ended)
				if (this.soundPause) { //暂停状态为true 即正在播放， 暂停播放
					audio.pause();
					this.soundPause = false
					this.palyId = ''
				} else { //暂停状态为false 即暂停状态，未播放  去播放
					audio.play();
					this.soundPause = true
					this.palyId = palyid
				}
			},
			soundPlay(dom) {
				dom.addEventListener('play', () => {
					console.log('正在播放')
					this.soundPause = true
				})
			},
			soundPaused(dom) {
				dom.addEventListener('pause', () => {
					console.log('暂停播放')
					this.soundPause = false
				})
			},
			soundEnd(dom) {
				dom.addEventListener('ended', () => {
					console.log('播放结束')
					this.palyId = ''
				})
			},
			tryPlayAMR() {
				try {
					const isIE = /MSIE|Trident|Edge/.test(window.navigator.userAgent)
					// amr 播放组件库在 IE 不支持
					if (isIE) {
						this.$message({
							message: '您的浏览器不支持该格式的语音消息播放，请尝试更换浏览器，建议使用：谷歌浏览器',
							type: 'warning'
						})
						return
					}
					// 动态插入 amr 播放组件库
					if (!window.BenzAMRRecorder) {
						const script = document.createElement('script')
						script.addEventListener('load', this.playAMR)
						script.src = './BenzAMRRecorder.js'
						const firstScript = document.getElementsByTagName('script')[0]
						firstScript.parentNode.insertBefore(script, firstScript)
						return
					}
					this.playAMR()
				} catch (error) {
					this.$message({
						message: '您的浏览器不支持该格式的语音消息播放，请尝试更换浏览器，建议使用：谷歌浏览器',
						type: 'warning'
					})
				}
			},
			playAMR() {
				if (!this.amr && window.BenzAMRRecorder) {
					this.amr = new window.BenzAMRRecorder()
				}
				if (this.amr.isInit()) {
					this.amr.play()
					return
				}
				this.amr.initWithUrl(this.url).then(() => {
					this.amr.play()
				})
			},
			//图片上传成功
			uploadChange(e) {
				console.log(e)
				this.imageUrl = e.target.files[0];
				this.sendTypes = 'picture'
				this.sendMsgFun(this, this.wxUserId, e.target.files[0], this.sendTypes)
			},
			// 发送消息
			sendMsgEvent() {
				this.sendTypes = 'text'
				this.sendMsgFun(this, this.wxUserId, this.sendMsg, this.sendTypes)
			},
			// 1. 创建消息实例，接口返回的实例可以上屏
			sendMsgFun(that, userId, val, sendType) {
				console.log(userId)
				console.log(val)
				let message = ''
				if (sendType == 'text') {
					message = tim.createTextMessage({
						to: userId,
						conversationType: TIM.TYPES.CONV_C2C,
						payload: {
							text: val
						}
					});
				}
				if (sendType == 'custome') { //视频 后续二期会有咨询小结等自定义消息
					message = tim.createCustomMessage({
						to: userId,
						conversationType: TIM.TYPES.CONV_C2C,
						payload: val
					});
				}
				if (sendType == 'picture') {
					message = tim.createImageMessage({
						to: userId,
						conversationType: TIM.TYPES.CONV_C2C,
						payload: {
							file: val
						}
					});
				}
				// 2. 发送消息
				let promise = tim.sendMessage(message);
				promise.then(function(imResponse) {
					// console.log(that)
					// 发送成功
					console.log('发送成功-----')
					console.log(imResponse);
					if (imResponse.data.message.type == "TIMTextElem") {
						that.sendMsg = ''
						imResponse.data.message.payload = imResponse.data.message.payload.text
					}
					// if (imResponse.data.message.type == "TIMFaceElem") {
					// 	imResponse.data.message.payload = JSON.parse(imResponse.data.message.payload.data)
					// }
					if (imResponse.data.message.type == "TIMImageElem") {
						imResponse.data.message.payload = imResponse.data.message.payload.imageInfoArray[0].url
					}
					// if (imResponse.data.message.type == "TIMSoundElem") {
					// 	imResponse.data.message.payload = imResponse.data.message.payload.imageInfoArray[0].url
					// }
					if (imResponse.data.message.type == "TIMCustomElem") {
						let msgObj = {
							data: JSON.parse(imResponse.data.message.payload.data),
							description: imResponse.data.message.payload.description,
							extension: imResponse.data.message.payload.extension
						}
						imResponse.data.message.payload = msgObj
					}
					// if(imResponse.data.message.type == "TIMAudioElem"){
					// 	imResponse.data.message.payload = imResponse.data.message.payload
					// }
					// if(imResponse.data.message.type == "TIMVideoElem"){
					// 	imResponse.data.message.payload = imResponse.data.message.payload
					// }
					if ('time' in imResponse.data.message) {
						imResponse.data.message.time = that.$utils.timeConvert(imResponse.data.message.time, 1)
					}
					if (imResponse.data.message.payload.extension != 'video') {
						let backMsg = imResponse.data.message;
						that.conversationList.push(backMsg)
						console.log(that.conversationList)
					}
				}).catch(function(imError) {
					// 发送失败
					console.warn('sendMessage error:', imError);
				});
			},
			//获取历史记录
			hisMsglistRecord() {
				this.fromHisMsg = true
				this.conversationList = []
				this.hisMsgLists.forEach(ele => {
					this.conversationList.push(ele)
				})
				console.log('监听的历史记录-------=')
				console.log(this.conversationList)
			},
			// 收到的最近一条消息
			getLastMsg(lastMsg) {
				if (lastMsg.type == "TIMTextElem") {
					lastMsg.payload = lastMsg._elements[0].content.text
				}
				if (lastMsg.type == "TIMFaceElem") {
					lastMsg.payload = JSON.parse(lastMsg._elements[0].content.data)
				}
				if (lastMsg.type == "TIMImageElem") {
					lastMsg.payload = lastMsg._elements[0].content.imageInfoArray[0].url
				}
				if (lastMsg.type == "TIMSoundElem") {
					lastMsg.payload = lastMsg._elements[0].content
					// this.soundLength = lastMsg._elements[0].content.second
				}
				if (lastMsg.type == "TIMCustomElem") {
					let msgObj = {
						data: lastMsg.payload.data,
						description: lastMsg.payload.description,
						extension: lastMsg.payload.extension
					}
					lastMsg.payload = msgObj
					if (!lastMsg.payload.data.state) {
						this.srcList = []
						lastMsg.payload.data.contList.forEach(item => {
							this.srcList.push(item.imgurl)
						})
					}

				}

				if ('time' in lastMsg) {
					lastMsg.time = this.$utils.timeConvert(lastMsg.time)
				}
				let msgObjOne = lastMsg
				console.log(msgObjOne)
				this.conversationList.push(msgObjOne)
			}
		},
		mounted() {
			console.log(this.updateConversationList)
			if (this.updateConversationList) {
				this.getLastMsg(this.updateConversationList)
			}
			this.doctorImg = JSON.parse(this.$cache.get('userInfo')).doctorAvatarUrl //医生头像
			// this.timHeight = (this.timChatHeight - 255) + 'px'
			// console.log(this.timChatHeight)
			// console.log(this.timHeight)
		},
		created() {
			var lett = this;
			document.onkeydown = function(e) {
				var key = window.event.keyCode;
				if (key == 13) {
					lett.sendMsgEvent();
				}
			}
		}
	}
</script>
<!-- 自定义消息 图片放大 -->
<style>
	.el-image-viewer__close {
		background-color: #fff !important;
	}
</style>
<!-- 快捷回复 -->
<style>
	.time-remaining-section {
		text-align: left;
		margin-bottom: 15px;
	}

	.hangUpBtn {
		margin-top: 30px !important;
	}

	.quickly-reply-section {
		cursor: pointer;
	}

	.quickly-reply-list-section {
		display: flex;
		flex-direction: column;
	}

	.quickly-reply-list-title-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 0 12px 0;
	}

	.quickly-reply-text {
		font-size: 20px;
		font-weight: 500;
		color: #666666;
	}

	.quickly-close-img {
		cursor: pointer;
		width: 21px;
		height: 21px;
	}

	.quickly-reply-list {
		display: flex;
		flex-direction: column;
		padding: 0 0 24px 0;
	}

	.quickly-reply-list-li {
		width: 100%;
		padding: 12px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.quickly-reply-add-section {
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 22px 0 5px 0;
		border-top: 1px solid #EEEEEE;
	}

	.quickly-add-img {
		width: 21px;
		height: 21px;
	}

	.quickly-add-btn {
		margin-left: 3px;
		font-size: 18px;
		font-weight: 400;
		color: #999999;
	}

	.quickly-reply-list-li-text {
		font-size: 14px;
		font-weight: 400;
		color: #333333;
		width: 330px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.quickly-reply-operation-group {}

	.quickly-reply-operation-group-list {
		display: flex;
		align-items: center;
	}

	.quickly-reply-operation-group-list-li {
		cursor: pointer;
		padding: 0 26px;
		font-size: 14px;
		font-weight: 400;
		color: #2490FF;
	}

	.quickly-reply-operation-group-list .quickly-reply-operation-group-list-li:nth-child(2) {
		border-left: 1px solid #2490FF;
		border-right: 1px solid #2490FF;
	}

	.quickly-reply-operation-group-list .quickly-reply-operation-group-list-li:last-child {
		padding-right: 0;
	}

	.quickly-disabled-add-btn {
		margin-left: 3px;
		font-size: 18px;
		font-weight: 400;
		color: #999999;
	}

	.add-modal-quickly-msg {
		height: 101px;
	}

	.add-modal-quickly-msg .el-textarea__inner {
		height: 100% !important;
	}

	.quickly-dialog .el-dialog__body {
		height: auto !important;
	}
</style>
<style lang="less">
	.center-page div:first-child {
		width: 100%;
		height: 550px;
		background-color: #000;
	}

	//本地流
	.local-stream {
		position: absolute;
		top: 80px;
		right: 35px;
		z-index: 10;
		width: 300px;
		height: 300px;
	}

	//远端流
	.distant-stream {
		width: 100%;
		height: 550px;
	}

	video {
		left: 0 !important;
	}

	.el-dialog__header {
		text-align: left;
	}

	.videoDialog .el-dialog__body {
		position: relative;
		height: 663px !important;
		padding: 30px 20px;
	}
</style>
<style lang="less">
	.sound-msg-section {
		cursor: pointer;
		padding: 16px 20px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		max-width: 300px;
	}

	.sound-icon {
		width: 35px;
		height: 35px;
		margin-right: 4px;
	}
</style>
<style lang="less">
	.avatar {
		width: 82px;
		height: 82px;
		border-radius: 100%;
		overflow: hidden;
		margin: 0 24px;
	}

	.avatar>img {
		width: 100%;
		height: 100%;
	}

	.input-section {
		width: 100%;
		height: 270px;
		background: #FFFFFF;
		border-radius: 0px 0px 10px 10px;
		border: 1px solid #E9E9E9;
	}

	.self-msg-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28px 18px;
	}

	.photo-video-section {
		display: flex;
		align-items: center;
	}

	.upload-section {
		cursor: pointer;
		position: relative;
		display: flex;
		align-items: center;
	}

	.chat-icon-dec {
		margin-left: 13px;
		font-size: 20px;
		font-weight: 400;
		color: #666666;
	}

	.upload-picture {
		opacity: 0;
		width: 29px;
		height: 29px;
	}

	.photo-icon {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		pointer-events: none;
	}

	.chat-icon {
		cursor: pointer;
		width: 29px;
		height: 29px;
	}

	.video-icon {
		margin-left: 45px;
	}

	.send-msg-section {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.quickly-reply-btn {
		width: 117px;
		height: 34px;
		background: #A1D6FF;
		border-radius: 5px;
		font-size: 18px;
		font-weight: 400;
		color: #FFFFFF;
		text-align: center;
		line-height: 38px;
	}

	.send-msg-section .el-textarea__inner {
		border: none !important;
		height: 120px;
		resize: none;
	}

	.send-btn {
		text-align: right;
		margin-right: 27px;
	}
</style>
<style lang="less">
	.chat-list {
		width: 100%;
		overflow-y: auto;
		background: #F8F8F8;
	}

	.chat-list li {
		margin: 30px 0;
	}

	.chat-list-box {
		display: flex;
		flex-direction: column;
	}

	.header-msg-section {
		display: flex;
		align-items: flex-start;
		border-radius: 0px 20px 20px 20px;
	}

	.chat-list-box-flex {}

	.chat-list-box-flex.reserve {
		flex-direction: row-reverse;
	}
.face-msg-section{
	display: flex;
}
	.chat-list-box-flex .custome-msg-section,
	.chat-list-box-flex .text-msg,
	.chat-list-box-flex .face-msg-section,
	.chat-list-box-flex .sound-msg-section {
		background-color: #fff;
	}

	.chat-list-box-flex.reserve .text-msg,
	.chat-list-box-flex.reserve .face-msg-section,
	.chat-list-box-flex.reserve .sound-msg-section {
		background-color: #fff;
	}

	.img-msg-pic {
		width: 382px;
		// height: 204px;
		margin: 24px;
		max-width: 465px;
		background-image: url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1588859561060&di=0528a9f22beb9a4b5f443c16bbf3b5e0&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fa72000f4a3780806d4039168bd98ad1f16ea94be73d6-qBWrxA_fw658);
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		border-radius: 4px;
		position: relative;
	}

	.img-msg-pic>img {
		width: 100%;
		height: 100%;
	}

	// 自定义消息
	.custome-msg-section {
		width: 448px;
		// height: 295px;
		background: #FFFFFF;
		border-radius: 0px 20px 20px 20px;
	}

	.custome-msg-video-section {
		background: #FFFFFF;
		border-radius: 0px 20px 20px 20px;
	}

	.custome-content-video-pics {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.video-msg {
		font-size: 0.125rem;
		font-weight: 400;
		color: #333333;
	}

	.custome-msg-title {
		display: flex;
		align-items: center;
		padding: 24px 28px;
		border-bottom: 1px solid #EEEEEE;
	}

	.custome-msg-title-img {
		width: 25px;
		height: 25px;
	}

	.custome-msg-title-item {
		margin-left: 24px;
		font-size: 24px;
		font-weight: 400;
		color: #333333;
	}

	.custome-content-section {
		padding: 24px 28px;
	}

	.custome-content-patient-base-info {
		font-size: 18px;
		font-weight: 400;
		color: #333333;
		text-align: left;
	}

	.custome-content-patient-sick-dec {
		width: 100%;
		text-align: left;
		word-wrap: break-word;
		word-break: break-all;
		margin-top: 10px;
		font-size: 18px;
		font-weight: 400;
		color: #333333;

	}

	.custome-content-patient-base-key {
		color: #666666;
	}

	.custome-content-patient-sick-pics {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.custome-content-video-img {
		width: 37px;
		height: 23px;
		margin-right: 10px;
	}

	.custome-content-patient-sick-img {
		width: 80px;
		height: 80px;
		margin-left: 24px;
		margin-top: 18px;
	}

	.custome-content-patient-sick-pics .custome-content-patient-sick-img:nth-child(4n-3) {
		margin-left: 0;
	}

	//文本消息
	.text-msg {
		text-align:left;
		padding: 18px 38px;
		max-width: 300px;
		word-break: break-all;
		word-wrap: break-word;
		font-size: 24px;
		font-weight: 400;
		color: #333333;
	}
</style>
