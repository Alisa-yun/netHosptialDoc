<template>
  <div id="app">
    <router-view v-if="routerView"/>
  </div>
</template>
<script>
	export default{
		name:'App',
		provide(){
			return {
				reload:this.reload
			}
		},
		data() {
			return {
				routerView: true
			}
		},
		methods:{
			reload(){
				this.routerView = false
				this.$nextTick(function(){
					this.routerView = true
				})
			}
		},
		mounted() {
		}
	}
</script>
<style lang="less">
	*,body,p,div,ul,li,ol{
		margin: 0;
		padding: 0;
	}
	ul,ol{
		list-style: none;
	}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
