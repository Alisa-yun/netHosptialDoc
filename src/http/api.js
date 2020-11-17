/** 
 * api接口统一管理
 */
import {
	get,
	post,
	getForm,
	postForm,
	uploadExcelFile,
	exportExcelFile,
	exportExcelFileW,
	getMap
} from './http'
/**
 * 
 * 登录
 * **/
const thirdLogin = p => post('doctor/login', p);//登录
const loginout = p => get('doctor/logout', p);//退出登录
/**
 * 问诊工作台
 * */
const getTodoCount = p => get('home/getTodoCount',p);//待处理数量计算
const getTotal = p => get('home/getTotal',p);//咨询/问诊总量
const medicalOrderStatistics = p => post('home/medicalOrderStatistics',p);//订单统计查询
//图文咨询
const waitingRoomList = p => post('consult/waitingRoomList',p);//候诊室列表
const consultDetail = p => post('consult/consultDetail',p);//咨询问诊详情
const workList = p => post('consult/workList',p);//我的诊室（就诊室）列表
const completeList = p => post('consult/completeList',p);//已完成 列表
const withdrawalList = p => post('consult/withdrawalList',p);//已退诊列表
const startService = p => post('consult/startService',p);//是否接诊
const withdrawalService = p => post('consult/withdrawalService',p);//退诊
const completeService = p => post('consult/completeService',p);//结束服务
//网络问诊
const WaitingList = p => post('inquiry/WaitingList',p);//待就诊）列表
const inquiryWaitingRoomList = p => post('inquiry/waitingRoomList',p);//候诊室列表
const inquiryDetail = p => post('inquiry/inquiryDetail',p);//咨询问诊详情
const inquiryWorkList = p => post('inquiry/workList',p);//我的诊室（就诊室）列表
const inquiryCompleteList = p => post('inquiry/completeList',p);//已完成 列表
const inquiryWithdrawalList = p => post('inquiry/withdrawalList',p);//已退诊列表
const inquiryStartService = p => post('inquiry/startService',p);//接诊
const inquiryWithdrawalService = p => post('inquiry/withdrawalService',p);//退诊
const inquiryCompleteService = p => post('inquiry/completeService',p);//结束服务
/***
获取UserSig 
**/
const getUserSig = p => get('doctor/getUserSig',p);//获取UserSig 
/**
 * 上下线
 * **/
 const editWorkState = p => post('doctor/editWorkState',p);//上下线
 /***
 我的排班
 **/
 const consultScheduling = p => post('scheduling/consultScheduling',p);//图文咨询
 const inquiryScheduling = p => post('scheduling/inquiryScheduling',p);//网络问诊
/****
快捷回复
*****/
const getQuickReply = p => postForm('quickReply/get',p);//获取快捷回复
const addQuickReply = p => post('quickReply/add',p);//添加快捷回复
const editQuickReply = p => post('quickReply/edit',p);//编辑快捷回复
const delQuickReply = p => post('quickReply/delete',p);//删除快捷回复

export default {
	//登录
	thirdLogin,
	//退出登录
	loginout,
	getUserSig,
	//待处理数量计算
	getTodoCount,
	getTotal,
	medicalOrderStatistics,
	//图文咨询
	waitingRoomList,
	consultDetail,
	workList,
	completeList,
	withdrawalList,
	startService,
	withdrawalService,
	completeService,
	//网络问诊
	WaitingList,
	inquiryWaitingRoomList,
	inquiryDetail,
	inquiryWorkList,
	inquiryCompleteList,
	inquiryWithdrawalList,
	inquiryStartService,
	inquiryWithdrawalService,
	inquiryCompleteService,
	//快捷回复
	getQuickReply,
	addQuickReply,
	editQuickReply,
	delQuickReply,
	//上线线
	editWorkState,
	// 我的排班
	consultScheduling,
	inquiryScheduling
	

}
