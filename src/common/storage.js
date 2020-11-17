/**
 * title ：缓存函数
 * * date ： 2020-09-25
 * author : alisa
 */
var storage = {
  // 永久保留在浏览器中，除非手动删除或调用remove/clear
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  get(key) { return JSON.parse(localStorage.getItem(key)); },
  remove(key) { localStorage.removeItem(key) },
  clear() { localStorage.clear(); },
  // 当前会话连接时保留，浏览器关闭即被销毁或调用sessionRemove/sessionClear
  sessionSet(key, value) { sessionStorage.setItem(key, JSON.stringify(value)); },
  sessionGet(key) { return JSON.parse(sessionStorage.getItem(key)); },
  sessionRemove(key) { sessionStorage.removeItem(key) },
  sessionClear() { sessionStorage.clear(); },
};

export default storage;
