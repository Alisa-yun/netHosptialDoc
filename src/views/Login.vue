<template>
	<div>
		<el-row>
			<el-col :span="24">
				<div class="login">
					<div class="login-section">
						<div class="login-logo-img-section">
							<div class="login-name">{{title}}</div>
							<div class="login-en-name">{{enTitle}}</div>
						</div>
						<div class="rule-forms-box">
							<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm ruleForms">
								<div class="account-pwd-login">账号密码登录</div>
								<div class="form-items-section">
									<el-form-item label="" prop="name">
										<img class="login-icon" src="../assets/login/username@2x.png" />
										<el-input type="text" v-model="ruleForm.name" @change="nameIpt" placeholder="请输入用户名..."></el-input>
									</el-form-item>
									<el-form-item label="" prop="pwd" class="pwd-section">
										<img class="login-icon" src="../assets/login/pwd@2x.png" />
										<el-input :type="password" v-model="ruleForm.pwd" @change="pwdIpt" placeholder="请输入密码..."></el-input>
										<img @click="pwdEyesEvent" v-if="pwdEyes" class="pwd-icon" src="../assets/login/closeyes@2x.png" />
										<img v-else @click="pwdEyesEvent" class="pwd-icon" src="../assets/login/openeyes.png" />
									</el-form-item>
									<el-form-item class="checkbox-section">
										<el-checkbox @change="checkedBoxChange" v-model="checked">记住账户</el-checkbox>
									</el-form-item>
									<el-form-item>
										<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
									</el-form-item>
								</div>
							</el-form>
						<div class="copyright-box">版权所属 ©{{copyright}}</div>
						</div>
					</div>
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
		name: 'login',
		computed: {
			...mapState(["clickedSecondItem"])
		},
		data() {
			return {
				copyright: '运营管理平台',
				password: 'password',
				pwdEyes: true,
				checked: false,
				title: "医生工作站",
				enTitle: 'DOCTOR WORKSTATION',
				ruleForm: {
					name: '',
					pwd: ''
				},
				rules: {
					name: [{
						required: true,
						message: '请输入用户名称',
						trigger: 'blur'
					}],
					pwd: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 4,
							message: '至少输入4个字符',
							trigger: 'blur'
						}
					],
				}
			}
		},
		methods: {
			...mapMutations(['getUserInfo','getClickedSecondItem']),
			// 账号改变
			nameIpt(e){
				this.ruleForm.name = e
			},
			//密码改变
			pwdIpt(e){
				this.ruleForm.pwd = e
			},
			//密码眼睛
			pwdEyesEvent() {
				let that = this
				that.pwdEyes = !that.pwdEyes
				if (that.pwdEyes == true) {
					that.password = 'password'
				} else {
					that.password = 'text'
				}
			},
			//记住账户
			checkedBoxChange() {
				let that = this
				this.$cache.set('username', '')
				this.$cache.set('pwd','')
				if (that.checked == true) {
					this.$cache.set('username', that.ruleForm.name)
					this.$cache.set('pwd', that.ruleForm.pwd)
				} else {
					this.$cache.remove('username')
					this.$cache.remove('pwd')
				}
			},
			//提交
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.login()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			login() {
				var loginInfo = {
					"doctorAccount": this.ruleForm.name,
					"doctorPassword": this.ruleForm.pwd
				}
				console.log(this.ruleForm.name)
				console.log(this.ruleForm.pwd)
				this.api.thirdLogin(loginInfo).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.getUserSig()
						this.$message({
							type: "success",
							message: res.message
						})
						this.$cache.set('username', this.ruleForm.name)
						this.$cache.set('pwd', this.ruleForm.pwd)
						this.$cache.set('userInfo',JSON.stringify(res.data))
						this.$cache.set('userID',res.data.userId)
						this.$cache.set('doctorId',res.data.doctorId)
						this.getClickedSecondItem('')
						this.$router.push('/Home')
					} else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
			getUserSig(){
				this.api.getUserSig({}).then(res=>{
					console.log(res)
					if(res.code == 0){
						this.$cache.set('userSig',res.data)
						this.$cache.set('sdkAppID',1400393555)
					}else {
						this.$message({
							type: "warning",
							message: res.message
						})
					}
				})
			},
		},
		created() {
			var that = this;
			document.onkeydown = function(e) {
				var key = window.event.keyCode;
				if (key == 13) {
					that.submitForm('ruleForm');
				}
			}
			//先判断是否有缓存
			console.log(this.$cache.get('username'))
			console.log(this.$cache.get('pwd'))
			let name = !this.$cache.get('username') ? '' : this.$cache.get('username')
			let pwd = !this.$cache.get('pwd') ? '' : this.$cache.get('pwd')
			if (name && name != '') {
				that.ruleForm.name = name
				that.ruleForm.pwd = pwd
				that.checked = true
			}
			// this.changeDetailState(false)
			// this.getOneItem('挂号订单')
		}
	}
</script>


<style>
	.ruleForms .el-form-item {
		position: relative;
		width: 288px !important;
	}

	.ruleForms .el-form-item .el-input__inner {
		padding-left: 31px !important;
	}

	.ruleForms .el-button--primary {
		width: 100% !important;
	}

	.ruleForms .el-form-item .el-form-item__content {
		margin-left: 0 !important;
	}

	.login {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 2;
		width: 100%;
		height: 100%;
		background: url('../assets/login/login.png') no-repeat;
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-section {
		width: 575px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.logo-img-section {
		width: 83px;
		height: 83px;
	}

	.login-name {
		font-size: 40px;
		font-weight: 500;
		color: #FFFFFF;
	}

	.login-en-name {
		margin-top: 3px;
		font-size: 20px;
		font-weight: 500;
		color: #FFFFFF;
	}

	.rule-forms-box {
		margin-top: 30px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 15px 20px;
		background: rgba(255, 255, 255, 0.22);
		box-shadow: 0px 0px 21px 0px #FFFFFF;
		border-radius: 10px;
		border: 1px solid #0245A0;
	}

	.ruleForms {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 30px 100px;
		background: #FFFFFF;
		border-radius: 10px;
	}

	.account-pwd-login {
		font-size: 18px;
		font-weight: 500;
		color: #1890FF;
		line-height: 25px;
	}

	.form-items-section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 43px;
	}

	.pwd-section {
		margin-top: 9px;
	}
.ruleForms .el-form-item__content{
	display: flex;
	align-items: center;
}
	.login-icon {
		position: absolute;
		/* top: 11px; */
		left: 12px;
		width: 15px;
		height: 17px;
		z-index: 9;
	}

	.pwd-icon {
		position: absolute;
		/* top: 11px; */
		right: 12px;
		width: 22px;
		height: 16px;
		z-index: 9;
	}

	.checkbox-section {
		margin-top: -10px;
		text-align: left;
	}
	.copyright-box {
		margin-top: 17px;
		font-size: 14px;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 22px;
	}
</style>
