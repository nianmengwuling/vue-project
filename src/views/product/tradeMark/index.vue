<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDialog">添加</el-button>
    <!-- 
        表格组件 
        data:表格组件将来需要展示的数据----数组类型
        border: 是给表格添加边框
        column属性
        label:显示标题
        prop:对应列内容字段名
        width:对应列的宽度
        align:标题对齐的方式
      -->
    <el-table style="width:100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt="" style="width:100p;height:100px;">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
        分页器 
        当前第几页、数据总条数、每一页展示条数、连续页码数
        @current-change="" :点击某一个按钮时触发
        @size-change=""：每一页个数发生变化时触发
        current-page:代表的是当前第几页
        total:代表分页器一共需要战术数据条数
        page-size:代表的是每一页需要展示多少条数据
        page-sizes:代表可以设置每一页展示多少条数据
        pager-count:按钮的数据 如果9 连续页码是7,如果是7 连续页码是5
        layout:可以实现分页器布局   
        ->位于最右边,跳转里面的sizes,tatal位置可以实现页面的改变
      -->
    <el-pagination style="margin-top:20px;text-align:center" :current-page="page" :total="total" :page-size="limit"
      :page-sizes="[3, 5, 10]" :pager-count="7" @current-change="getPageList" @size-change="handleSizeChange"
      layout="prev,pager,next,jumper,->,sizes,total">
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">

      <!-- form表单 -->
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">

          <!-- upload上传
           :on-success，可以检测上传图片成功，成功就会执行一次
           :before-upload，在图片上传前，执行一次
          -->
          <!-- action是图片上传的地址,需要带/dev-api -->
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
   
<script>
export default {
  name: 'tradeMark',
  data() {
    return {
      /* 分页器设置 */
      page: 1,//代表的分页器第几页
      limit: 3,//当前页数展示数据条数 
      total: 0,//总共数据条数 
      list: [],//列表展示的数据

      /* 对话框设置 */
      dialogFormVisible: false,//对话框显示与隐藏
      tmForm: {//收集的品牌表单数据
        logoUrl: '',
        tmName: ''
      },
      /* 表单验证规则 */
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: " blur" },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌图片' }
        ]
      }
    }
  },
  mounted() {
    /* 获取列表数据 */
    this.getPageList()
  },
  methods: {
    /* 分页器页码变化时，以及解构接口传递的参数 */
    async getPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        //分别是展示数据的总条数与列表展示的数据
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    /* 分页器每页展示条数变化时，整理参数 */
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList(this.page)//此处括号里this.page，表示页码不变，还是当前页为准
    },
    /* 点击添加品牌按钮 */
    showDialog() {
      /* 显示对话框 */
      this.dialogFormVisible = true;
      /* 清除数据,防止点击取消上传时，上次的数据残留 */
      this.tmForm = {
        logoUrl: '',
        tmName: ''
      }
    },
    /* 修改某一个品牌 */
    updateTradeMark(row) {
      /* 显示对话框 */
      this.dialogFormVisible = true;
      /* 把点击的信息直接赋值给了它，会导致无论想不想要都会收到。所以要浅拷贝，确定要了才会赋值，不直接操作数据 */
      this.tmForm = { ...row }
    },
    /* 添加按钮，添加或修改品牌 */
    addOrUpdateTradeMark() {
      /* 表单验证validate */
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          /* 隐藏对话框 */
          this.dialogFormVisible = false;

          /* 此处可以const {tmForm} = this ，这样后面this.tmForm就可以简写为tmForm*/
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
          if (result.code == 200) {
            /* 按钮弹出效果 */
            this.$message({
              type: 'success',//成功的颜色
              message: this.tmForm.id ? '修改成功' : '添加成功'//弹出的消息
            });
            /* 这里要判断，否则修改成功时，会跳转到默认第一页，而不是当前页。因为getPageList(pager = 1) */
            this.getPageList(this.tmForm.id ? this.page : 1)//有ID，即当前页（修改品牌）；无ID，即（添加品牌），到第一页
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },

    //删除品牌的操作
    deleteTradeMark(row) {
      // console.log(row)
      //弹框
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        //当用户点击确定按钮的时候触发
        //向服务器发请求
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (result.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //再次获取品牌列表数据
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        }
      }).catch(() => {
        //当用户点击取消按钮的时候触发
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /* 图片上传成功时 */
    handleAvatarSuccess(res, file) {
      /* res是成功后，返回的数据，图片在服务器真实的地址； file是返回的对象，包含了res里面的data图片地址 */
      this.tmForm.logoUrl = res.data;
    },
    /* 图片上传之前 */
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>
   
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>