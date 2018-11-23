<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');
import { mapActions } from 'vuex';
export default {
    name: 'app',
    data() {
        return {};
    },
    created() {
        ipcRenderer.on('done', (event, arg) => {
            this.addFiles(arg)
                .then(() => {
                    this.reload();
                    this.getTags();
                })
                .catch((err) => {
                    this.$toast.open(err);
                });
        });
        this.reload();
        this.getTags();
    },
    methods: {
        ...mapActions({
            reload: 'loadDataByPage',
            getTags: 'getTags',
            addFiles: 'addFiles',
        }),
    },
};
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

// Import Bulma's core
// @import '~bulma/sass/utilities/_all';

// // Set your colors
// $primary: #8c67ef;
// $primary-invert: findColorInvert($primary);
// $twitter: #4099ff;
// $twitter-invert: findColorInvert($twitter);

// // $body-size: 14px !default;

// // Setup $colors to use as bulma classes (e.g. 'is-twitter')
// $colors: (
//     'white': (
//         $white,
//         $black,
//     ),
//     'black': (
//         $black,
//         $white,
//     ),
//     'light': (
//         $light,
//         $light-invert,
//     ),
//     'dark': (
//         $dark,
//         $dark-invert,
//     ),
//     'primary': (
//         $primary,
//         $primary-invert,
//     ),
//     'info': (
//         $info,
//         $info-invert,
//     ),
//     'success': (
//         $success,
//         $success-invert,
//     ),
//     'warning': (
//         $warning,
//         $warning-invert,
//     ),
//     'danger': (
//         $danger,
//         $danger-invert,
//     ),
//     'twitter': (
//         $twitter,
//         $twitter-invert,
//     ),
// );

// // Links
// $link: $primary;
// $link-invert: $primary-invert;
// $link-focus-border: $primary;

// // Import Bulma and Buefy styles
// @import '~bulma';
// @import '~buefy/src/scss/buefy';

table.v-table {
    thead {
        tr {
            height: inherit !important;
        }
    }
    tbody {
        td,
        th {
            height: inherit !important;
        }
    }
}
</style>
