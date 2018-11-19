<template>
    <section>
        <!-- <v-table is-horizontal-resize
            style="width: 100%"
            :columns="columns"
            :table-data="fileList"
            row-hover-color="#eee"
            row-click-color="#edf7ff"></v-table> -->
        <b-table :data="fileList"
            checkable
            hoverable
            :checked-rows.sync="checkedRows"
            :custom-is-checked="refreshCheckedRows">
            <template slot-scope="props">
                <b-table-column field="name"
                    label="名称"
                    width="100"
                    centered>
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="size"
                    label="大小"
                    width="100"
                    centered>
                    {{ props.row.size }}
                </b-table-column>
                <b-table-column field="tags"
                    width="200"
                    label="标签">
                    <b-taglist>
                        <b-tag v-for="(name, index) in props.row.tags"
                            :key="index">
                            {{ name }}
                        </b-tag>
                    </b-taglist>
                </b-table-column>
                <b-table-column field="ext"
                    label="Ext"
                    width="100"
                    centered>
                    {{ props.row.ext }}
                </b-table-column>
                <b-table-column label="操作"
                    width="150"
                    centered>
                    <div class="buttons">
                        <b-icon custom-size="mdi-18px"
                            icon="pencil"
                            type="is-info"
                            @click.native="edit(props)"></b-icon>
                        <b-icon custom-size="mdi-18px"
                            icon="delete"
                            type="is-danger"></b-icon>
                    </div>

                </b-table-column>
            </template>
        </b-table>
        <b-modal :active.sync="singleFileModalVisible">
            <single-file-edit :name="selectedFile.name"
                :tags="selectedFile.tags"></single-file-edit>
        </b-modal>
    </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import SingleFileEdit from '@/components/SingleFileEdit';

import { CHECK_FILES } from '@/store/mutation-types';

export default {
    name: 'FileTable',
    components: { SingleFileEdit },
    data() {
        return {
            // checkedRows: [],
            singleFileModalVisible: false,
            selectedIndex: -1,
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
            /* eslint-disable */
            console.log(row);
            /* eslint-enable */
            this.selectedIndex = index;
            this.singleFileModalVisible = true;
        },
        ...mapMutations({
            checkFiles: CHECK_FILES,
        }),
    },
};
</script>

<style>
</style>
