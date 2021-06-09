<template>
  <div class="app-container">
    <el-form
      :model="queryForms"
      ref="queryForms"
      :inline="true"
      v-show="showSearch"
      label-width="128px"
    >
      <el-form-item label="产品分类id" prop="categoryId">
        <el-select v-model="queryForms.categoryId" placeholder="请选择产品类别">
          <el-option
            v-for="(dict, index) in queryList.cateNameList"
            :key="index"
            :label="dict.cate_name"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="faq的id" prop="faqId">
        <el-select v-model="queryForms.faqId" placeholder="请选择产品类别">
          <el-option
            v-for="(dict, index) in queryList.cateFaqList"
            :key="index"
            :label="dict.faq_name"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="faqDetailTitle">
        <el-input
          v-model="queryParams.faqDetailTitle"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:detail:add']"
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
          v-hasPermi="['system:detail:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:detail:remove']"
          >删除</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:detail:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="detailList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="产品分类id" align="center" prop="categoryId" />
      <el-table-column label="faq的id" align="center" prop="faqId" />
      <el-table-column label="标题" align="center" prop="faqDetailTitle" />
      <el-table-column
        label="内容"
        align="center"
        prop="faqDetailContent"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="faqDetailCre"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.faqDetailCre, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        align="center"
        prop="faqDetailUp"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.faqDetailUp, "{y}-{m}-{d}") }}</span>
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
            v-hasPermi="['system:detail:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:detail:remove']"
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

    <!-- 添加或修改faq售后对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="产品分类id" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择产品类别">
            <el-option
              v-for="(dict, index) in cateDateList.cateNameList"
              :key="index"
              :label="dict.cate_name"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="faq的id" prop="faqId">
          <el-select v-model="form.faqId" placeholder="请输入faq的id">
            <el-option
              v-for="(dict, index) in cateDateList.cateFaqList"
              :key="index"
              :label="dict.faq_name"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="faqDetailTitle">
          <el-input v-model="form.faqDetailTitle" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="faqDetailContent">
          <editor v-model="form.faqDetailContent" :min-height="192" />
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
  listDetail,
  getDetail,
  delDetail,
  addDetail,
  getCategoryAndFaqList,
  updateDetail,
  exportDetail,
} from "@/api/system/detail";
import Editor from "@/components/Editor";

export default {
  name: "Detail",
  components: { Editor },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 日期范围
      dateRange: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // faq售后表格数据
      detailList: [],
      // 弹出层标题
      title: "",
      cateDateList: {
        cateNameList: [],
        cateFaqList: [],
      },
      queryList: {
        cateNameList: [],
        cateFaqList: [],
      },
      queryForms: {
        pageNum: 1,
        pageSize: 10,
        categoryId: null,
        faqId: null,
        faqDetailTitle: null,
        faqDetailCre: null,
        faqDetailUp: null,
      },
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryId: null,
        faqId: null,
        faqDetailTitle: null,
        faqDetailContent: null,
        faqDetailCre: null,
        faqDetailUp: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        categoryId: [
          { required: true, message: "产品分类id不能为空", trigger: "blur" },
        ],
        faqId: [{ required: true, message: "faqid不能为空", trigger: "blur" }],
        faqDetailTitle: [
          { required: true, message: "标题不能为空", trigger: "blur" },
        ],
        faqDetailContent: [
          { required: true, message: "内容不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询faq售后列表 */
    getList() {
      this.loading = true;
      getCategoryAndFaqList().then((res) => {
        this.cateDateList = {
          cateNameList: res.data.categoryList,
          cateFaqList: res.data.faqList,
        };
        this.queryList = this.cateDateList;
      });
      listDetail(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.detailList = response.rows;
          for (let num of this.cateDateList.cateNameList) {
            for (let i = 0; i < response.rows.length; i++) {
              if (num.id == response.rows[i].categoryId) {
                this.detailList[i].categoryId = num.cate_name;
              }
            }
          }
          for (let num of this.cateDateList.cateFaqList) {
            for (let i = 0; i < response.rows.length; i++) {
              if (num.id == response.rows[i].faqId) {
                this.detailList[i].faqId = num.faq_name;
              }
            }
          }
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
        categoryId: null,
        faqId: null,
        faqDetailTitle: null,
        faqDetailContent: null,
        faqDetailCre: null,
        faqDetailUp: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.categoryId = this.queryForms.categoryId
      this.queryParams.faqId = this.queryForms.faqId
      this.queryParams.pageNum = 1;
      this.getList();

    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryForms = {
        categoryId: null,
        faqId: null,
        faqDetailTitle: null,
        faqDetailCre: null,
        faqDetailUp: null,
      };
      this.resetForm("queryForms");
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
      this.title = "添加faq售后";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDetail(id).then((response) => {
        this.form = response.data;
        getCategoryAndFaqList().then((res) => {
          this.cateDateList = {
            cateNameList: res.data.categoryList,
            cateFaqList: res.data.faqList,
          };
        });
        this.open = true;
        this.title = "修改faq售后";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDetail(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDetail(this.form).then((response) => {
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
      this.$confirm('是否确认删除faq售后编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delDetail(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有faq售后数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportDetail(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
