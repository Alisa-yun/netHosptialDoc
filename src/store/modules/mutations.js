import state from './state.js'
import getter from './getter.js'
import {Message} from 'element-ui'
const mutations = {
	getTimChatHeight(state,obj){
		state.timChatHeight = obj
	},
	getMenuItem(state,obj){
		state.menuItem = obj
	},
	getClickedSecondItem(state,obj){
		state.clickedSecondItem = obj
	},
	getIsCollapse(state,obj){
		state.isCollapse = obj
	},
	getConsultType(state,obj){
		state.consultType = obj
	},
	getRoomType(state,obj){
		state.roomType = obj
	},
	getRoomNumsObj(state,obj){
		state.roomNumsObj = obj
	},
	getOnlineState(state,obj){
		state.onlineState = obj
	},
	getLoginOut(state,obj){
		state.loginOut = obj
	},
	/****
	TIM TRTC
	****/
	getUpdateConversationList(state,obj){
		state.updateConversationList = obj
	},
	showDrawerChange(state,obj){
		state.showDrawers = obj
	},
	getIsReload(state,obj){
		state.isReload = obj
	},
	getReloadDetail(state,obj){
		state.reloadDetail = obj
	},
	getIsRecieveConsult(state,obj){
		state.isRecieveConsult = obj
	},
	getHisMsgLists(state,obj){
		state.hisMsgLists = obj
	}
}
export default mutations