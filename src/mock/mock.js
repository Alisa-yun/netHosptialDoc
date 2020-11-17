var Mock = require('mockjs')
let menuList = {
	"data":[
		{
			'id':'1',
			"name":'问诊工作台',
			"icon":'',
			'submenu': [{
				'id': '1',
				'name': '挂号订单',
				'url': '/order/AppointOrder'
			}]
		},
		{
			'id':'2',
			"name":'查看排班',
			"icon":'',
			'submenu': [{
				'id': '1',
				'name': '挂号订单',
				'url': '/order/AppointOrder'
			}]
		},
		{
			'id':'3',
			"name":'患者评价',
			"icon":'',
			'submenu': [{
				'id': '1',
				'name': '挂号订单',
				'url': '/order/AppointOrder'
			}]
		},
		{
			'id':'4',
			"name":'账号设置',
			"icon":'',
			'submenu': [{
				'id': '1',
				'name': '挂号订单',
				'url': '/order/AppointOrder'
			}]
		},
	]
}
Mock.mock('http://192.168.7.46:8080/menu',menuList)
Mock.setup({
    timeout: '200-600'
})