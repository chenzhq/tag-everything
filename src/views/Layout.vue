<template>
    <section class="layout-page">
        <div class="filter-nav container">
            <router-view name="nav"></router-view>
        </div>
        <main>
            <header>
                <router-view name="header"></router-view>
            </header>
            <div class="container">
                <router-view></router-view>
            </div>
            <footer>
                <b-pagination :total="page.count"
                    :current="page.num"
                    @update:current="pageChanged"
                    order="is-centered"
                    :per-page="page.size">
                </b-pagination>
            </footer>
        </main>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Layout',
    data() {
        return {
            // editModalVisible: false,
        };
    },
    computed: {
        ...mapState({
            page: (state) => state.page,
        }),
    },
    methods: {
        pageChanged(value) {
            this.reload({ pageNum: value, clearCheck: false }).then(() => {
                this.checkedFiles({ files: [] });
                this.checkedFiles({ files: this.checkedRows });
            });
        },
        ...mapActions({
            reload: 'loadDataByPage',
        }),
    },
};
</script>

<style lang="scss">
.layout-page {
    display: flex;
    > .filter-nav {
        flex: 1 3 210px;
        margin: 7px 10px 0;
    }
    > main {
        flex: 5 1 500px;
        display: flex;
        flex-direction: column;
        margin: 0 10px;
        > header {
            flex: 0;
            margin: 7px 0;
            height: 7vh;
        }
        > .container {
            flex: 1 80vh;
            width: 100%;
            overflow: scroll;
        }
        > footer {
            flex: 0;
            margin: 7px 0;
            height: 7vh;
        }
    }
}
</style>
