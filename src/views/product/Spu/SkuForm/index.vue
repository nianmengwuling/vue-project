<!-- 添加SKU -->

<template>
  <div>
    <el-form label-width="80px">
      <!-- SPU名称 -->
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <!-- SKU名称 -->
      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <!-- 价格 -->
      <el-form-item label="价格(元)">
        <el-input placeholder="请输入价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <!-- 重量 -->
      <el-form-item label="重量（千克）">
        <el-input placeholder="请输入重量（千克）" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <!-- 规格描述 -->
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="请输入规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <!-- 平台属性 -->
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr, index) in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr, index) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 图片列表 -->
      <el-form-item label="图片列表">
        <!-- 表格 -->
        <el-table border style="width:100%" :data="spuImageList" @selection-change="handleSelectionChange">

          <!-- 选择框 -->
          <el-table-column type="selection" prop="prop" label="" width="80px"></el-table-column>
          <!-- 图片 -->
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <!-- 名称 -->
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <!-- 操作 -->
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
              <el-button type="" v-else>默认</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-form-item>
      <!-- 保存和取消按钮 -->
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      spuImageList: [],//存储图片信息 
      spuSaleAttrList: [],//存储销售属性
      attrInfoList: [],//商品基础属性

      /* 收集sku数据，后面点击保存发给服务器 */
      skuInfo: {
        /* 第一类数据：父组件给的数据 */
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        /* 第二类数据，需要v-model绑定收集 */
        skuName: "",//sku名字
        price: 0,
        weight: "",
        skuDesc: "",///描述
        /* 第三类，需要自己书写代码 */
        /* 图片数据 */
        skuDefaultImg: "",//默认图片
        imageList: [],//收集图片的数据
        skuImageList: [
          /*  {
             imgName: "string",
             imgUrl: "string",
             isDefault: "string",
             spuImgId: 0
           } */
        ],
        /* 商品基础属性 */
        skuAttrValueList: [
          /* {
            attrId: 0,//选的哪个属性
            valueId: 0,//选的属性哪个值
          } */
        ],
        /* 销售属性 */
        skuSaleAttrValueList: [
          /*  {
             id: 0,
             saleAttrId: 0,
             saleAttrName: "string",
             saleAttrValueId: 0,
             saleAttrValueName: "string",
             skuId: 0,
             spuId: 0
           } */
        ],
      },
      spu: {},

    }
  },
  methods: {
    /* 获取skuForm数据 */
    async getData(category1Id, category2Id, spu) {
      /* 父组件给的数据 */
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;

      /* 获取图片数据 */
      let result = await this.$API.spu.reqSpuImageList(spu.id);
      if (result.code == 200) {
        /* 给数据添加了isDefault = 0属性，为了后面判定显示隐藏“设置默认”和“默认” */
        let list = result.data;
        list.forEach(item => {
          item.isDefault = 0;
        });
        this.spuImageList = list
      };
      /* 获取销售属性数据 */
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data
      };
      /* 获取商品基础属性 */
      let result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id);
      if (result2.code == 200) {
        this.attrInfoList = result2.data
      };
    },
    /* 表格复选框选中时事件 */
    handleSelectionChange(params) {
      /* 获取复选框的图片信息 */
      this.imageList = params
    },
    /* 改变“默认” 的显示隐藏,排他操作*/
    changeDefault(row) {
      /* 图片列表所有的先为0。因为要获取整个数组，所以要把spuImageList都带进来。又因为spuImageList在data里有了，所以可以直接用，就不用专门带进来了 */
      this.spuImageList.forEach(item => item.isDefault = 0);
      /* 选中的那个变为1 */
      row.isDefault = 1;
      /* 收集默认图片，即你点击设为默认的那个，存到data里 */
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    /* 取消按钮，回到场景0 */
    cancel() {
      this.$emit('changeScenes', 0);
      /* 清除数据，防止取消后，上次输入的数据还在 */
      //Object.assign是合并对象函数,this._data是所有响应式data数据，this.$options是配置对象。配置对象的data函数执行返回空对象，因为重置数据初始化（data一开始就是空的）
      Object.assign(this._data, this.$options.data())
    },
    /* 保存按钮，把skuInfo数据交给服务器，在这统一整理参数 */
    async save() {
      /* 此处解构，那么后面再用到这几个词，就不用在前面加this */
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      /*  第一种方法，整理平台属性
       定一个空数组，后面把数据赋予它
       let arr = [];
       attrInfoList.forEach(item => {
         遍历数组，当有attrIdAndValueId时，说明已经点击了属性值，具体看“销售属性”里el-select和el-option
         if (item.attrIdAndValueId) {
           把收集的两个数据，用：分割开，弄成数组模式
           const [attrId, valueId] = item.attrIdAndValueId.split(':');
           把数组转化为对象，因为最后给服务器的，必须是对象，这在接口里订好了类型
           let obj = { attrId, valueId };
           把对象推进空数组里
           arr.push(obj);
         }
       });
       把已经有对象的数组，赋予给skuInfo（最终给服务器的对象）下的skuAttrValueList
       skuInfo.skuAttrValueList = arr;  */

      /* 第二种方法，整理平台属性 */
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':');
          prev.push({ attrId, valueId });
        }
        return prev
      }, []);
      /* 整理销售属性 */
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':');
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev
      }, []);
      /* 整理图片属性 */
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        }
      });
      /* 发请求 */
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code == 200) {
        /* 回到场景0 */
        this.$message({ type: 'success', message: '添加SKU成功' })
        this.$emit('changeScenes', 0);
      };
      /* 清除数据，防止取消后，上次输入的数据还在 */
      //Object.assign是合并对象函数,this._data是所有响应式data数据，this.$options是配置对象。配置对象的data函数执行返回空对象，因为重置数据初始化（data一开始就是空的）
      Object.assign(this._data, this.$options.data())
    },
  },
}
</script>

<style></style>