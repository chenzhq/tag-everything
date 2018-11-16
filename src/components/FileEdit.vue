<template>
    <section>
        <b-taginput v-model="tags"
            :data="filteredTags"
            autocomplete
            allow-new
            icon="label"
            placeholder="添加标签..."
            @typing="getFilteredTags"></b-taginput>
        <button class="button"
            :disabled="tags.length === 0"
            @click="submit">提交</button>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    name: 'FileEdit',
    data() {
        return {
            tags: [],
            filteredTags: [],
        };
    },
    computed: {
        ...mapState({
            allTagNames: (state) => state.tagList.map((tag) => tag.name),
            checkedFilesIds: (state) => state.checkedFiles.map((file) => file._id),
        }),
    },
    methods: {
        getFilteredTags(text) {
            if (!text) return [];
            this.filteredTags = this.allTagNames.filter((name) => {
                return (
                    name
                        .toString()
                        .toLowerCase()
                        .indexOf(text.toLowerCase()) >= 0
                );
            });
        },
        submit() {
            this.modifyFiles({
                ids: this.checkedFilesIds,
                tagNames: this.tags,
            })
                .then(() => {
                    this.reloadFiles();
                    this.reloadTags();
                })
                .then(() => {
                    this.$emit('finish');
                });
        },
        ...mapActions({
            modifyFiles: 'modifyFiles',
            reloadFiles: 'loadDataByPage',
            reloadTags: 'getTags',
        }),
    },
};
</script>

<style>
</style>
