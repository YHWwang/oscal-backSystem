<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="128px"
    >
      <el-form-item label="展示状态" prop="bannerShow">
        <el-select
          v-model="queryParams.bannerShow"
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
          v-hasPermi="['system:banner:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:banner:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:banner:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:banner:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="bannerList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="排序" align="center" prop="bannerSort" />
      <el-table-column
        label="内容"
        align="center"
        prop="bannerName"
        show-overflow-tooltip
      />
      <!-- <el-table-column label="轮播描述" align="center" prop="bannerDes" /> -->
      <!-- <el-table-column label="轮播标题" align="center" prop="bannerTitle" /> -->
      <!-- <el-table-column label="轮播关键字" align="center" prop="bannerKeyword" /> -->
      <!-- <el-table-column label="轮播排序" align="center" prop="bannerSort" /> -->
      <el-table-column
        label="展示状态"
        align="center"
        prop="bannerShow"
      >
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.bannerShow == 0 ? 'info' : 'success'"
          disable-transitions>{{scope.row.bannerShow == 0 ? '隐藏' : '显示'}}</el-tag>
      </template>
    </el-table-column>
      <!-- <el-table-column label="cdnjs" align="center" prop="bannerUrlJs" /> -->
      <!-- <el-table-column label="cdncs" align="center" prop="bannerUrlCss" /> -->
      <!-- <el-table-column label="轮播详情" align="center" prop="bannerSpecification" /> -->
      <!-- <el-table-column label="购买链接" align="center" prop="bannerShopUrl" /> -->
      <!-- <el-table-column label="0可点1不可点" align="center" prop="bannerStatus" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="bannerCre"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.bannerCre, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        align="center"
        prop="bannerUp"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.bannerUp, "{y}-{m}-{d}") }}</span>
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
            v-hasPermi="['system:banner:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:banner:remove']"
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

    <!-- 添加或修改海报对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="内容" prop="bannerName">
          <el-input
            type="textarea"
            :rows="10"
            v-model="form.bannerName"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="排序" prop="bannerSort">
          <el-input v-model="form.bannerSort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="展示状态" prop="bannerShow">
          <el-radio-group v-model="form.bannerShow">
            <el-radio
              v-for="dict in showOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="previewBanner">预览海报</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listBanner,
  getBanner,
  delBanner,
  addBanner,
  updateBanner,
} from "@/api/system/banner";
import { formatString } from "@/api/system/public";

export default {
  name: "Banner",
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
      //海报表格数据
      bannerList: [],
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],
      // 是否显示弹出层
      open: false,
      //字典展示状态
      showOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bannerName: null,
        bannerDes: null,
        bannerTitle: null,
        bannerKeyword: null,
        bannerSort: null,
        bannerShow: null,
        bannerUrlJs: null,
        bannerUrlCss: null,
        bannerSpecification: null,
        bannerShopUrl: null,
        bannerStatus: null,
        bannerCre: null,
        bannerUp: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        bannerName: [
          { required: true, message: "内容不能为空", trigger: "blur" },
        ],
        bannerShow: [
          { required: true, message: "展示状态不能为空", trigger: "blur" },
        ],
        bannerSort: [
          { required: true, message: "排序号不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_banner_show").then((response) => {
      this.showOptions = response.data;
    });
  },
  methods: {
    previewBanner() {
      if (this.form.bannerName != null) {
        localStorage.setItem("banner-setting", this.form.bannerName);
        window.open("/banner.html");
      } else {
        this.$message.warning(`内容不能为空`);
      }
    },
    /** 查询海报列表 */
    getList() {
      this.loading = true;
      listBanner(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.bannerList = response.rows;
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
      this.form = {
        id: null,
        bannerName: null,
        bannerDes: null,
        bannerTitle: null,
        bannerKeyword: null,
        bannerSort: null,
        bannerShow: null,
        bannerUrlJs: null,
        bannerUrlCss: null,
        bannerSpecification: null,
        bannerShopUrl: null,
        bannerStatus: 0,
        bannerCre: null,
        bannerUp: null,
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
      this.title = "添加海报";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBanner(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改海报";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.bannerName = formatString(this.form.bannerName);
          if (this.form.id != null) {
            updateBanner(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBanner(this.form).then((response) => {
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
      this.$confirm('是否确认删除海报编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delBanner(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>
