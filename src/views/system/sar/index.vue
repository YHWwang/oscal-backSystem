<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      @submit.native.prevent
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="机型" prop="modelName">
        <el-input
          v-model="queryParams.modelName"
          placeholder="请输入机型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:sar:add']"
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
      :data="sarList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="机型" align="center" prop="modelName" />
      <el-table-column label="排序" align="center" prop="sortNum" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'info' : 'success'">{{
            scope.row.status ? "隐藏" : "显示"
          }}</el-tag>
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
            v-hasPermi="['system:sar:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:sar:remove']"
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

    <!-- 添加或修改SAR对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="机型" prop="modelName">
          <el-input v-model="form.modelName" placeholder="请输入机型名" />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <el-form-item label="排序" prop="sortNum">
          <el-input
            type="number"
            v-model="form.sortNum"
            placeholder="请输入排序"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" 
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSar,
  getSar,
  delSar,
  addSar,
  updateSar,
  exportSar,
} from "@/api/system/sar";
import Editor from "@/components/Editor";

export default {
  name: "Sar",
  components: {
    Editor,
  },
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
      // SAR表格数据
      sarList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        modelName: null,
        fileUrl: null,
        type: null,
        sortNum: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        modelName: [
          { required: true, message: "文件名不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询SAR列表 */
    getList() {
      this.loading = true;
      listSar(this.queryParams).then((response) => {
        this.sarList = response.rows;
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
        modelName: null,
        fileUrl: null,
        content: `
        <p>This mobile phone model <span style="background-color: rgb(217, 217, 217); color: rgb(255, 0, 0);">xxx(机型)</span>&nbsp;has been designed to comply with applicable safety requirements for exposure of radio waves.</p><p>&nbsp;</p><p>The radio wave exposure guidelines employ a measurement known as the Specific Absorption Rate (SAR) which refers to the rate at which the body absorbs RF energy. SAR value as the basic restrictions is specified in Council Recommendation 1999/519/EC, which is 2W/kg in countries that set the limit averaged over 10 gram of tissue; and in the IEEE Std C95.1-2005, which is 1.6 W/kg in counties that set the limit averaged over 1 gram of tissue.</p><p>&nbsp;</p><p>During SAR testing, this device was set to transmit at its highest certified power levels in all tested frequency bands, and placed in positions that simulate RF exposure in usage against the head with no separation, and near the body with the separation not exceeding 25 mm.</p><p>&nbsp;</p><p>To make sure the mobile phone working on a lower RF exposure status, use a hands-free option, such as Bluetooth headphone, supplied headphones, or other similar accessory. Use of other accessories which contain metal parts may not ensure compliance with RF exposure guidelines.</p><p>&nbsp;</p><p>Although this device has been tested to determine SAR in each band of operation, not all bands are available in all areas. Bands are dependent on your service provider’s wireless and roaming networks.</p><p>&nbsp;</p><p>The highest SAR values are as follows:</p><p><span style="background-color: rgb(217, 217, 217); color: rgb(255, 0, 0);">Model xx(机型)</span></p><p>2.0 W/kg (over 10 g) SAR Limit</p><p>Head:<span style="background-color: rgb(217, 217, 217); color: rgb(255, 0, 0);">&nbsp;xx</span>W/Kg</p><p>Body:<span style="background-color: rgb(217, 217, 217); color: rgb(255, 0, 0);">&nbsp;xx</span>W/Kg (distance <span style="background-color: rgb(217, 217, 217); color: rgb(255, 0, 0);">xx</span>&nbsp;mm) </p><p>4.0 W/kg (over 10 g) SAR Limit for Limbs</p><p>Limbs: <span style="background-color: rgb(217, 217, 217); color: rgb(255, 0, 0);">xx</span>W/Kg&nbsp;(distance <span style="background-color: rgb(217, 217, 217); color: rgb(255, 0, 0);">xx</span>&nbsp;mm) </p><p>&nbsp;</p><p><br></p><p><br></p><p><br></p>
        `,
        sortNum: 0,
        status: 0,
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
      this.title = "添加SAR";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getSar(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改SAR";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateSar(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSar(this.form).then((response) => {
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
      this.$confirm('是否确认删除SAR编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delSar(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有SAR数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSar(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
