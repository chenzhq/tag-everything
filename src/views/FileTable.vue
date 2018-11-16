<template>
    <section>
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
            </template>
            <template slot="footer">
                <b-pagination :total="page.count"
                    :current="page.num"
                    @update:current="pageChanged"
                    order="is-centered"
                    :per-page="page.size">
                </b-pagination>
            </template>
        </b-table>
    </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import { CHECK_FILES } from '@/store/mutation-types';

export default {
    name: 'FileTable',
    data() {
        return {
            // checkedRows: [],
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
        ...mapState({
            checkedFiles: (state) => state.checkedFiles,
            fileList: (state) => state.fileList,
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
        refreshCheckedRows(selectedRow, row) {
            return this.checkedRowIds.includes(row._id);
        },
        ...mapMutations({
            checkFiles: CHECK_FILES,
        }),
        ...mapActions({
            reload: 'loadDataByPage',
        }),
    },
};
</script>

<style>
</style>
