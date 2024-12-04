<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分类名称" prop="seriesName">
        <el-input
          v-model="queryParams.seriesName"
          placeholder="分类名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择分类状态" clearable size="small">
          <el-option label="显示" value="0" />
          <el-option label="隐藏" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="首页状态" prop="indexStatus">
        <el-select v-model="queryParams.indexStatus" placeholder="请选择首页状态" clearable size="small">
          <el-option label="显示" value="0" />
          <el-option label="隐藏" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:series:add']"
        >新增</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="seriesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="上级分类" align="center" prop="categoryId" >
        <template slot-scope="scope">
        <span>{{formatCategoryId(scope.row.categoryId)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类名称" align="center" prop="seriesName" />
      <el-table-column label="分类状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'info':'success'">{{scope.row.status ? '隐藏':'显示'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="首页状态" align="center" prop="indexStatus" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.indexStatus ? 'info':'success'">{{scope.row.indexStatus ? '隐藏':'显示'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:series:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:series:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改产品系列对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级分类" prop="categoryId">
          <el-select v-model="form.categoryId" disabled placeholder="请选择上级分类" filterable clearable size="small">
            <el-option v-for="item of cateNameList" :key="item.id" :label="item.cate_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="seriesName">
          <el-input v-model="form.seriesName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="首页状态">
          <el-radio-group v-model="form.indexStatus">
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
import { listSeries, getSeries, delSeries, addSeries, updateSeries, exportSeries } from "@/api/system/series";
import {
  getCategoryList,
} from "@/api/system/category";
export default {
  name: "Series",
  data() {
    return {
      cateNameList:[],
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
      // 产品系列表格数据
      seriesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryId: null,
        seriesName: null,
        status: null,
        indexStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        categoryId: [
          { required: true, message: "上级不能为空", trigger: "blur" }
        ],
        seriesName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "分类状态不能为空", trigger: "blur" }
        ],
        indexStatus: [
          { required: true, message: "首页状态0显示1隐藏不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    formatCategoryId(id){
      for (const item of this.cateNameList) {
        if(item.id == id){
          return item.cate_name
        }
      }
    },
    /** 查询产品系列列表 */
    getList() {
      this.loading = true;
      this.queryParams.categoryId = this.$route.query.categoryId ? this.$route.query.categoryId : null
      
      getCategoryList().then((res) => {
        this.cateNameList = res.data.categoryList;
      });
      listSeries(this.queryParams).then(response => {
        this.seriesList = response.rows;
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
        categoryId: Number(this.$route.query.categoryId),
        seriesName: null,
        status: 0,
        indexStatus: 0
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加产品系列";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSeries(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改产品系列";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSeries(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSeries(this.form).then(response => {
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
      this.$confirm('是否确认删除产品系列编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSeries(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
  }
};
</script>
