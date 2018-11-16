import Vue from 'vue';
import Router from 'vue-router';

import Layout from '../views/Layout.vue';
import FilterNav from '../views/FilterNav.vue';
import FileTable from '../views/FileTable.vue';
import FileHeader from '../views/FileHeader.vue';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/main',
        },
        {
            path: '/main',
            // name: 'layout',
            component: Layout,
            children: [
                {
                    path: '',
                    name: 'file-page',
                    components: {
                        default: FileTable,
                        nav: FilterNav,
                        header: FileHeader,
                    },
                },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    next();
});

export default router;
