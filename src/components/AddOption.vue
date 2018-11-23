<template>
    <section class="box add-option">
        <b-field horizontal
            label="类型"
            class="file-type-field">
            <b-checkbox :indeterminate="true">所有</b-checkbox>
            <b-checkbox v-model="fileType"
                native-value="video">视频</b-checkbox>
            <b-checkbox v-model="fileType"
                native-value="image">图片</b-checkbox>
            <b-checkbox v-model="fileType"
                native-value="doc">文档</b-checkbox>
            <b-checkbox v-model="fileType"
                native-value="audio">音频</b-checkbox>
            <b-checkbox v-model="fileType"
                native-value="app">应用程序</b-checkbox>
            <b-checkbox v-model="fileType"
                native-value="zip">压缩文档</b-checkbox>
        </b-field>
        <footer>
            <button class="button is-primary">
                确认
            </button>
        </footer>

    </section>
</template>

<script>
export default {
    name: 'AddOption',
    props: {},
    data() {
        return {
            fileType: [],
        };
    },
    methods: {
        selectAllType() {
            if (this.fileType.length !== 6) {
                this.fileType = ['video', 'image', 'doc', 'audio', 'app', 'zip'];
            } else {
                this.fileType = [];
            }
        },
    },
};
</script>

<style lang="scss">
.add-option {
    .file-type-field {
        .field-body {
            flex-wrap: wrap;
            > .field:nth-of-type(1) {
                // 所有
                width: 100%;
            }
        }
    }
    footer {
        text-align: center;
    }
}
</style>
