<template>
    <section class="box">
        <v-combobox v-model="tags"
            :filter="filter"
            :hide-no-data="!search"
            :items="allTagNames"
            :search-input.sync="search"
            hide-selected
            label="添加标签..."
            multiple
            small-chips
            solo>
            <template slot="no-data">
                <v-list-tile>
                    <span class="subheading">Create</span>
                    <v-chip label
                        small>
                        {{ search }}
                    </v-chip>
                </v-list-tile>
            </template>
            <template v-if="item === Object(item)"
                slot="selection"
                slot-scope="{ item, parent, selected }">
                <v-chip :selected="selected"
                    label
                    small>
                    <span class="pr-2">
                        {{ item }}
                    </span>
                    <v-icon small
                        @click="parent.selectItem(item)">close</v-icon>
                </v-chip>
            </template>
            <template slot="item"
                slot-scope="{ index, item, parent }">
                <v-list-tile-content>
                    <v-chip dark
                        label
                        small>
                        {{ item }}
                    </v-chip>
                </v-list-tile-content>
                <v-spacer></v-spacer>
            </template>
        </v-combobox>
        <v-btn :disabled="tags.length === 0"
            @click="submit">提交</v-btn>
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
            search: '',
        };
    },
    computed: {
        ...mapState({
            allTagNames: (state) => state.tagList.map((tag) => tag.name),
            checkedFilesIds: (state) => state.checkedFiles.map((file) => file._id),
        }),
    },
    methods: {
        filter(item, queryText, itemText) {
            /* eslint-disable */
            console.log(item, queryText, itemText);
            /* eslint-enable */

            if (item.header) return false;

            const hasValue = (val) => (val != null ? val : '');

            const text = hasValue(itemText);
            const query = hasValue(queryText);

            return (
                text
                    .toString()
                    .toLowerCase()
                    .indexOf(query.toString().toLowerCase()) > -1
            );
        },
        submit() {
            this.addMultiTags({
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
            addMultiTags: 'addMultiTags',
            reloadFiles: 'loadDataByPage',
            reloadTags: 'getTags',
        }),
    },
};
</script>

<style>
</style>
