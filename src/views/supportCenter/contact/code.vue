<template>
  <div class="app-container">

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
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column label="title" align="center" prop="title"/>
      <el-table-column label="内容1" align="center" prop="container1" show-overflow-tooltip />
      <el-table-column label="内容2" align="center" prop="container2" show-overflow-tooltip />
      <el-table-column label="内容3" align="center" prop="container3" show-overflow-tooltip />
      <el-table-column label="内容4" align="center" prop="container4" show-overflow-tooltip />
      <el-table-column label="description" align="center" prop="description"/>
      <el-table-column label="keywords" align="center" prop="keywords"/>
      <el-table-column label="创建时间" align="center" prop="creDate" />
      <el-table-column label="修改时间" align="center" prop="upDate" />
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
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >

        <el-form-item label="container1" prop="container1">
          <el-input v-model="form.container1" type="textarea" rows="5" placeholder="请输入container1" />
        </el-form-item>
        <el-form-item label="container2" prop="container2">
          <el-input v-model="form.container2" type="textarea" rows="5" placeholder="请输入container2" />
        </el-form-item>
        <el-form-item label="container3" prop="container1">
          <el-input v-model="form.container3" type="textarea" rows="5" placeholder="请输入container3" />
        </el-form-item>
        <el-form-item label="container4" prop="container4">
          <el-input v-model="form.container4" type="textarea" rows="5" placeholder="请输入container4" />
        </el-form-item>
        <el-form-item label="Title" prop="container1">
          <el-input v-model="form.title" type="textarea" rows="5" placeholder="请输入Title" />
        </el-form-item>
        <el-form-item label="keywords" prop="keywords">
          <el-input v-model="form.keywords" type="textarea" rows="5" placeholder="请输入keywords" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="form.description" type="textarea" rows="5" placeholder="请输入Description" />
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
  getHtmlLists,
  del,
  add,
  update,
} from "@/api/system/supportCenter/contact";
import { deepClone } from "@/utils/index";

export default {
  name: "Contact Us Cnfo",

  data() {
    return {

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
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        container1: [
          { required: false, message: "", trigger: "change" },
        ],
        container2: [
          { required: false, message: "", trigger: "change" },
        ],
        container3: [
          { required: false, message: "", trigger: "change" },
        ]
      },
    };
  },
  created() {

    this.getList();
  },
  methods: {

    /** 查询列表 */
    getList() {
      this.loading = true;
      getHtmlLists(this.queryParams).then((response) => {
        this.dataList = response.rows;
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
        container1: null,
        container2: null,
        container3: null,
        container4: null,
        title: null,
        description: null,
        keywords: null
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
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
      this.form = deepClone(row)
      this.open = true;
      this.title = "修改";
    },
    /** 提交按钮 */
    submitForm() {

      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = deepClone(this.form);

          if (data.id != null) {
            update(data).then((response) => {
              this.msgSuccess("修改成功");
              this.getList();
              this.open = false;
            })
          } else {
            add(data).then((response) => {
              this.msgSuccess("新增成功");
              this.getList();
              this.open = false;
            })
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
