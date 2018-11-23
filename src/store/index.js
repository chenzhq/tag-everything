import Vue from 'vue';
import Vuex from 'vuex';
import {
    ADD_FILES,
    MODIFY_FILES,
    DELETE_FILES,
    FETCH_TAGS,
    FETCH_FILES,
    ADD_TAG,
    INCREASE_TAG_COUNT,
    CHANGE_PAGE,
    CHECK_FILES,
} from './mutation-types';
import {
    getFiles,
    getTags,
    insertTag,
    insertTags,
    updateTag,
    updateFileTags,
    insertFiles,
    deleteFilesByIds,
    addMultiTags,
    updateFileName,
} from '@/database/db';
import { ADD_TAGS } from './mutation-types';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        /**
         * { id, name, count }
         */
        tagList: [],
        fileList: [],
        page: {
            count: 0,
            num: 1,
            size: 30,
        },
        checkedFiles: [],
    },
    getters: {
        // 所有的标签名称 []
        tagNames({ tagList }) {
            return tagList.map((tag) => tag.name);
        },
        isTagIncluded: (state, getters) => (tagName) => {
            return getters.tagNames.includes(tagName);
        },
        skipAndLimit({ page }) {
            return {
                skip: (page.num - 1) * page.size,
                limit: page.size,
            };
        },
    },
    mutations: {
        [FETCH_FILES](state, { files, count }) {
            state.fileList = files;
            state.page.count = count;
        },
        [FETCH_TAGS](state, { tags }) {
            state.tagList = tags;
        },
        /**
         * 添加文件 要么没有tags 要么统一tags
         * fileList [] { name, path, tags, times, }
         */
        [ADD_FILES]({ fileList }, files) {
            fileList.concat(files);
        },
        [ADD_TAG]({ tagList }, { id, name, count = 1 }) {
            tagList.push({ id, name, count });
        },
        [ADD_TAGS]({ tagList }, tags) {
            tagList.concat(tags);
        },
        [INCREASE_TAG_COUNT]({ tagList }, { name, increment }) {
            const theTag = tagList.find((tag) => tag.name === name);
            theTag.conut = theTag.count + increment;
        },
        [CHANGE_PAGE](state, { page }) {
            state.page.num = page;
        },
        [CHECK_FILES](state, { files }) {
            state.checkedFiles = files;
        },
        [MODIFY_FILES](state, { ids, tagNames }) {},
    },
    actions: {
        loadDataByPage(
            { state, getters, commit },
            { pageNum, clearCheck = true, tags } = { clearCheck: true }
        ) {
            if (!pageNum) pageNum = state.page.num;
            if (pageNum !== state.page.num) commit(CHANGE_PAGE, { page: pageNum });
            if (clearCheck) {
                commit(CHECK_FILES, { files: [] });
            }
            getFiles(getters.skipAndLimit, { tags }).then(({ docs: files, count }) => {
                commit(FETCH_FILES, { files, count });
            });
        },

        getTags({ commit }) {
            return getTags().then((tags) => {
                commit(FETCH_TAGS, { tags });
            });
        },
        /**
         * 添加标签
         * 重复标签用索引剔除
         * @param {*} param0
         * @param {tagNames [name]} param1 标签名数组
         */
        addTags({ commit }, { tagNames }) {
            return insertTags(tagNames.map((name) => ({ name }))).then((tags) => {
                commit(ADD_TAGS, tags);
            });
        },
        // updateTag({ commit }, { tagName, increment }) {
        //     updateTag({ tagName, increment }).then((updateNum) => {
        //         commit(INCREASE_TAG_COUNT, { name: tagName, increment });
        //     });
        // },
        /**
         * 1. 向数据库中插入所有文件
         * 2. 返回成功插入的文件，（使用索引）过滤重复文件
         * --3. commit ADD_FILES
         * 4. 提取出这些文件中包含的tag，此处认为在同一次添加文件时，要么没有tag，要么是一样的tag
         * 5. 区分这些tags中，哪些是新tag，哪些是已有的
         * 6. 新tag: dispatch addTags
         * 7. 已有的tag: commit INCREASE_TAG_COUNT
         * @param {*} param0
         * @param {*} files 检索到的文件列表
         */
        addFiles({ getters, commit, dispatch }, files) {
            /* eslint-disable */
            console.log('add files', files);
            /* eslint-enable */

            return insertFiles(files).then((insertedFiles) => {
                const fileCount = insertedFiles.length;
                if (fileCount === 0) return;

                const tagsInFile = insertedFiles[0].tags;
                if (tagsInFile.length === 0) return;
                // const existedTags = tagsInFile.filter((tag) => getters.isTagIncluded(tag));
                const newTags = tagsInFile.filter((tag) => !getters.isTagIncluded(tag));

                // existedTags.forEach((tagName) => {
                //     dispatch('updateTag', { tagName, increment });
                //     commit(INCREASE_TAG_COUNT, { name: tagName, increment: fileCount });
                // });
                dispatch('addTags', { tagNames: newTags });
            });
        },
        deleteFiles({}, fileIds) {
            deleteFilesByIds(fileIds).then((removedNum) => {});
        },
        /**
         * 多文件 增加标签
         * 修改文件完成后，添加标签
         * @param {*} param0
         * @param {ids[], tagNames[]} param1
         */
        addMultiTags({ dispatch }, { ids, tagNames }) {
            return addMultiTags(ids, tagNames).then((num) => {
                return dispatch('addTags', { tagNames });
            });
        },
        modifySingleFileTag({ dispatch }, { id, tagNames }) {
            return updateFileTags(id, tagNames).then(() => {
                return dispatch('addTags', { tagNames });
            });
        },
        modifyFileName({}, { path, newName }) {
            return updateFileName(path, newName);
        },
    },
});
