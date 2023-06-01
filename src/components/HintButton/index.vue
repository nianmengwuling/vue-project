<template>
    <a :title="title" style="margin:10px">
        <!-- v-bind（不可简写为：）是接收父组件props
            v-on（不可简写为@）是接收父组件自定义事件 -->
        <el-button v-bind="$attrs" v-on="$listeners"></el-button>
    </a>
</template>

<script>
export default {
    name: 'HintButton',
    props: ['title']
}
</script>

<style></style>