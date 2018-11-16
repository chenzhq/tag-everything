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
        </main>
    </section>
</template>

<script>
export default {
    name: 'Layout',
    data() {
        return {
            // editModalVisible: false,
        };
    },
    methods: {},
};
</script>

<style lang="scss">
.layout-page {
    display: flex;
    > .filter-nav {
        flex: 0 300px;
        margin: 7px 10px 0;
    }
    > main {
        flex: 1 500px;
        display: flex;
        flex-direction: column;
        margin: 0 10px;
        > header {
            flex: 0 36px;
            margin: 7px 0;
        }
        > .container {
            flex: 1 500px;
            width: 100%;
        }
    }
}
</style>
