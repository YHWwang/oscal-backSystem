<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="160px"
    >
      <el-form-item label="创建时间" prop="communityCre">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.communityCre"
          type="month"
          value-format="yyyy-MM-dd"
          placeholder="选择创建月份"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="展示状态" prop="newsShow">
        <el-select
          v-model="queryParams.newsShow"
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
          v-hasPermi="['system:news:add']"
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
          v-hasPermi="['system:news:edit']"
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
          v-hasPermi="['system:news:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:news:export']"
          >导出</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="newsList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="封面图片" align="center">
         <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.newsImg"
            fit='scale-down'
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="新闻标题" align="center" prop="newsTitle" show-overflow-tooltip />
      <el-table-column
        label="展示状态"
        align="center"
        prop="newsShow"
        :formatter="statusFormat"
      />
      <el-table-column label="排序" align="center" prop="newsSort" />
      <el-table-column label="简要描述" align="center" prop="newsSimDes" show-overflow-tooltip />
      <el-table-column label="新闻创建时间" align="center" prop="newsCre" />
      <el-table-column label="新闻修改时间" align="center" prop="newsUp" />

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
            v-hasPermi="['system:news:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:news:remove']"
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

    <!-- 添加或修改新闻对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="新闻图片">
          <!-- <el-input v-model="form.newsImg" placeholder="请输入新闻图片" /> -->
           <el-upload
            class="upload-demo"
            :action="url"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            list-type="picture"
            :limit="1"
            :file-list="imgFile"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="新闻标题" prop="newsTitle">
          <el-input v-model="form.newsTitle" placeholder="请输入新闻标题" />
        </el-form-item>
        <!-- <el-form-item label="新闻月份" prop="newsMonth">
          <el-input v-model="form.newsMonth" placeholder="请输入新闻月份" />
        </el-form-item> -->
        <el-form-item label="新闻内容" prop="newsContext">
          <editor
            v-model="form.newsContext"
            placeholder="请输入新闻内容"
            :uploadUrl='this.url'
            :min-height="192"
          />
        </el-form-item>
        <el-form-item label="展示状态" prop="newsShow">
          <el-radio-group v-model="form.newsShow">
            <el-radio
              v-for="dict in showOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="新闻排序" prop="newsSort">
          <el-input v-model="form.newsSort" placeholder="请输入新闻排序" />
        </el-form-item>
         <el-form-item label="seo-title" prop="newsTdkTitle">
          <el-input v-model="form.newsTdkTitle" placeholder="" />
        </el-form-item>
         <el-form-item label="seo-descript" prop="newsTdkDes">
          <el-input v-model="form.newsTdkDes" placeholder="" />
        </el-form-item>
         <el-form-item label="seo-keywords" prop="newsTdkKeywords">
          <el-input v-model="form.newsTdkKeywords" placeholder="" />
        </el-form-item>
        <el-form-item label="简要描述" prop="newsSimDes">
          <el-input v-model="form.newsSimDes" placeholder="请输入简要描述" />
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
  listNews,
  getNews,
  delNews,
  addNews,
  updateNews,
  exportNews,
} from "@/api/system/news";
import Editor from "@/components/Editor";
export default {
  name: "News",
  components: { Editor },
  data() {
    return {
      imgFile: [],
      url:process.env.VUE_APP_BASE_API + "/summernoteUpload",
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
      // 新闻表格数据
      newsList: [],
      // 弹出层标题
      title: "",
      //字典展示状态
      showOptions: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        newsImg: null,
        newsTitle: null,
        newsMonth: null,
        newsCre: null,
        newsUp: null,
        newsContext: null,
        newsSort: null,
        newsShow: null,
        newsSimDes: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        newsImg: [{ required: true, message: "图片不能为空", trigger: "blur" }],
        newsTitle: [
          { required: true, message: "标题不能为空", trigger: "blur" },
        ],
        newsSort: [
          { required: true, message: "排序不能为空", trigger: "blur" },
        ],
        newsContext: [
          { required: true, message: "内容不能为空", trigger: "blur" },
        ],
         newsSimDes: [
          { required: true, message: "简要描述不能为空", trigger: "blur" },
        ],
        newsShow: [
          { required: true, message: "展示状态不能为空", trigger: "blur" },
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
      handleRemove(file, fileList) {
      this.form.newsImg = [];
      this.imgFile = [];
      console.log(file, fileList);
    },
    handleSuccess(file) {
      console.log(file);
      this.form.newsImg = file.url;
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`
      );
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.showOptions, row.newsShow);
    },
    /** 查询新闻列表 */
    getList() {
      this.loading = true;
      listNews(this.queryParams).then((response) => {
        this.newsList = response.rows;
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
      this.imgFile = [];
      this.form = {
        id: null,
        newsImg: null,
        newsTitle: null,
        newsMonth: null,
        newsCre: null,
        newsUp: null,
        newsContext: null,
        newsSort: null,
        newsShow: null,
        newsSimDes: null,
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
      this.title = "添加新闻";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getNews(id).then((response) => {
        this.form = response.data;
        this.imgFile.push(
          {'url':response.data.newsImg,
          'name':'Image'}
        ) 
        this.open = true;
        this.title = "修改新闻";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateNews(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNews(this.form).then((response) => {
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
      this.$confirm('是否确认删除新闻编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delNews(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有新闻数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportNews(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style>
.el-upload-list--picture .el-upload-list__item{
  transition: all 0s;
}
</style>