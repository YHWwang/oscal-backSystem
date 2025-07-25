<template>
  <div class="app-container">

<!--    <el-form-->
<!--      :model="queryParams"-->
<!--      ref="queryForm"-->
<!--      :inline="true"-->
<!--      v-show="showSearch"-->
<!--      @submit.native.prevent-->
<!--    >-->
<!--      <el-form-item label="产品名称" prop="productId">-->
<!--        <el-select-->
<!--          v-model="queryParams.productId"-->
<!--          placeholder="请选择产品"-->
<!--          clearable-->
<!--          size="small"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item of options"-->
<!--            :key="item.id"-->
<!--            :label="item.name"-->
<!--            :value="item.id"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="标题" prop="videoName">-->
<!--        <el-input-->
<!--          v-model="queryParams.videoName"-->
<!--          placeholder="请输入标题"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->

<!--      <el-form-item>-->
<!--        <el-button-->
<!--          type="success"-->
<!--          icon="el-icon-search"-->
<!--          size="mini"-->
<!--          @click="handleQuery"-->
<!--          native-->
<!--        >搜索</el-button-->
<!--        >-->
<!--      </el-form-item>-->
<!--    </el-form>-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
            v-hasPermi="['system:recom:add']"
        >新增</el-button
        >
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="dataList">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column label="搜索名称" align="center" prop="homeName"/>


      <el-table-column label="搜索链接" align="center" prop="homeUrl" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" prop="isShow">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.isShow == 0" type="success">显示</el-tag>
            <el-tag v-else :type="'info'">隐藏</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="creDate" />
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
            v-hasPermi="['system:recom:edit']"
          >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:recom:remove']"
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
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="搜索标题" prop="homeName">
          <el-input v-model="form.homeName" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="搜索链接" prop="homeUrl">
          <el-input v-model="form.homeUrl" placeholder="请输入链接" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
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

} from "@/api/system/supportCenter/search";

import { deepClone } from "@/utils/index";
export default {
  name: "Search",

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
        homeName: [
          { required: true, message: "搜索名称不能为空", trigger: "change" },
        ],
        homeUrl: [
          { required: true, message: "搜索链接不能为空", trigger: "change" },
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
      getLists(this.queryParams).then((response) => {
        this.dataList = response.rows;
        this.total = response.total ;
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
        homeName: null,
        homeUrl: null,
        sort: 0,
        isShow: 0,
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
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1000,
              });
              this.getList();
              this.open = false;
            }) 
          } else {
            add(data).then((response) => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000,
                });
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
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000,
          });
        });
    },
  },
};
</script>
