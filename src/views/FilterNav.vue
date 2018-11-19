<template>
    <nav>
        <b-collapse class="card">
            <div slot="trigger"
                slot-scope="props"
                class="card-header">
                <p class="card-header-title">标签</p>
                <a class="card-header-icon">
                    <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
                    </b-icon>
                </a>
            </div>
            <div class="card-content">
                <div class="content">
                    <b-taginput v-model="tags"
                        :data="filteredTags"
                        type="is-black"
                        autocomplete
                        icon="label"
                        placeholder="选择标签..."
                        @typing="getFilteredTags"
                        @input="tagInput">
                    </b-taginput>
                    <b-taglist :class="$style.tagList">
                        <b-tag v-for="(name, index) in allTagNames"
                            :key="index"
                            :type="tags.includes(name) ? 'is-light' : 'is-black'"
                            :closable="tags.includes(name)"
                            class="filter-tag"
                            @click.native="tagClick(name)">
                            {{ name }}
                        </b-tag>
                    </b-taglist>
                </div>
            </div>
        </b-collapse>
    </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    name: 'FilterNav',
    data() {
        return {
            tags: [],
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
            this.filteredTags = this.allTagNames.filter((name) => {
                return (
                    name
                        .toString()
                        .toLowerCase()
                        .indexOf(text.toLowerCase()) >= 0
                );
            });
        },
        tagInput() {
            this.searchByTags({ tags: this.tags });
        },
        // tagRemoved() {
        //     this.searchByTags({ tags: this.tags });
        // },
        tagClick(name) {
            const index = this.tags.findIndex((tag) => tag === name);
            if (index > -1) {
                this.tags.splice(index, 1);
            } else {
                this.tags.push(name);
            }
            this.tagInput();
        },
        ...mapActions({
            searchByTags: 'loadDataByPage',
        }),
    },
};
</script>

<style lang="scss">
.filter-tag {
    cursor: pointer;
}
</style>
<style lang="scss" module>
.tagList {
    margin-top: 10px;
}
</style>
