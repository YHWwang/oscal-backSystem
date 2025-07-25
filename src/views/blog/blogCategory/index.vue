<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入分类名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="isShow">
        <el-select
          v-model="queryParams.isShow"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option :key="0" label="隐藏" :value="0" />
          <el-option :key="1" label="显示" :value="1" />
        </el-select>
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
          v-hasPermi="['system:blogCategory:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="blogCategoryList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="分类名称" align="center" prop="name">
        <template slot-scope="scope">
          <router-link
            :to="'/blog/level2?pid=' + scope.row.id"
            style="color: #1890ff"
            >{{ scope.row.name }}</router-link
          >
        </template>
      </el-table-column>
      <el-table-column label="分类路由" align="center" prop="route" />
      <el-table-column label="SEO标题" align="center" prop="seoTitle" />
      <el-table-column label="SEO描述" align="center" prop="seoDescription" />
      <el-table-column label="排序" align="center" prop="sortNum" />
      <el-table-column label="状态" align="center" prop="isShow">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isShow ? 'success' : 'info'">{{
            scope.row.isShow ? "显示" : "隐藏"
          }}</el-tag>
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
            v-hasPermi="['system:blogCategory:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:blogCategory:remove']"
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

    <!-- 添加或修改博客分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="路由" prop="route">
          <el-input :disabled="form.id" v-model="form.route" placeholder="请输入路由" />
        </el-form-item>
        <el-form-item label="SEO标题" prop="seoTitle">
          <el-input v-model="form.seoTitle" placeholder="请输入SEO标题" />
        </el-form-item>
        <el-form-item label="SEO描述" prop="seoDescription">
          <el-input
            v-model="form.seoDescription"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sortNum">
          <el-input-number
            :step="1"
            :min="0"
            step-strictly
            v-model="form.sortNum"
            placeholder="请输入排序"
          />
        </el-form-item>
        <el-form-item label="状态" prop="isShow">
          <el-radio-group v-model="form.isShow">
            <el-radio :label="0">隐藏</el-radio>
            <el-radio :label="1">显示</el-radio>
          </el-radio-group>
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
  listBlogCategory,
  getBlogCategory,
  delBlogCategory,
  addBlogCategory,
  updateBlogCategory,
} from "@/api/system/blog/blogCategory";

export default {
  name: "blogCategory",
  data() {
    return {
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
      // 博客分类表格数据
      blogCategoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        isShow: null,
        pid: 0,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pid: [{ required: true, message: "父ID不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        route: [{ required: true, message: "路由不能为空", trigger: "blur" }],
        sortNum: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        isShow: [
          {
            required: true,
            message: "状态不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  watch: {
    "form.route": function (val) {
      var str = "";
      str = val.replace(/[^a-zA-Z0-9]+/gi, "-").toLowerCase(); // 正则去除非字母外的其他字符
      str = str.startsWith("-") ? str.substring(1) : str; // 去除首“-”
      str = str.endsWith("-") ? str.substring(0, str.length - 1) : str; // 去除尾“-”
      this.form.route = str;
    },
  },
  methods: {
    /** 查询博客分类列表 */
    getList() {
      this.loading = true;
      listBlogCategory(this.queryParams).then((response) => {
        this.blogCategoryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        pid: 0,
        name: null,
        route: null,
        seoTitle: null,
        seoDescription: null,
        sortNum: null,
        isShow: null,
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
      this.title = "添加博客分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBlogCategory(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改博客分类";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateBlogCategory(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBlogCategory(this.form).then((response) => {
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
        '是否确认删除博客分类编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delBlogCategory(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>
