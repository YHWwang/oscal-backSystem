<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="128px"
    >
      <el-form-item label="编号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryCateName">
        <el-input
          v-model="queryParams.categoryCateName"
          placeholder="请输入分类名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="排序" prop="categorySort">
        <el-input
          v-model="queryParams.categorySort"
          placeholder="请输入排序"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="是否显示" prop="categoryIsShow">
        <el-select
          v-model="queryParams.categoryIsShow"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in postCategoryOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否帖子类型" prop="isOs">
        <el-select
          v-model="queryParams.isOs"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in isOsOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="添加时间" prop="categoryHoverPic">
        <el-input
          v-model="queryParams.categoryHoverPic"
          placeholder="请输入添加时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改时间" prop="upTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.upTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择修改时间">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:kind:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <TreeTable
      @give-advice="showAdvice"
      :kindList="kindList"
      :head="headClass"
      name="tab1"
    ></TreeTable>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改商品分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="父id" prop="categoryPid">
          <el-input
            v-model="form.categoryPid"
            disabled
            placeholder="请输入父id"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryCateName">
          <el-input
            v-model="form.categoryCateName"
            placeholder="请输入分类名称"
          />
        </el-form-item>
        <el-form-item label="图标" prop="categoryPic">
          <el-upload
            class="upload-demo"
            :action="imgUrl"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            list-type="picture"
            :limit="1"
            :file-list="imgFile"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <!-- <el-input
            v-model="form.categoryPic"
            type="textarea"
            placeholder="请输入内容"
          /> -->
        </el-form-item>

        <el-form-item label="是否帖子类型" prop="isOs">
          <el-select
            v-model="form.isOs"
            placeholder="请输入"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in isOsOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" prop="categoryIsShow">
          <el-select
            v-model="form.categoryIsShow"
            placeholder="请输入是否推荐0不显示1显示"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in postCategoryOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="categorySort">
          <el-input v-model="form.categorySort" placeholder="请输入排序" />
        </el-form-item>
        <!-- <el-form-item label="添加时间" prop="addTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.addTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="添加时间" prop="categoryHoverPic">
          <el-input v-model="form.categoryHoverPic" placeholder="请输入添加时间" />
        </el-form-item>
        <el-form-item label="修改时间" prop="upTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.upTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择修改时间">
          </el-date-picker>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listKind, addKind, updateKind } from "@/api/system/kind";
import TreeTable from "@/components/treeTable/index";
// import {Table} from "./table.vue"
export default {
  name: "Kind",
  components: { TreeTable },
  data() {
    return {
      imgFile: [],
      imgUrl: process.env.VUE_APP_BASE_API + "/summernoteUpload",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 商品分类表格数据
      kindList: [],
      kindListChild: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryPid: null,
        categoryCateName: null,
        categorySort: null,
        categoryPic: null,
        categoryIsShow: null,
        addTime: null,
        categoryHoverPic: null,
        upTime: null,
        isOs: null,
      },
      postCategoryOptions: "",
      isOsOptions: "",
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        categoryCateName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        categoryPic: [
          { required: true, message: "图标地址不能为空", trigger: "blur" },
        ],
        isOs: [
          { required: true, message: "是否为OS帖不能为空", trigger: "blur" },
        ],
        categoryIsShow: [
          { required: true, message: "是否显示不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_postCategory_show").then((response) => {
      this.postCategoryOptions = response.data;
    });
    this.getDicts("sys_isos_show").then((response) => {
      this.isOsOptions = response.data;
    });
  },
  methods: {
    showAdvice(advice) {
      this.kindList = advice;
    },
    handleRemove(file, fileList) {
      this.form.categoryPic = [];
      this.imgFile = [];
      console.log(file, fileList);
    },
    handleSuccess(file) {
      console.log(file);
      this.form.categoryPic = file.url;
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`
      );
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    headClass() {
      return "display:black";
    },

    /** 查询商品分类列表 */
    getList() {
      this.loading = true;
      listKind(this.queryParams).then((response) => {
        this.kindList = response.rows;
        // console.log(this.handleTree(response.rows, "id", "categoryPid"));
        this.loading = false;
      });
    },
    // 执行状态字典翻译
    postCategoryStatus(row, column) {
      // console.log(row)
      return this.selectDictLabel(this.postCategoryOptions, row.categoryIsShow);
    },
    isOsStatus(row, column) {
      return this.selectDictLabel(this.isOsOptions, row.isOs);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.imgFile = [];
      this.form = {
        id: null,
        categoryPid: 0,
        categoryCateName: null,
        categorySort: null,
        categoryPic: null,
        categoryIsShow: null,
        addTime: null,
        categoryHoverPic: null,
        upTime: null,
        isOs: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商品分类";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateKind(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKind(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  },
};
</script>
<style>
.el-upload-list--picture .el-upload-list__item {
  transition: all 0s;
}

.el-table .el-table__body .el-table__expanded-cell {
  padding: 0;
}
</style>