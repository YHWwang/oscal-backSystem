<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      @submit.native.prevent
    >
      <el-form-item label="产品名称" prop="productIds">
        <el-select
          v-model="queryParams.productIds"
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
      <el-form-item label="标题" prop="videoName">
        <el-input
          v-model="queryParams.videoName"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-table-column label="产品名" align="center" prop="productIds">
        <template slot-scope="scope">
          <el-tag v-for="item of formatProduct(scope.row.productIds)" :key='item'>{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="视频标题" align="center" prop="videoName" />
      <el-table-column label="视频地址" align="center" prop="videoUrl">
        <template slot-scope="scope">
          <a :href="scope.row.videoUrl" style="color: blue" target="_blank">{{
            scope.row.videoUrl
          }}</a>
        </template>
      </el-table-column>
      <el-table-column label="封面图" align="center" prop="coverImg">
        <template slot-scope="scope">
          <a :href="scope.row.coverImg" style="color: #42b983" target="_blank"
            ><img :src="scope.row.coverImg" alt="点击打开" class="el-avatar"
          /></a>
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
        <el-form-item label="产品" prop="productIds">
          <el-select
            v-model="form.productIds"
            multiple
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
        <el-form-item label="标题" prop="videoName">
          <el-input v-model="form.videoName" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="封面图" prop="coverImg">
          <MaterialList
            v-model="form.coverImg"
            type="image"
            :num="1"
            :width="150"
            :height="150"
          />
        </el-form-item>
        <el-form-item label="视频" prop="videoUrl">
          <el-upload
            ref="upload"
            accept=".mp4"
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
              <strong>只能上传MP4格式文件, 且不超过100M</strong>
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
} from "@/api/system/supportCenter/videos";
import MaterialList from "@/components/material";
import { deepClone } from "@/utils/index"; 

export default {
  name: "Videos",
  components: {
    MaterialList,
  },
  data() {
    return {
      formLoading: false,
      uploadFile: {
        server: process.env.VUE_APP_BASE_API + "/summernoteUpload",
      },
      options: [],
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
        productIds: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        videoName: [
          { required: true, message: "标题不能为空", trigger: "change" },
        ],
        coverImg: [
          { required: true, message: "封面图不能为空", trigger: "change" },
        ],
        videoUrl: [
          { required: true, message: "视频不能为空", trigger: "change" },
        ],
        productIds: [
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
      this.form.videoUrl = [];
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
      const isMP4 = file.type === "video/mp4";
      if (!isMP4) {
        this.loading = false;
        this.formLoading = false;
        this.$message.error("上传文件只能为MP4格式");
      }
      return isMP4 && isLt2M;
    },
    handleSuccess(response, file, fileList) {
      this.form.videoUrl = response.url;
      this.$refs["form"].clearValidate("videoUrl");
      this.formLoading = false;
    },
    formatProduct(ids) {
      let productName = [];
      let ArrIds = ids.split(',')
      for (const id of ArrIds) {
        for (const item of this.options) {
          if (item.id == id) {
            productName.push(item.name);
          }
        }
      }

      return productName;
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
        this.$message.error("上传MP4文件中，不可关闭");
      } else {
        done();
      }
    },
    // 取消按钮
    cancel() {
      if (this.formLoading) {
        this.$message.error("上传MP4文件中，不可关闭");
        return false;
      }
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        productIds: [],
        videoName: null,
        sort: 0,
        coverImg: [],
        isShow: 0,
        createTime: null,
        videoUrl: null,
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
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
        response.data.coverImg = [response.data.coverImg];
        response.data.productIds = response.data.productIds
          .split(",")
          .map((value) => parseInt(value, 10));
        this.form = response.data;
        this.form.fileList = [
          { name: this.form.videoUrl, url: this.form.videoUrl },
        ];
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      if (this.formLoading) {
        this.$message.error("上传MP4文件中，不可提交");
        return false;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = deepClone(this.form);
          data.coverImg = data.coverImg.join(",");
          data.productIds = data.productIds.join(",");
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
  .el-tag + .el-tag {
    margin: 2px 5px;
  }
</style>