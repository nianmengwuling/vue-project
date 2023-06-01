<template>
    <div>
        <el-card style="margin:20px 0px;">
            <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="isShowTable">
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
                <!-- 表格:展示平台属性 -->
                <el-table style="width:100%" border :data="attrList">
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
                    <el-table-column prop="prop" label="属性值列表" width="width">
                        <template slot-scope="{row,$index}">
                            <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id"
                                style="margin:0px 20px">{{ attrValue.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="150">
                        <template slot-scope="{row, $index}">
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加属性|修改属性的结构 -->
            <div v-show="!isShowTable">
                <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <!-- :disabled="!attrInfo.attrName"当有属性名的时候,按钮才可以用 -->
                <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
                    :disabled="!attrInfo.attrName">添加属性值</el-button>
                <el-button @click="isShowTable = true">取消</el-button>
                <el-table style="width:100%;margin:20px 0px" border :data="attrInfo.attrValueList">
                    <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
                    <el-table-column prop="prop" label="属性值名称" width="width">
                        <template slot-scope="{row,$index}">
                            <!-- 
                    这里的结构需要用到span和input进行来回的切换 
                    @blur="" 鼠标离开隐藏input显示span
                    @click="" 点击span显示input隐藏span  
                    @keyup.native.enter="" input按回车显示span,隐藏input
                    修饰符enter只能用于DOM事件,这里利用native来让他在这里可用
                    style="display:block"因为是span为了点击方便,我们把他转为块级元素,让点击范围大一些
                  -->
                            <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag"
                                @blur="toLook(row)" @keyup.native.enter="toLook(row)" v-focus>
                            </el-input>
                            <span v-else @click="row.flag = true" style="display:block">{{ row.valueName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <!-- 气泡确认框 -->
                            <el-popconfirm :title="`你确定要删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference">删除</el-button>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="addOrUpdateAttr"
                    :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
                <el-button @click="isShowTable = true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>
   
<script>
//按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'Attr',
    data() {
        return {
            //存储id将来需要发请求的时候用
            category1Id: "",
            category2Id: "",
            category3Id: "",
            //接受平台属性的数据
            attrList: [],
            //这个属性控制table表格显示与隐藏
            isShowTable: true,
            //收集新增属性|修改属性使用的
            attrInfo: {
                attrName: "", //属性名
                attrValueList: [
                    //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
                    // {  这块由点击事件来添加
                    //   attrId:0,//相应的属性名id
                    //   valueName:'',
                    // }
                ],
                categoryId: 0, //三级分类的id
                categoryLevel: 3, //因为服务器也需要区分几级id
            },
        }
    },
    methods: {
        //自定义事件的回调
        getCategoryId({ categoryId, level }) {
            //区分三级分类相应的id，以及父组件进行存储
            if (level == 1) {//当重选一级分类的时候,2-3级分类的id需要清空
                this.category1Id = categoryId;
                this.category2Id = "";
                this.category3Id = "";
            } else if (level == 2) {//当重选二级分类的时候,3级分类的id需要清空
                this.category2Id = categoryId;
                this.category3Id = "";
            } else {
                //代表三级分类的id有了
                this.category3Id = categoryId;
                //发请求获取平台的属性数据
                this.getAttrList();
            }
        },
        //获取平台属性的数据
        //当用户确定三级分类的数据时候，可以向服务器发请求获取平台属性进行展示
        async getAttrList() {
            //获取分类的ID
            const { category1Id, category2Id, category3Id } = this;
            //获取属性列表的数据
            let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id);
            // console.log(result)
            if (result.code == 200) {
                this.attrList = result.data;
            }
        },
        //添加属性值得回调 (也可是修改按钮里面添加)
        addAttrValue() {
            //向属性值的数组里面添加元素
            //attrId：是你相应的属性的id，目前而言我们是添加属性的操作，还没有相应的属性的id，目前而言带给服务器的id为undefined
            //valueName:相应的属性值的名称
            this.attrInfo.attrValueList.push({
                attrId: this.attrInfo.id, //对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
                valueName: '',
                flag: true //控制每一个新增的属性值的显示与隐藏的标记,用于切换查看模式与编辑模式,好处是每一个属性值可以控制自己的属性切换,当前的flag是一个响应式属性(数据变化视图跟着变化),因为这里的数组attrInfo、attrValueList是都在data中声明了,在data中声明的数据都是响应式数据,而且这里的数组是push进来的,数组的检查可以通过替换和变更,push是变更,所以flag是响应式的,vue底层可以检测到flag
            })
        },
        //添加属性按钮的回调
        addAttr() {
            //切换table显示与隐藏
            this.isShowTable = false;
            //清除数据
            //收集三级分类的id
            this.attrInfo = {
                attrName: "", //属性名
                attrValueList: [
                    //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
                ],
                categoryId: this.category3Id, //三级分类的id
                categoryLevel: 3, //因为服务器也需要区分几级id
            };
        },
        //修改某一个属性
        updateAttr(row) {
            //console.log(row)//row里面就是我们要修改的数据
            //isShowTable变为false
            this.isShowTable = false
            //将选中的属性赋值给attrInfo
            //由于数据结构当中存在对象里面套数组，数组里面有套对象，因此需要使用深拷贝解决这类问题
            //深拷贝，浅拷贝在面试的时候出现频率很高，切记达到手写深拷贝与浅拷贝
            this.attrInfo = cloneDeep(row)
            //在修改某一个属性的时候,将相应的属性值元素添加上flag这个标记
            this.attrInfo.attrValueList.forEach(item => {
                //这样书写也可以给属性值添加flag属性,但是会发现视图不会跟着变化(因为flag不是响应式数据)item.flag = false
                //因为 Vue 无法探测普通的新增 property,这样书写的属性并非响应式属性(数据变化视图跟着变)
                //第一个参数:对象  第二个参数:添加新的响应式属性  第三参数：新的属性的属性值
                this.$set(item, 'flag', false)
            })
        },
        //失去焦点以及回车的事件---切换为查看模式,展示span
        toLook(row) {
            //如果属性值为空不能作为新的属性值,需要给用户提示,让他输入一个新的属性值
            //Trim是String型数据的一个方法，作用是去掉字符串开头和结尾的空格，比如说字符串a="____a__"，其中_表示一个空格，那么a.Trim() = "a"，字符串前后的空格都被清掉了。调用这个方法后，a的值是不变的，也就是说，虽然a.Trim() = "a"，但a="____a__"还是成立的。
            if (row.valueName.trim() == '') {
                this.$message('请你输入一个正常的属性值')//提示
                return
            }
            //新增的属性值不能与已有的属性值重复
            let isRepat = this.attrInfo.attrValueList.some(item => {//item是数组中每一个属性值
                //需要将row从数组里面判断的时候去除
                //row是最新新增的属性值[数组的最后一项元素]
                //判断的时候,需要把已有的数组当中新增的这个属性值去除
                if (row !== item) {//row!==item,那么走这个if的就是排除了row最新的属性值的情况
                    return row.valueName == item.valueName
                }
            })
            //console.log(isRepat)//出现重复为true,否则为false
            if (isRepat) return  //如果出现重复的,直接return,不执行后面代码
            //row:形参是当前用户添加的最新的属性值
            //当前的编辑模式变为查看模式[让input消失,显示span]
            row.flag = false
        },
        /* 气泡确认框操作 */
        deleteAttrValue(index) {
            this.attrInfo.attrValueList.splice(index, 1)
        },
        /* 保存按钮 */
        async addOrUpdateAttr() {
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
                //过滤掉属性值不是空的
                if (item.valueName != '') {
                    //删除掉flag属性
                    delete item.flag;
                    return true;
                }
            });
            try {
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
                //展示平台属性的信号量进行切换
                this.isShowTable = true;
                //提示消失
                this.$message({ type: 'success', message: '保存成功' });
                //保存成功以后需要再次获取平台属性进行展示
                this.getAttrList();
            } catch (error) {

            }
        }
    },
}
</script>
   
<style scoped></style>