<!-- 添加/修改 SPU -->

<template>
    <div>
        <el-form ref="form" label-width="80px" :model="spu">

            <!-- SPU名称 -->
            <el-form-item label="SPU名称">
                <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
            </el-form-item>

            <!-- SPU品牌 -->
            <el-form-item label="品牌">
                <el-select placeholder="请选择品牌" v-model="spu.tmId">
                    <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in tradeMarkList"
                        :key="tm.id"></el-option>
                </el-select>
            </el-form-item>

            <!-- SPU描述  -->
            <el-form-item label="SPU描述">
                <el-input type="textarea" placeholder="请选择品牌" rows="4" v-model="spu.description"></el-input>
            </el-form-item>

            <!-- 照片墙 -->
            <el-form-item label="SPU图片">
                <el-upload action="/dev-api/admin/product/upload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList"
                    :on-success="handleSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
            </el-form-item>

            <!-- 销售属性 -->
            <el-form-item label="销售属性">
                <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
                    <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`"
                        v-for="(unselect, index) in unSelectSaleAttr" :key="unselect.id"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName"
                    @click="addSaleAttr">添加销售属性</el-button>
            </el-form-item>

            <!-- 表格，当前属于自己的销售属性 -->
            <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
                <el-table-column type="index" label="序号" width="80px" align="center">
                </el-table-column>

                <el-table-column prop="saleAttrName" label="属性名" width="width">
                </el-table-column>

                <!-- 动态编辑标签 -->
                <el-table-column prop="prop" label="属性值名称列表" width="width">
                    <!-- 这里解构的row，是el-table里:data="spu.spuSaleAttrList"的spuSaleAttrList，:data把数据传过来了 -->
                    <template slot-scope="{row,$index}">
                        <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable
                            :disable-transitions="false" @close="handleClose(row, index)">
                            {{ tag.saleAttrValueName }}
                        </el-tag>
                        <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput"
                            size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm(row)">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
                    </template>
                </el-table-column>

                <!-- 删除按钮 -->
                <el-table-column prop="prop" label="操作" width="width">
                    <template slot-scope="{row,$index}">
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="deleteSpuSaleAttrList(spu, $index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 取消和保存 -->
            <el-form-item>
                <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'SpuForm',
    data() {
        return {
            /* 缩略图数据 */
            dialogImageUrl: '',
            dialogVisible: false,//控制button和input切换,真为input写新的标签，假为button成为按钮
            /* 动态编辑标签 */
            inputVisible: false,//控制添加标签的input和button的显示隐藏
            inputValue: '',
            /* 下面四个，是存储了四个接口传过来的数据 */
            //添加存储SPU信息属性，给服务器的最终字段
            spu: {
                category3Id: 0,//三级分类ID，发请求接口时，服务器就已经赋值给了id
                description: '',//描述
                spuName: '',//spu名称
                tmId: '',///品牌ID
                spuImageList: [{

                    imgName: "",
                    imgUrl: "",

                }],//存储SPU图片的数据
                spuSaleAttrList: [/* {
                    baseSaleAttrId: 0,
                    id: 0,
                    saleAttrName: "string",
                    spuId: 0,
                    spuSaleAttrValueList: [
                        {
                            baseSaleAttrId: 0,
                            id: 0,
                            isChecked: "string",
                            saleAttrName: "string",
                            saleAttrValueName: "string",
                            spuId: 0
                        }
                    ], //平台属性与属性值收集
                } */]
            },
            tradeMarkList: [],//存储品牌信息
            spuImageList: [],//存储SPU图片的数据，这个是本身有的图片。后面自己添加的新图，也在这里，但是传不到spu对象里，所以要映射进去
            saleAttrList: [],//销售属性的数据
            attrIdAndAttrName: '',//收集未选择的销售属性
        }
    },
    methods: {
        /* 删除缩略图时触发 */
        handleRemove(file, fileList) {
            /*  file：删除的图地址名字, fileList：所有图的地址名字 */
            /* 删除时更新列表保存 */
            this.spuImageList = fileList;
        },
        /* 预览缩略图时触发 */
        handlePictureCardPreview(file) {
            /* dialogImageUrl是图片地址 */
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        /* 照片墙上传成功时，更新列表 */
        handleSuccess(response, file, fileList) {
            //response:上传的图返回是否成功，以及它的数据, file：上传的图地址名字, fileList：所有图的地址名字
            this.spuImageList = fileList;
        },

        /* 初始化spuForm数据,相当于持续获得数据，不用一次次刷新。让父组件得到子组件的方法 */
        async initSpuData(spu) {
            // console.log('发请求',spu)
            //获取SPU信息的数据
            let spuResult = await this.$API.spu.reqSpu(spu.id)
            // console.log(spuResult) 查看数据类型为对象
            if (spuResult.code == 200) {
                this.spu = spuResult.data
            }
            //获取品牌的信息
            let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
            // console.log(tradeMarkResult)  查看数据类型为数组
            if (tradeMarkResult.code == 200) {
                this.tradeMarkList = tradeMarkResult.data
            }
            //获取spu图片的数据
            let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
            // console.log(spuImageResult)
            if (spuImageResult.code == 200) {
                /* 照片墙展示图片是以数组形式，数组元素需要name和url字段 */
                let listArr = spuImageResult.data
                listArr.forEach(item => {
                    item.name = item.imgName
                    item.url = item.imgUrl
                });
                this.spuImageList = listArr
            }
            //获取平台全部的销售属性
            let saleResult = await this.$API.spu.reqBaseSaleAttrList()
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data
            }
        },

        /* 动态编辑标签四个 */
        /* 删除一行属性索引 */
        deleteSpuSaleAttrList(spu, $index) {
            /* $index是这一行属性的索引顺序，这一行属性又在spuSaleAttrList列表里 */
            spu.spuSaleAttrList.splice($index, 1)
        },
        /* 点击删除标签时触发 */
        handleClose(row, index) {
            /* row是销售属性，即spuSaleAttrList   index是这一行标签的索引顺序，这一行索引又在spuSaleAttrValueList列表里 */
            row.spuSaleAttrValueList.splice(index, 1);
        },
        /* 显示与隐藏框 */
        showInput(row) {
            /* 只有在data对象上存在的属性，才会是响应式，即视图同步更新。$set可以添加为响应式 */
            this.$set(row, 'inputVisible', true);//控制button和input切换,真为input写新的标签，假为button成为按钮
            this.$set(row, 'inputValue', '')//收集新增属性值
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        /* 添加新标签 */
        handleInputConfirm(row) {
            /* 添加标签的内容和顺序，解构出来。inputValue是标签的内容，baseSaleAttrId是标签的顺序序号 */
            const { baseSaleAttrId, inputValue } = row;
            /* 去空 */
            if (inputValue.trim() == '') {
                this.$message('属性不能为空')
                return
            }
            /* 去重。saleAttrValueName就是spuSaleAttrValueList的标签内容 */
            /* every返回结果为false，就会停止继续运行，并带来false和之前的数据。result出结果时，也带了false。！result意思是如果是真，那就说不能重复，实际上重复了 */
            let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
            if (!result) {
                this.$message('属性不能重复')
                return
            }
            /* 新增的属性 */
            let newSaleAttrValue = { baseSaleAttrId: baseSaleAttrId, saleAttrValueName: inputValue }
            /* 把新增的加入到spuSaleAttrValueList里 */
            row.spuSaleAttrValueList.push(newSaleAttrValue)
            row.inputVisible = false;
            this.inputValue = '';
        },

        /* 添加新的销售属性 */
        addSaleAttr() {
            /* 收集来的数据是字符串，`${unselect.name}:${unselect.id}`的形式，需要分割、解构 */
            /*  由unSelectSaleAttr计算而来，实际上是saleAttrList里的数据，即baseSaleAttrId和saleAttrName。也不用计较从哪来，只要知道新增属性的具体需要即可 */
            /* 数组有顺序，按顺序解构。对象是无序的，所以·需要baseSaleAttrId属性名即号码。split后就成了数组 */
            const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
            let newSaleArr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
            /* 添加新的销售属性，扔到spuSaleAttrList里，因为这里是展示销售属性的地方，就能看到我们新加的销售属性 */
            this.spu.spuSaleAttrList.push(newSaleArr)
            /* 清空数据，防止下次添加还出现。这个是配合计算属性中筛选销售属性完成的。attrIdAndAttrName是没被选择的属性集合 */
            this.attrIdAndAttrName = ''
        },
        /* 保存按钮的回调 */
        async addOrUpdateSpu() {
            /* 整理照片墙数据，再把数据交给spu里面的spuImageList，因为spu是最终要给服务器的对象 */
            this.spu.spuImageList = this.spuImageList.map(item => {
                return {
                    /* 获取spu图片的数据接口里，定义了新增图的名字和地址格式。新图都有response，本身自有的图没有response */
                    imgName: item.name,
                    imgUrl: item.response ? item.response.data : item.url,
                }
            });
            /* 发请求，把spu对象给服务器 */
            let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
            if (result.code == 200) {
                this.$message({ type: 'success', message: '保存成功' });
                /* 回到场景0 ，父组件里触发changeScene方法，方法里写了更新列表*/
                /* 有id说明是修改，反之添加。为了让父组件知悉进而操作 */
                this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
            };
            /* 清理数据，防止取消后，数据残留列表里 */
            //Object.assign是合并对象函数,this._data是所有响应式data数据，this.$options是配置对象。配置对象的data函数执行返回空对象，因为重置数据初始化（data一开始就是空的）
            Object.assign(this._data, this.$options.data())
        },
        /* 点击取消按钮的回调 */
        cancel() {
            /* 通知父组件，切换场景为0 */
            this.$emit('changeScene', { scene: 0, flag: '' });
            /* 清理数据，防止取消后，数据残留列表里 */
            //Object.assign是合并对象函数,this._data是所有响应式data数据，this.$options是配置对象。配置对象的data函数执行返回空对象，因为重置数据初始化（data一开始就是空的）
            Object.assign(this._data, this.$options.data())
        },
        /* 点击添加SPU按钮时回调，添加新的SPU时，需要有品牌信息和销售属性 */
        async addSpuData(category3Id) {
            /* 接收父组件传过来的三级分类Id */
            this.spu.category3Id = category3Id;
            /* 获取品牌信息 */
            let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
            if (tradeMarkResult.code == 200) {
                this.tradeMarkList = tradeMarkResult.data
            };
            //获取平台全部的销售属性
            let saleResult = await this.$API.spu.reqBaseSaleAttrList()
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data
            };
        }
    },
    computed: {
        /* 筛选销售属性 */
        unSelectSaleAttr() {
            //filter会拿每一个数组里item元素对比，保留return为真的那些
            let result = this.saleAttrList.filter((item) => {
                // every会返回即return 真和假，这个和上面的就对应上了
                return this.spu.spuSaleAttrList.every((item1) => {
                    return item.name != item1.saleAttrName
                })
            })
            return result
        }
    }
}
</script>

<style>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>