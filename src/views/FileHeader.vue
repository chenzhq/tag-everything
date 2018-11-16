<template>
    <div class="level">
        <div class="level-left">
            <div class="level-item">
                <button class="button"
                    @click="editModalVisible = true">编辑</button>
            </div>
        </div>
        <div class="level-right">
            <div class="level-item">
                <!-- <button class="button is-black"
                                @click="openDialog">打开窗口</button> -->
                <b-dropdown :mobile-modal="false"
                    position="is-bottom-left">
                    <button class="button is-primary"
                        slot="trigger">
                        <span>添加</span>
                        <b-icon icon="menu-down"></b-icon>
                    </button>
                    <b-dropdown-item value="dir"
                        @click="addMode('dir')">添加文件夹</b-dropdown-item>
                    <b-dropdown-item value="file"
                        @click="addMode('file')">添加文件</b-dropdown-item>
                </b-dropdown>
            </div>
        </div>
        <b-modal :active.sync="editModalVisible">
            <file-edit @finish="editModalVisible = false"></file-edit>
        </b-modal>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');
import FileEdit from '../components/FileEdit';

export default {
    name: 'FileHeader',
    components: { FileEdit },
    data() {
        return {
            editModalVisible: false,
        };
    },
    methods: {
        addMode(value) {
            if (value === 'dir') {
                ipcRenderer.send('open-dialog', { type: 'dir' });
            } else if (value === 'file') {
                ipcRenderer.send('open-dialog', { type: 'file' });
            }
        },
    },
};
</script>

<style>
</style>
