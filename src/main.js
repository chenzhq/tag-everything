import Vue from 'vue';
import App from './App.vue';
import Buefy from 'buefy';
// import 'buefy/dist/buefy.css';
import 'element-ui/lib/theme-chalk/index.css';
// import ElementUI from 'element-ui';
import 'vuetify/dist/vuetify.min.css';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

// Vue.use(ElementUI);

Vue.component('TagCell', {
    render(h) {
        return h(
            'BTaglist',
            {},
            this.rowData.tags.map((tag, i) =>
                h(
                    'BTag',
                    {
                        key: i,
                    },
                    [tag]
                )
            )
        );
    },
    props: {
        rowData: Object,
        field: String,
        index: Number,
    },
});

import store from './store/index';
import router from './route/router';

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: (h) => h(App),
}).$mount('#app');
