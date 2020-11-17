import Vue from 'vue'
import Vuex from 'vuex'
import state from './modules/state.js'
import mutations from './modules/mutations.js'
import actions from './modules/actions.js'
import getter from './modules/getter.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: state,
  getter:getter,
  mutations: mutations,
  actions:actions
})
