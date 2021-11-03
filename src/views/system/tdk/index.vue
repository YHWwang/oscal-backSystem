<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:tdk:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="tdkList" style="width: 100%">
      <el-table-column label="序号" width="50" prop="id"></el-table-column>
      <el-table-column
        label="小标题"
        width=""
        prop="topTitle"
      ></el-table-column>
      <el-table-column label="分类ID" width="" prop="tdkId"></el-table-column>
      <el-table-column
        label="TDK-标题"
        width=""
        prop="tdkTitle"
      ></el-table-column>
      <el-table-column
        label="TDK-描述"
        width=""
        prop="tdkDescribe"
      ></el-table-column>
      <el-table-column
        label="TDK-关键字"
        width=""
        prop="tdkKeywords"
      ></el-table-column>
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
            v-hasPermi="['system:tdk:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:tdk:remove']"
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="分类ID" prop="tdkId">
          <el-select v-model="form.tdkId">
            <el-option
              v-for="option in categoryListTdk"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="小标题" prop="topTitle">
          <el-input type="textarea" v-model="form.topTitle" />
        </el-form-item>
        <el-form-item label="top-描述" prop="topDes">
          <el-input type="textarea" v-model="form.topDes" />
        </el-form-item>
        <el-form-item label="seo-title" prop="tdkTitle">
          <el-input v-model="form.tdkTitle" />
        </el-form-item>
        <el-form-item label="seo-describe" prop="tdkDescribe">
          <el-input type="textarea" v-model="form.tdkDescribe" />
        </el-form-item>
        <el-form-item label="seo-keywords" prop="tdkKeywords">
          <el-input type="textarea" v-model="form.tdkKeywords" />
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
  listTdk,
  updateTdk,
  delTdk,
  addTdk,
  categoryListTdk,
} from "@/api/system/tdk";

export default {
  name: "tdk",
  data() {
    return {
      tdkList: [],
      categoryListTdk: [],
      total: 0,
      title: "",
      form: {},
      rules: {
        tdkDescribe: [
          { required: true, message: "描述不能为空", trigger: "blur" },
        ],
        tdkId: [
          { required: true, message: "tdk分类id不能为空", trigger: "blur" },
        ],
        tdkKeywords: [
          { required: true, message: "关键字不能为空", trigger: "blur" },
        ],
        tdkTitle: [
          { required: true, message: "标题不能为空", trigger: "blur" },
        ],
      },
      loading: false,
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listTdk().then((response) => {
        this.tdkList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      categoryListTdk().then((res) => {
        this.categoryListTdk = res.data;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.form = {};
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.form = {};
      this.open = true;
      this.title = "新增";
    },
    // /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.open = true;
      this.title = "修改";
    },

    // /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateTdk(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTdk(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    // /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.id;
      this.$confirm(
        '是否确认删除角色编号为"' + roleIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTdk(roleIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>