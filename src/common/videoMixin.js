/***
腾讯云音视频SDK初始化
**/
import TRTC from 'trtc-js-sdk';
export default {
	data() {
		return {
			userId: '', //用户id --可更改
			roomId: '', //房间号--加入相同房间才能聊 医生id
			client: '', //客户端服务
			remoteStream: '', //远方播放流
			localStream: '', //本地流
		}
	},
	created() {
		this.userId = this.$cache.get('userID')
		// this.roomId = this.$cache.get('doctorId')
		this.roomId = 111
	},
	mounted() {},
	methods: {
		//创建链接
		createClient(userId) {
			//获取签名
			const userSig = this.$cache.get('userSig')
			const sdkAppId = this.$cache.get('sdkAppID')
			this.client = TRTC.createClient({
				mode: 'rtc',
				sdkAppId,
				userId,
				userSig
			});
			//注册远程监听，要放在加入房间前--这里用了发布订阅模式
			this.subscribeStream(this.client)
			//初始化后才能加入房间
			this.joinRoom(this.client, this.roomId)
		},
		//加入房间
		joinRoom(client, roomId) {
			console.log(roomId)
			client.join({
					roomId
				})
				.catch(error => {
					console.error('进房失败 ' + error);
				})
				.then(() => {
					console.log('进房成功');
					
					//创建本地流
					this.createStream(this.userId)
					//播放远端流
					this.playStream(this.client)
				});
		},
		//创建本地音视频流
		createStream(userId) {
			const localStream = TRTC.createStream({
				userId,
				audio: true,
				video: true
			});
			console.log(localStream)
			this.localStream = localStream

			localStream
				.initialize()
				.catch(error => {
					console.error('初始化本地流失败 ' + error);
				})
				.then(() => {
					console.log('初始化本地流成功');
					// 创建好后才能播放 本地流播放 local_stream 是div的id
					localStream.play('local_stream');
					//创建好后才能发布
					this.publishStream(localStream, this.client)
				});
		},
		//发布本地音视频流
		publishStream(localStream, client) {
			client
				.publish(localStream)
				.catch(error => {
					console.error('本地流发布失败 ' + error);
				})
				.then(() => {
					console.log('本地流发布成功');
				});
		},

		//订阅远端流--加入房间之前
		subscribeStream(client) {
			client.on('stream-added', event => {
				console.log(event.stream)
				const remoteStream = event.stream;
				console.log('远端流增加: ' + remoteStream.getId());
				//订阅远端流
				client.subscribe(remoteStream);
			});
			this.handleEvents(client);//监听远端流
		},
	//监听远端流进入房间，退出房的通知事件
		handleEvents (client) {
		  client.on('peer-leave', evt => {
			 const userId = evt.userId;
			 console.log('peer-leave ' + userId);
		   });
		   client.on('peer-join', evt => {
		     const userId = evt.userId;
		     console.log('peer-join ' + userId);
		   });
		   client.on('stream-removed', evt => {//远端流移除事件，当远端用户取消发布流后会收到该通知。医生端显示已拒绝
		     const userId = evt.userId;
			 const remoteStreamRemoved = event.stream;
		     console.log('stream-removed' + userId);
			 console.log(evt);
		   });
		   client.on('stream-updated', evt => {//远端流更新事件，当远端用户添加、移除或更换音视频轨道后会收到该通知。
		     const userId = evt.userId;
		   	 const remoteStreamUpdated = event.stream;
		     console.log('stream-updated' + userId);
			 console.log(evt);
		   });
		 },
		//播放远端流
		playStream(client) {
			client.on('stream-subscribed', event => {
				const remoteStream = event.stream;
				console.log('远端流订阅成功：' + remoteStream.getId());
				// 创建远端流标签，因为id是动态的，所以动态创建，用了v-html

				this.remoteStream = `<view id="${'remote_stream-' + remoteStream.getId()}"  ></view>`;

				//做了dom操作 需要使用$nextTick(),否则找不到创建的标签无法进行播放
				this.$nextTick(() => {
					//播放
					remoteStream.play('remote_stream-' + remoteStream.getId());
				})
			});
		},

		//退出音视频
		leaveRoom(client) {
			// // 取消发布本地流
			this.client.unpublish(this.localStream).then(() => {
				this.closeVideo();
			  // 取消发布本地流成功
			  console.log('取消发布本地流成功')
			});
			this.client
				.leave()
				.then(() => {
					console.log('退房成功')
					// 停止本地流，关闭本地流内部的音视频播放器
					this.localStream.stop();
					// 关闭本地流，释放摄像头和麦克风访问权限
					this.localStream.close();
					this.localStream = null;
					this.client = null
					this.closeVideo();
					// 退房成功，可再次调用client.join重新进房开启新的通话。
				})
				.catch(error => {
					console.error('退房失败 ' + error);
					// 错误不可恢复，需要刷新页面。
				});
		},
		//关闭视频
		closeVideo(){
			// 关闭视频通话示例，对应addTrack接口的开启视频通话示例
			const videoTrack = localStream.getVideoTrack();
			if (videoTrack) {
			  localStream.removeTrack(videoTrack).then(() => {
			    // 关闭视频通话成功，停止videoTrack并释放摄像头资源
			    videoTrack.stop();
			  });
			}
		}
	}
}
