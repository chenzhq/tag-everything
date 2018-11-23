<template>
    <section class="box">
        <b-field label="名称">
            <b-input v-model="formData.name"></b-input>
        </b-field>
        <b-field label="标签">
            <b-taginput v-model="formData.tags"
                :data="filteredTags"
                autocomplete
                allow-new
                icon="label"
                placeholder="添加标签..."
                @typing="getFilteredTags"></b-taginput>
        </b-field>
        <button class="button is-primary"
            @click="submit">确认</button>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'SingleFileEdit',
    props: {
        // id: String,
        // name: String,
        // tags: Array,
        // path: String,
        selectedFile: Object,
    },
    data() {
        return {
            formData: {
                name: this.selectedFile.name,
                tags: this.selectedFile.tags.slice(0),
            },
            filteredTags: [],
        };
    },
    computed: {
        ...mapState({
            allTagNames: (state) => state.tagList.map((tag) => tag.name),
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
            this.modifySingleFileTag({ id: this.selectedFile._id, tagNames: this.formData.tags })
                .then(() => {
                    if (this.selectedFile.name !== this.formData.name) {
                        return this.modifyFileName({
                            path: this.selectedFile.path,
                            newName: this.formData.name,
                        });
                    }
                })
                .then(() => {
                    this.$toast.open('修改成功');
                    this.$emit('success');
                });
        },
        ...mapActions({
            modifyFileName: 'modifyFileName',
            modifySingleFileTag: 'modifySingleFileTag',
        }),
    },
};
</script>

<style>
</style>
