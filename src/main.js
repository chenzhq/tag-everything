import Vue from 'vue';
import App from './App.vue';
import Buefy from 'buefy';
// import 'buefy/dist/buefy.css';

import store from './store/index';
import router from './route/router';

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: (h) => h(App),
}).$mount('#app');
