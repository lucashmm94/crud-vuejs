import Vue from 'vue'
import axios from 'axios'

Vue.use({
    install(){
        Vue.prototype.$http = Vue.prototype.$axios;
    }
});