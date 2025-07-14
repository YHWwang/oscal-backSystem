<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="128px"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="显示状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择显示状态"
          clearable
          size="small"
        >
          <el-option label="显示" value="0" />
          <el-option label="隐藏" value="1" />
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
          v-hasPermi="['system:blogTopImg:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="blogTopImgList">
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="顶部图片pc" align="center" prop="pcImgUrl">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.pcImgUrl"
            :preview-src-list="[scope.row.pcImgUrl]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="顶部图片app" align="center" prop="appImgUrl">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.appImgUrl"
            :preview-src-list="[scope.row.appImgUrl]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="链接地址" align="center" prop="jumpUrl" />
      <el-table-column label="显示状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'info':'success'">{{scope.row.status ? '隐藏':'显示'}}</el-tag>
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
            v-hasPermi="['system:blogTopImg:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:blogTopImg:remove']"
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

    <!-- 添加或修改blog顶部广告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="pc图片" prop="pcImgUrl">
          <el-input v-model="form.pcImgUrl" placeholder="请输入顶部图片pc" />
          <span>PC端图片：1920px*90px</span>
        </el-form-item>
        <el-form-item label="app图片" prop="appImgUrl">
          <el-input v-model="form.appImgUrl" placeholder="请输入顶部图片app" />
          <span>移动端图片：750px*100px</span>
        </el-form-item>
        <el-form-item label="链接地址" prop="jumpUrl">
          <el-input v-model="form.jumpUrl" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="显示状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
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
  listBlogTopImg,
  getBlogTopImg,
  delBlogTopImg,
  addBlogTopImg,
  updateBlogTopImg,
} from "@/api/system/blog/topBanner";

export default {
  name: "BlogTopImg",
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
      // blog顶部广告表格数据
      blogTopImgList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        pcImgUrl: null,
        appImgUrl: null,
        jumpUrl: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pcImgUrl: [
          { required: true, message: "顶部图片pc不能为空", trigger: "blur" },
        ],
        appImgUrl: [
          { required: true, message: "顶部图片app不能为空", trigger: "blur" },
        ],
        jumpUrl: [
          { required: true, message: "链接地址不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询blog顶部广告列表 */
    getList() {
      this.loading = true;
      listBlogTopImg(this.queryParams).then((response) => {
        this.blogTopImgList = response.rows;
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
        title: null,
        pcImgUrl: null,
        appImgUrl: null,
        jumpUrl: null,
        status: 1,
        createTime: null,
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
      this.title = "添加blog顶部广告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBlogTopImg(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改blog顶部广告";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateBlogTopImg(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBlogTopImg(this.form).then((response) => {
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
        '是否确认删除blog顶部广告编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delBlogTopImg(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>