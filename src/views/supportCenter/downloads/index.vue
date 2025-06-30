<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      @submit.native.prevent
    >
      <el-form-item label="产品名称" prop="productId">
        <el-select
          v-model="queryParams.productId"
          placeholder="请选择产品"
          clearable
          filterable
          size="small"
        >
          <el-option
            v-for="item of options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="fileType">
        <el-select
          v-model="queryParams.fileType"
          placeholder="请选择分类"
          clearable
          size="small"
        >
          <el-option
            v-for="item of typeLists"
            :key="item.key"
            :label="item.val"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="isShow">
        <el-select
          v-model="queryParams.isShow"
          placeholder="请选择分类"
          clearable
          size="small"
        >
          <el-option key="0" label="显示" value="0" />
          <el-option key="1" label="隐藏" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          native
          >搜索</el-button
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
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="产品名" align="center" prop="productId">
        <template slot-scope="scope">
          {{ formatProduct(scope.row.productId) }}
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" prop="fileType">
        <template slot-scope="scope">
          {{ formatType(scope.row.fileType) }}
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="fileName" />
      <el-table-column label="附件" align="center" prop="fileUrl">
        <template slot-scope="scope">
          <a
            :href="scope.row.fileUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i style="font-size: 20px; color: blue" class="el-icon-link"></i>
          </a>
        </template>
      </el-table-column>

      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" prop="isShow">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.isShow === 0" type="success">显示</el-tag>
            <el-tag v-else :type="'info'">隐藏</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
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
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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
    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        v-loading="formLoading"
        element-loading-text="上传文件中，请勿离开。"
        label-width="120px"
      >
        <el-form-item label="产品" prop="productId">
          <el-select
            v-model="form.productId"
            placeholder="请选择产品"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="item of options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="fileType">
          <el-select
            v-model="form.fileType"
            placeholder="请选择分类"
            clearable
            size="small"
          >
            <el-option
              v-for="item of typeLists"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="fileName">
          <el-input v-model="form.fileName" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="附件" prop="fileUrl">
          <el-upload
            ref="upload"
            accept=".pdf, .doc, .docx"
            :limit="1"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :file-list="form.fileList"
            :on-success="handleSuccess"
            :action="uploadFile.server"
          >
            <div class="eladmin-upload">
              <i class="el-icon-upload" /> 添加文件
            </div>
            <div slot="tip" class="el-upload__tip">
              <strong>只能上传PDF,DOC,DOCX格式文件, 且不超过100M</strong>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            :min="0"
            v-model="form.sort"
            placeholder="请输入排序值"
          />
        </el-form-item>
        <el-form-item label="状态" prop="isShow">
          <el-radio-group v-model="form.isShow">
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
  getLists,
  del,
  add,
  update,
  detail,
  getOption,
} from "@/api/system/supportCenter/downloads";
import { deepClone } from "@/utils/index"; 

export default {
  name: "Downloads",
  components: {},
  data() {
    return {
      formLoading: false,
      uploadFile: {
        server: process.env.VUE_APP_BASE_API + "/summernoteUpload",
      },
      options: [],
      typeLists: [
        { key: 1, val: "Manuals" },
        { key: 2, val: "Declaration of Conformity" },
      ],
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
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isShow: null,
        productId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fileName: [
          { required: true, message: "标题不能为空", trigger: "change" },
        ],
        fileType: [
          { required: true, message: "分类不能为空", trigger: "change" },
        ],
        fileUrl: [
          { required: true, message: "附件不能为空", trigger: "change" },
        ],
        productId: [
          { required: true, message: "产品不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    getOption().then((res) => {
      this.options = res.data;
    });
    this.getList();
  },
  methods: {
    // 上传大文件不能关闭窗口
    handleClose(done) {
      if (this.packageLoading) {
        this.$message.error("上传apk文件中，不可关闭");
      } else {
        done();
      }
    },
    handleRemove(file, fileList) {
      this.form.fileUrl = [];
    },
    beforeUpload(file) {
      this.formLoading = true;
      let isLt2M = true;
      isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.loading = false;
        this.formLoading = false;
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      //文件格式
      const isPDF =
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isPDF) {
        this.loading = false;
        this.formLoading = false;
        this.$message.error("上传文件只能为PDF,DOC,DOCX格式");
      }
      return isPDF && isLt2M;
    },
    handleSuccess(response, file, fileList) {
      this.form.fileUrl = response.url;
      this.formLoading = false;
    },
    formatProduct(id) {
      for (const item of this.options) {
        if (item.id == id) return item.name;
      }
    },
    formatType(id) {
      for (const item of this.typeLists) {
        if (item.key == id) return item.val;
      }
    },
    formatImages(str) {
      return str.split(",");
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      getLists(this.queryParams).then((response) => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 上传大文件不能关闭窗口
    handleClose(done) {
      if (this.formLoading) {
        this.$message.error("上传文件中，不可关闭");
      } else {
        done();
      }
    },
    // 取消按钮
    cancel() {
      if (this.formLoading) {
        this.$message.error("上传文件中，不可关闭");
        return false;
      }
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        productName: null,
        productId: null,
        sort: 0,
        fileType: null,
        fileUrl: null,
        isShow: 0,
        productSpecifications: "",
        createTime: null,
        fileList: [],
      };
      if (this.$refs["form"]) {
        this.resetForm("form");
        this.$refs.upload.clearFiles();
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          this.getList();
        }
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      detail(id).then((response) => {
        this.form = response.data;
        this.form.fileList = [
          { name: this.form.fileUrl, url: this.form.fileUrl },
        ];
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      if (this.formLoading) {
        this.$message.error("上传文件中，不可提交");
        return false;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = deepClone(this.form);
          if (data.id != null) {
            update(data).then((response) => {
              this.msgSuccess("修改成功");
              this.getList();
              this.open = false;
            });
          } else {
            add(data).then((response) => {
              this.msgSuccess("新增成功");
              this.getList();
              this.open = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return del(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>
<style>
.spec-box a {
  color: blue;
}
.table-container {
  border: none !important;
  padding: 0 !important;
}
</style>