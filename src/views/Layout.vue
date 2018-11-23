<template>
    <section class="layout-page">
        <div class="filter-nav">
            <router-view name="nav"></router-view>
        </div>
        <main>
            <header>
                <router-view name="header"></router-view>
            </header>
            <div class="center-content">
                <router-view></router-view>
            </div>
            <footer>
                <!-- <b-pagination :total="page.count"
                    :current="page.num"
                    @update:current="pageChanged"
                    order="is-centered"
                    :per-page="page.size">
                </b-pagination> -->
                <v-pagination v-model="page.num"
                    :length="Math.ceil(page.count / page.size)"
                    :total-visible="7"
                    @input="pageChanged"></v-pagination>
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
    width: 100%;
    display: flex;
    > .filter-nav {
        flex: 1 210px;
        // flex: 0;
        // width: 290px;
        margin: 7px 10px 0;
    }
    > main {
        flex: 5 500px;
        display: flex;
        flex-direction: column;
        margin: 0 10px;
        > header {
            flex: 0;
            margin: 7px 0;
            height: 10vh;
        }
        > .center-content {
            flex: 1 75vh;
            width: 100%;
            overflow: scroll;
        }
        > footer {
            flex: 0;
            margin: 7px 0;
            height: 10vh;
            text-align: center;
        }
    }
}
</style>
