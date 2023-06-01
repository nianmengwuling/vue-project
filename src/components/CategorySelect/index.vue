<template>
    <div>
        <el-form :inline="true" class="demo-form-inline" :model="cForm">
            <el-form-item label="一级分类">
                <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
                    <el-option :label="c1.name" :value="c1.id" v-for="(c1, index) in list1" :key="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
                    <el-option :label="c2.name" :value="c2.id" v-for="(c2, index) in list2" :key="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
                    <el-option :label="c3.name" :value="c3.id" v-for="(c3, index) in list3" :key="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "CategorySelect",
    props:['show'],
    data() {
        return {
            /* 一级分类数据 */
            list1: [],
            /* 二级分类数据 */
            list2: [],
            /* 三级分类数据 */
            list3: [],

            /*el-form的model,收集一级二级三级分类的Id，即下面category的id */
            cForm: {
                category1Id: "",
                category2Id: "",
                category3Id: "",
            }
        }
    },
    //组件挂载完毕：向服务器发请求，获取相应的一级分类的数据
    mounted() {
        //获取一级分类的数据的方法
        this.getCategory1List();
    },
    methods: {
        //获取一级分类数据的方法
        async getCategory1List() {
            //获取一级分类的请求：不需要携带参数
            let result = await this.$API.attr.reqCategory1List();
            if (result.code == 200) {
                this.list1 = result.data
            }
        },
        /* 点击一级分类触发回调，获取二级分类数据 */
        async handler1() {
            /* 清除数据，防止去点1时，2和3数据不变 */
            this.list2 = [];
            this.list3 = [];
            this.cForm.category2Id = '';
            this.cForm.category3Id = '';
            /* 解构出一级分类的ID，从保存一级id的cForm那里 */
            const { category1Id } = this.cForm;
            //把id传给父组件Attr
            this.$emit('getCategoryId', {categoryId:category1Id,level:1});

            let result = await this.$API.attr.reqCategory2List(category1Id);
            if (result.code == 200) {
                this.list2 = result.data
            }
        },
        /* 点击二级分类触发回调，获取三级分类数据 */
        async handler2() {
            /* 清除数据，防止去点2时，3数据不变 */
            this.list3 = [];
            this.cForm.category3Id = '';
            //结构出数据
            const { category2Id } = this.cForm;
            //把id传给父组件Attr
            this.$emit('getCategoryId', {categoryId:category2Id,level:2});

            let result = await this.$API.attr.reqCategory3List(category2Id);
            if (result.code == 200) {
                this.list3 = result.data;
            }
        },
        /* 三级分类事件的回调 */
        handler3() {
            //结构出数据
            const { category3Id } = this.cForm;
            //把id传给父组件Attr
            this.$emit('getCategoryId',{categoryId:category3Id,level:3})
        }
    }
};
</script>

<style></style>