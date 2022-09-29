<template>
  <div class="app-container">
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

    <!-- 添加或修改中间部分的banner图对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="内容" prop="bannerName">
          <el-input
            type="textarea"
            v-model="form.bannerName"
            placeholder="请输入内容"
            rows="4"
          />
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
  listBanner,
  getBanner,
  delBanner,
  addBanner,
  updateBanner,
  exportBanner,
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
      // 中间部分的banner图表格数据
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
    statusFormat(row, column) {
      return this.selectDictLabel(this.showOptions, row.bannerShow);
    },
    /** 查询中间部分的banner图列表 */
    getList() {
      this.loading = true;
      listBanner(this.addDateRange(this.queryParams, this.dateRange)).then((response) => {
        this.bannerList = response.rows;
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
      this.title = "添加中间部分的banner图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBanner(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改中间部分的banner图";
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
      this.$confirm(
        '是否确认删除中间部分的banner图编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delBanner(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有中间部分的banner图数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportBanner(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
