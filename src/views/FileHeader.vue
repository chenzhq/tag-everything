<template>
    <div :class="$style.container">
        <div>
            <v-btn @click="editModalVisible = true">编辑</v-btn>
        </div>
        <div :class="$style.addBtn">
            <v-menu attach
                offset-y
                left>
                <v-btn slot="activator"
                    color="primary"
                    dark>
                    添加
                </v-btn>
                <v-list>
                    <v-list-tile @click="addMode('dir')">
                        <v-list-tile-title>添加文件夹</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="addMode('file')">
                        <v-list-tile-title>添加文件</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="addMode('traverseFile')">
                        <v-list-tile-title>遍历文件</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </div>
        <v-dialog v-model="editModalVisible"
            width="400">
            <file-edit @finish="editModalVisible = false"></file-edit>
        </v-dialog>
        <v-dialog v-model="addOptionModalVisible"
            width="500">
            <add-option></add-option>
        </v-dialog>
        <!-- <b-modal :active.sync="editModalVisible"
            :width="400">
            <file-edit @finish="editModalVisible = false"></file-edit>
        </b-modal> -->
        <!-- <b-modal :active.sync="addOptionModalVisible"
            :width="500">
            <add-option></add-option>
        </b-modal> -->
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');
import FileEdit from '../components/FileEdit';
import AddOption from '../components/AddOption';

export default {
    name: 'FileHeader',
    components: { FileEdit, AddOption },
    data() {
        return {
            editModalVisible: false,
            addOptionModalVisible: false,
        };
    },
    methods: {
        addMode(value) {
            if (value === 'dir') {
                ipcRenderer.send('open-dialog', { type: 'dir' });
            } else if (value === 'file') {
                ipcRenderer.send('open-dialog', { type: 'file' });
            } else if (value === 'traverseFile') {
                this.addOptionModalVisible = true;
            }
        },
    },
};
</script>

<style lang="scss" module>
.container {
    display: flex;

    .addBtn {
        margin-left: auto;
    }
}
</style>
