let validator = {
  //首页登录 验证码验证
  validateCode(rule, value, callback, sidentifyRequired) {
    if (!sidentifyRequired) {
      callback();
      return false;
    }

    if (this.identifyCode !== value) {
      callback(new Error(`${this.$t("common.qrcodeErr")}`));
    } else {
      callback();
    }
  },
  //SAP系统识别号验证
  sapCustomerCode(rule, value, callback) {
    // console.log(`${i18n.messages[i18n.vm.locale].common.loginStop}`);
    if (!value) {
      callback();
      return false;
    }
    const pattern = new RegExp(/^\d{10}$/);

    if (pattern.test(value)) {
      callback();
    } else {
      callback("您输入的值必须为10位的数字");
    }
  },
  //cc 成本中心验证
  cc(rule, value, callback) {
    if (!value) {
      callback();
      return false;
    }
    const pattern = new RegExp(/^\d{7}$/);

    if (pattern.test(value)) {
      callback();
    } else {
      callback("您输入的值必须为7位的数字");
    }
  },
  //cc 利润中心验证
  pc(rule, value, callback) {
    if (!value) {
      callback();
      return false;
    }
    const pattern = new RegExp(/^\d{8}$/);

    if (pattern.test(value)) {
      callback();
    } else {
      callback("您输入的值必须为8位的数字");
    }
  },
  //店铺编号验证
  storeNo(rule, value, callback) {
    if (!value) {
      callback();
      return false;
    }
    const pattern = new RegExp(/^\d{3,4}$/);


    if (pattern.test(value)) {
      callback();
    } else {
      callback("您输入的值必须为4位或3位的数字");
    }
  },
  //验证数字(含小数)
  checkNumber(rule, value, callback) {
    if (!value) {
      callback();
      return false;
    }
    const pattern = new RegExp(/^[0-9]*$/);
    const pattern2 = new RegExp(/^(([^0][0-9]+|0)\.([0-9]*))$/);
    if ((pattern.test(value) || pattern2.test(value))) {
      callback();
    } else {
      callback("您输入的值必须为数字");
    }
  },
  // 验证是否为整数
  checkNumberInt(rule, value, callback) {
    if (!value) {
      callback();
      return false;
    }
    const pattern = new RegExp(/^[0-9]*$/);
    if ((pattern.test(value))) {
      callback();
    } else {
      callback("您输入的值必须为数字");
    }
  },
  // 验证是否为邮箱
  checkEmail(rule, value, callback) {
    if (!value) {
      callback();
      return false;
    }
    const pattern = new RegExp(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/);
    if ((pattern.test(value))) {
      callback();
    } else {
      callback("您的邮箱账号错误，请检查");
    }
  },
  //验证数字是否小于100
  numberLessThan100(rule, value, callback) {
    if (!value) {
      callback();
      return false;
    }
    const pattern = new RegExp(/^[0-9]*$/);
    const pattern2 = new RegExp(/^(([^0][0-9]+|0)\.([0-9]*))$/);

    if ((pattern.test(value) || pattern2.test(value)) && parseInt(value) <= 100) {
      callback();
    } else {
      callback("您输入的值必须为小于100的数字");
    }
  },
  //验证微信号
  checkWXCode(rule, value, callback) {
    if (!value) {
      callback();
      return false;
    }
    const pattern = new RegExp(/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/);

    if (pattern.test(value)) {
      callback();
    } else {
      callback("可以使用6-20个子母、数字、下划线和减号;必须以字母开头（字母不区分大小写）;不能设置中文");
    }
  },

}


export default validator;


// module.exports = {
//   cc,
//   sapCustomerCode
// }
