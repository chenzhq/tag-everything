<template>
    <section>
        <!-- <file-list :list="fileList"></file-list> -->
        <v-data-table v-model="checkedRows"
            :headers="headers"
            :items="fileList"
            item-key="path"
            select-all
            hide-actions
            class="elevation-1">
            <template slot="headers"
                slot-scope="props">
                <tr :class="$style.tableHeadRow">
                    <th>
                        <v-checkbox :input-value="props.all"
                            :indeterminate="props.indeterminate"
                            primary
                            hide-details
                            @change="toggleAll"></v-checkbox>
                    </th>
                    <th>
                        名称
                    </th>
                    <th>
                        标签
                    </th>
                    <th>大小</th>
                </tr>
            </template>
            <template slot="items"
                slot-scope="props">
                <tr :class="$style.tableBodyRow">
                    <td>
                        <v-checkbox v-model="props.selected"
                            primary
                            hide-details></v-checkbox>
                    </td>
                    <td>{{ props.item.name }}</td>
                    <td>
                        <v-chip label
                            small
                            v-for="(tag, index) in props.item.tags"
                            :key="index">
                            {{ tag }}
                        </v-chip>
                    </td>
                    <td>{{ props.item.size }}</td>
                </tr>
            </template>
        </v-data-table>
        <b-modal :active.sync="singleFileModalVisible">
            <single-file-edit :selected-file="selectedFile"
                @success="fileEditSuccess"></single-file-edit>
        </b-modal>
    </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import SingleFileEdit from '@/components/SingleFileEdit';
// import FileList from '@/components/FileList';

import { CHECK_FILES } from '@/store/mutation-types';

export default {
    name: 'FileTable',
    components: { SingleFileEdit },
    data() {
        return {
            // checkedRows: [],
            singleFileModalVisible: false,
            selectedIndex: -1,
            selected: [],
            headers: [
                {
                    text: '名称',
                    align: 'center',
                    value: 'name',
                },
                {
                    text: '大小',
                    align: 'center',
                    value: 'size',
                },
            ],
            columns: [
                {
                    field: 'name',
                    title: '名称',
                    width: 200,
                    titleAlign: 'center',
                    columnAlign: 'left',
                    isFrozen: true,
                    ieResize: true,
                    overflowTitle: true,
                },
                {
                    field: 'size',
                    title: '大小',
                    width: 150,
                    titleAlign: 'center',
                    columnAlign: 'center',
                },
                {
                    field: 'tags',
                    title: '标签',
                    width: 200,
                    titleAlign: 'center',
                    columnAlign: 'left',
                    componentName: 'TagCell',
                },
                {
                    field: 'ext',
                    title: 'Ext',
                    width: 100,
                    titleAlign: 'center',
                    columnAlign: 'center',
                },
                {
                    field: '',
                    title: '操作',
                    width: 100,
                    titleAlign: 'center',
                    columnAlign: 'center',
                },
            ],
        };
    },
    computed: {
        checkedRows: {
            get() {
                return this.checkedFiles;
            },
            set(value) {
                this.checkFiles({ files: value });
            },
        },
        checkedRowIds() {
            return this.checkedFiles.map((file) => file._id);
        },
        selectedFile() {
            if (this.selectedIndex === -1) {
                return {};
            }
            return this.fileList[this.selectedIndex];
        },
        ...mapState({
            checkedFiles: (state) => state.checkedFiles,
            fileList: (state) => state.fileList,
            // page: (state) => state.page,
        }),
    },
    methods: {
        refreshCheckedRows(selectedRow, row) {
            return this.checkedRowIds.includes(row._id);
        },
        edit({ row, index }) {
            this.selectedIndex = index;
            this.singleFileModalVisible = true;
        },
        fileEditSuccess() {
            this.singleFileModalVisible = false;
            this.selectedIndex = -1;
            this.reloadFile();
            this.reloadTag();
        },
        toggleAll() {
            /* eslint-disable */
            console.log(this.checkedRows);
            /* eslint-enable */

            if (this.checkedRows.length) this.checkedRows = [];
            else this.checkedRows = this.fileList.slice();
        },
        ...mapMutations({
            checkFiles: CHECK_FILES,
        }),
        ...mapActions({
            reloadFile: 'loadDataByPage',
            reloadTag: 'getTags',
        }),
    },
};
</script>

<style lang="scss" module>
.item {
    display: flex;
    align-items: center;
    position: relative;
    font-size: 14px;
    padding: 10px 0;
    border-bottom: none !important;
    color: #202124;
    td:nth-of-type(1),
    th:nth-of-type(1) {
        flex: 0 55px;
    }
    td:nth-of-type(2),
    th:nth-of-type(2) {
        flex: 2 200px;
    }
    td:nth-of-type(3),
    th:nth-of-type(3) {
        flex: 2 200px;
    }
    td:nth-of-type(4),
    th:nth-of-type(4) {
        flex: 1 100px;
    }
}
.tableHeadRow {
    @extend .item;
}
.tableBodyRow {
    @extend .item;
    background: rgba(242, 245, 245, 0.8);
    box-shadow: inset 0 -1px 0 0 rgba(100, 121, 143, 0.122);
    cursor: pointer;
    &:hover {
        background: rgba(242, 245, 245, 0.8) !important;
        box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60, 64, 67, 0.3),
            0 1px 3px 1px rgba(60, 64, 67, 0.15);
        z-index: 1;
    }
}
.row {
    display: flex;
    align-items: center;
    position: relative;
    font-size: 14px;
    padding: 10px 0;
    border-bottom: none !important;
    background: rgba(242, 245, 245, 0.8);
    color: #202124;
    cursor: pointer;
    box-shadow: inset 0 -1px 0 0 rgba(100, 121, 143, 0.122);
    z-index: 1;
    &:hover {
        background: rgba(242, 245, 245, 0.8) !important;
        box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60, 64, 67, 0.3),
            0 1px 3px 1px rgba(60, 64, 67, 0.15);
        z-index: 2;
    }
    td:nth-of-type(1),
    th:nth-of-type(1) {
        flex: 0 55px;
    }
    td:nth-of-type(2),
    th:nth-of-type(2) {
        flex: 2 200px;
    }
    td:nth-of-type(3),
    th:nth-of-type(3) {
        flex: 1 100px;
    }
}
</style>
