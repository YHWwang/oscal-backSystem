<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="160px"
    >
      <el-form-item label="展示状态" prop="isShow">
        <el-select
          v-model="queryParams.isShow"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option
            @keyup.enter.native="handleQuery"
            v-for="dict in showOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
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
          v-hasPermi="['system:category:add']"
          >新增</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="categoryList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品分类表ID" align="center" prop="id" />
      <el-table-column label="图标" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.pic"
            fit="scale-down"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="分类名称" align="center" prop="cateName" />
      <el-table-column
        label="展示状态"
        align="center"
        prop="isShow"
        :formatter="statusFormat"
      />
      <el-table-column label="创建时间" align="center" prop="addTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="upTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.upTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:category:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:category:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改商品分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- <el-form-item label="父id" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择产品类别">
             <el-option
            v-for="(dict,index) in cateNameList"
            :key="index"
            :label="dict.cate_name"
            :value="dict.id"
          />
          </el-select>
        </el-form-item> -->
        <el-form-item label="分类名称" prop="cateName">
          <el-input v-model="form.cateName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="展示状态" prop="isShow">
          <el-radio-group v-model="form.isShow">
            <el-radio
              v-for="dict in showOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="路由地址" prop="hoverPic">
          <el-input v-model="form.hoverPic" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="请上传图标">
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
            v-model="form.pic"
            type="textarea"
            placeholder="请输入图标地址"
          /> -->
        </el-form-item>
         <el-form-item label="封面跳转地址" prop="toUrl">
          <el-input v-model="form.toUrl" />
        </el-form-item>
         <el-form-item label="seo-title" prop="categoryTitle">
          <el-input v-model="form.categoryTitle" />
        </el-form-item>
        <el-form-item label="seo-describe" prop="categoryDes">
          <el-input v-model="form.categoryDes" />
        </el-form-item>
        <el-form-item label="seo-keywords" prop="categoryKeywords">
          <el-input v-model="form.categoryKeywords" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCategory,
  getCategory,
  delCategory,
  addCategory,
  getCategoryList,
  updateCategory,
  exportCategory,
} from "@/api/system/category";

export default {
  name: "Category",
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
      // 日期范围
      dateRange: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 商品分类表格数据
      categoryList: [],
      // 弹出层标题
      title: "",
      //字典展示状态
      showOptions: [],
      // 是否显示弹出层
      open: false,
      cateNameList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pid: null,
        toUrl:null,
        cateName: null,
        sort: null,
        beginTime: null,
        endTime: null,
        pic: null,
        isShow: null,
        addTime: null,
        upTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        toUrl: [{ required: true, message: "跳转链接不能为空", trigger: "blur" }],
        cateName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        hoverPic: [
          { required: true, message: "路由地址不能为空", trigger: "blur" },
        ],
        isShow: [
          { required: true, message: "展示状态不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    "form.hoverPic"(newVal, oldVal) {
      function stripscript(value) {
        var str = "";
        str = value.replace(/[^a-zA-Z0-9]+/gi, "-").toLowerCase(); // 正则去除非字母外的其他字符
        str = str.startsWith("-") ? str.substring(1) : str; // 去除首“-”
        str = str.endsWith("-") ? str.substring(0, str.length - 1) : str; // 去除尾“-”
        return str;
      }
      if (newVal) {
        this.form.hoverPic = stripscript(newVal);
      }
    },
  },
  created() {
    this.getList();
    this.getDicts("sys_banner_show").then((response) => {
      this.showOptions = response.data;
    });
  },
  methods: {
    statusFormat(row, column) {
      return this.selectDictLabel(this.showOptions, row.isShow);
    },
    handleRemove(file, fileList) {
      this.form.pic = [];
      this.imgFile = [];
      console.log(file, fileList);
    },
    handleSuccess(file) {
      console.log(file);
      this.form.pic = file.url;
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

    /** 查询商品分类列表 */
    getList() {
      this.loading = true;
      getCategoryList().then((res) => {
        this.cateNameList = res.data.categoryList;
      });
      listCategory(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.categoryList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
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
        pid: null,
        hoverPic: null,
        cateName: null,
        toUrl:null,
        sort: null,
        pic: null,
        isShow: null,
        addTime: null,
        upTime: null,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商品分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCategory(id).then((response) => {
        this.form = response.data;
        this.imgFile.push({ url: response.data.pic, name: "Image" });
        this.open = true;
        this.title = "修改商品分类";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateCategory(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCategory(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除商品分类编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delCategory(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有商品分类数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportCategory(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>

<style>
.el-upload-list--picture .el-upload-list__item {
  transition: all 0s;
}
</style>