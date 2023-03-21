import Vue from 'vue'
import AppComponent from './App/App.vue'

Vue.component('app-component', AppComponent)

Vue({
  el: '#app',
  render: (createElement) => {
    return createElement(AppComponent)
  }
})
