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
        name: String,
        tags: Array,
    },
    data() {
        return {
            formData: {
                name: this.name,
                tags: this.tags,
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
        submit() {},
    },
};
</script>

<style>
</style>
