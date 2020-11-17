<template>
	<div class="header">
		<el-row>
			<el-col :span="24" class="person-info-box">
				<img class="collaspe-btn" src="../assets/common/packUp@2x.png" @click="packUp" />
				<div class="doctor-name">欢迎您，{{getDocInfo.doctorName}}医生</div>
				<div class="setting-section">
					<ul class="setting-list">
						<li class="setting-li" v-for="(item,index) in settingList" :key="index" @click="clickSetting(index)">
							<el-badge v-if="index == 0 && msgNums > 0" :value="msgNums" :max="99" class="item">
								<div :title="item.name" class="icon-div">
									<img :src="item.icon" />
								</div>
							</el-badge>
							<div v-else :title="item.name" class="icon-div">
								<img :src="item.icon" />
							</div>
						</li>
					</ul>
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
	export default {
		name: 'Headers',
		computed: {
			...mapState(['isCollapse'])
		},
		data() {
			return {
				msgNums: 1, //消息数量
				getDocInfo: '', //医生信息
				settingList: [ //设置列表
					{
						"icon": require('../assets/common/messageicon@2x.png'),
						"name": "通知"
					},
					{
						"icon": require('../assets/common/accountsetting@2x.png'),
						"name": "设置"
					},
					{
						"icon": require('../assets/common/quit@2x.png'),
						"name": "退出"
					}
				],
			}
		},
		methods: {
			...mapMutations(["getIsCollapse"]),
			//展开/收起
			packUp() {
				this.getIsCollapse(!this.isCollapse)
			},
			//头部左上角事件
			clickSetting(idx) {
				switch (idx) {
					case 0:
						console.log('消息')
						break;
					case 1:
						console.log('设置')
						break;
					case 2:
						this.quit()
						break;

				}
			},
			quit() {
				
				 this.$confirm('确认退出登录吗?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
							this.api.loginout('').then(res => {
									console.log(res)
									this.$message({
									  type: 'success',
									  message: '退出成功!'
									});
									this.$router.push('/Login')
								})
								.catch(err => {
									console.log(err)
								})
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消退出登录'
				          });          
				        });
			},
		},
		created() {
			this.getDocInfo = JSON.parse(this.$cache.get('userInfo'))
		}
	}
</script>

<style lang="less">
	.person-info-box {
		display: flex;
		align-items: center;
		height: 72px;
	}

	.collaspe-btn {
		cursor: pointer;
		width: 21px;
		height: 17px;
	}

	.doctor-name {
		margin-left: 29px;
		font-size: 18px;
		font-weight: 400;
		color: #FFFFFF;
	}

	.setting-section {
		margin-left: auto;
	}

	.setting-list {
		display: flex;
		align-items: center;
	}

	.icon-div {
		cursor: pointer;
		width: 25px;
		height: 25px;
		padding: 0 20px;
		border-right: 1px solid #EAEAEAFF;
	}

	.icon-div>img {
		width: 100%;
		height: 100%;
	}

	.setting-list .setting-li:last-child .icon-div {
		border-right: none;
	}
</style>
<style lang="less">
	.el-container.is-vertical {
		flex-direction: row;
	}

	.el-badge__content.is-fixed {
		right: 35px !important;
	}
</style>
