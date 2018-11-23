<template>
    <ul :class="$style.list">
        <li :class="$style.item"
            v-for="(item, index) in list"
            :key="index">
            <div :class="$style.checkField">
                <b-checkbox></b-checkbox>
            </div>
            <div>{{ item.name }}</div>
            <div :class="$style.tagField">
                <b-taglist>
                    <b-tag v-for="(name, index) in item.tags"
                        :key="index">
                        {{ name }}
                    </b-tag>
                </b-taglist>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'FileList',
    props: {
        list: Array,
    },
};
</script>

<style lang="scss" module>
.list {
}
.item {
    display: flex;
    position: relative;
    font-size: 14px;
    padding: 10px 0;
    background: rgba(242, 245, 245, 0.8);
    color: #202124;
    cursor: pointer;
    box-shadow: inset 0 -1px 0 0 rgba(100, 121, 143, 0.122);
    &:hover {
        box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0, 0 1px 2px 0 rgba(60, 64, 67, 0.3),
            0 1px 3px 1px rgba(60, 64, 67, 0.15);
        z-index: 1;
    }
    .checkField {
        padding: 0 10px 0 14px;
    }
    .tagField {
        flex: 1;
    }
}
</style>
