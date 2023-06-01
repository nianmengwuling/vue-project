<template>
    <div>
        <el-card style="margin:20px 0px">
            <!-- 三级联动 -->
            <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
        </el-card>
        <el-card>
            <!--0:展示SPU列表  -->
            <div v-show="scene == 0">
                <!-- 添加SPU按钮 -->
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
                <!-- SPU列表结构 -->
                <el-table style="width: 100%" border :data="records">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="spuName" label="SPU名称" width="width">
                    </el-table-column>
                    <el-table-column prop="description" label="SPU描述" width="width">
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <!-- 列表后四个按钮，对列表数据的操作 -->
                        <template slot-scope="{ row, $index }">
                            <!-- 这里按钮将来用HintButton替换,鼠标掠过显示信息按钮 -->
                            <Hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku"
                                @click="addSku(row)"></Hint-button>

                            <Hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu"
                                @click="updateSpu(row)"></Hint-button>

                            <Hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"
                                @click="handler(row)"></Hint-button>


                            <!-- 气泡确认框 -->
                            <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                                <Hint-button type="danger" icon="el-icon-delete" slot="reference" size="mini"
                                    title="删除spu"></Hint-button>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器  @size-change="" -->
                <el-pagination style="text-align: center" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit"
                    layout="prev, pager, next, jumper,->, sizes,total" :total="total" @current-change="getSpuList"
                    @size-change="handleSizeChange"></el-pagination>
            </div>
            <!--1：添加/修改 SPU， changeScene是绑定了自定义事件-->
            <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
            <!--2：添加SKU -->
            <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"></SkuForm>
        </el-card>
        <!-- 对话框 -->
        <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="closeDialog">
            <el-table :data="skuList" style="width:100%" border v-loading="loading">
                <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
                <el-table-column prop="price" label="价格" width="width"></el-table-column>
                <el-table-column prop="weight" label="重量" width="width"></el-table-column>
                <el-table-column label="默认图片">
                    <template slot-scope="{row,$index}">
                        <img :src="row.skuDefaultImg" style="width:100px;height:100px">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
import { denodeify } from 'q';
export default {
    name: 'Spu',
    components: { SkuForm, SpuForm },
    data() {
        return {
            //存储id将来需要发请求的时候用
            category1Id: "",
            category2Id: "",
            category3Id: "",
            //接受平台属性的数据
            attrList: [],
            /* 三级联动数据 */
            page: 1,
            limit: 3,
            records: [],//spu列表数据
            total: 0,
            /* 0:展示SPU列表；1：添加/修改 SPU；2：添加SKU */
            scene: 0,
            dialogTableVisible: false,//点击查看当前spu全部sku列表，是否显示隐藏
            spu: {},//保存对话框信息
            skuList: [],//存储sku列表数据,应用于对话框显示的数据
            loading: true,//加载图片有loading效果
        }
    },
    methods: {
        //三级联动的自定义事件，可以把子组件的相应的id传递给父组件
        getCategoryId({ categoryId, level }) {
            //categoryId:获取到一、二、三级分类的id  level：为了区分是几级id
            if (level == 1) {
                this.category1Id = categoryId;
                //清除2、3级分类的id
                this.category2Id = "";
                this.category3Id = "";
            } else if (level == 2) {
                this.category2Id = categoryId;
                //清除3级id
                this.category3Id = "";
            } else {
                this.category3Id = categoryId;
                //获取SPU列表数据进行展示
                this.getSpuList();
            }
        },
        //获取SPU列表数据的方法，分页器点击更新页码，在data里page默认是第一页
        async getSpuList(pages = 1) {
            this.page = pages
            //解构我们需要的数据
            const { page, limit, category3Id } = this
            //携带三个参数:page 第几页  limit 每一页需要展示多少条数据  三级分类id
            const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
            // console.log(result)
            if (result.code == 200) {//把数据放到组件data中
                this.total = result.data.total
                this.records = result.data.records
            }
        },
        //当分页器的某一个展示数据条数发生变化的回调
        handleSizeChange(limit) {
            // console.log(limit)
            //修改参数
            this.limit = limit
            //再次发请求
            this.getSpuList()
        },
        /* 添加SPU按钮的回调，改变显示图层 */
        addSpu() {
            this.scene = 1;
            /* 通知子组件SpuForm发请求,把category3Id也传过去 */
            this.$refs.spu.addSpuData(this.category3Id)
        },
        /* 修改SPU按钮的回调，跳到图层1，即添加/修改 SPU 组件 */
        updateSpu(row) {
            this.scene = 1;
            /* 获取子组件方法，相当于按一次按钮，就发一次请求获得数据，不用一次次刷新网页 */
            this.$refs.spu.initSpuData(row)
        },
        /* 子组件传来的自定义事件 */
        changeScene({ scene, flag }) {
            /* 把scene为0 传了过来，切换成图层1 */
            this.scene = scene;
            if (flag == '修改') {
                //获取SPU列表数据进行展示,子组件更新了数据，又通过自定义事件切换图层，那么父组件也要更新列表保持同步
                /* 修改,就停留在当前页。 */
                this.getSpuList(this.page);
            } else {
                /* 默认回第一页,因为是写了getSpuList(pages = 1)。默认更新列表就去第一页导致 */
                this.getSpuList()
            }
        },
        /* 删除Spu */
        async deleteSpu(row) {
            let result = await this.$API.spu.reqDeleteSpu(row.id);
            console.log(row);
            if (result.code == 200) {
                this.$message({ type: 'success', message: '删除成功' });
                /* 定义了每页3个数据，spu列表数据的长度小于1就到上一页；大于1，就留在当前页 */
                this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
            }
        },
        /* 添加SKU */
        addSku(row) {
            /* 切换到场景2 */
            this.scene = 2;
            /* 调用子组件方法 */
            this.$refs.sku.getData(this.category1Id, this.category2Id, row)
        },
        /* 子传父自定义事件，改变按了取消按钮后，子组件用了this.$emit('changeScenes', 0)，所以场景为0 */
        changeScenes(scene) {
            this.scene = scene;
        },
        /* 点击查看当前spu全部sku列表 */
        async handler(row) {
            this.dialogTableVisible = true;
            /* 保存信息 */
            this.spu = row;
            let result = await this.$API.spu.reqSkuList(row.id);
            if (result.code == 200) {
                this.skuList = result.data;
                /* 让图片loading效果隐藏 */
                this.loading = false;
            }
        },
        /* 关闭对话框时事件 */
        closeDialog(done) {
            this.loading = true;//loading效果还原为真
            this.skuList = '';//清除列表数据，防止打开下一个有残留
            done();///关闭对话框
        },
    },

}
</script>

<style></style>