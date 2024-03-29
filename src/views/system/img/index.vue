<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="128px"
    >
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
          v-hasPermi="['system:img:add']"
        >新增</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="imgList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="中部封面图片" align="center" >
       <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.middleImg"
            fit='scale-down'
          >
          </el-image>
       </template>
      </el-table-column>
      <el-table-column label="中部标题" align="center" prop="middleTitle" />
      <el-table-column label="中部规格" align="center" prop="middleSpecification" show-overflow-tooltip/>
      <el-table-column label="排序" align="center" prop="sortNum" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'info':'success'">{{scope.row.status ? '隐藏':'显示'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="middleUp" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:img:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:img:remove']"
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

    <!-- 添加或修改底部轮播图对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="中部封面图片" prop="middleImg">
          <MaterialList
            v-model="form.middleImg"
            type="image"
            :num="1"
          />
        </el-form-item>
        <el-form-item label="中部标题" prop="middleTitle">
          <el-input v-model="form.middleTitle" placeholder="请输入中部标题" />
        </el-form-item>
        <el-form-item label="中部规格" prop="middleSpecification">
          <el-input type="textarea" v-model="form.middleSpecification" placeholder="请输入中部规格" />
        </el-form-item>
        <el-form-item label="排序" prop="sortNum">
          <el-input type="number" v-model="form.sortNum" placeholder="排序" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
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
import { listImg, getImg, delImg, addImg, updateImg, exportImg } from "@/api/system/img";
import {  formatString} from "@/api/system/public";
import MaterialList from "@/components/material";
import { deepClone } from "@/utils/index";
export default {
  name: "Img",
  components: { MaterialList },
  data() {
    return {
       imgFile: [],
      imgUrl: process.env.VUE_APP_BASE_API + "/summernoteUpload",
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
      // 底部轮播图表格数据
      imgList: [],
       // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        middleImg: null,
        middleTitle: null,
        middleSpecification: '',
        middleCre: null,
        middleUp: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         middleImg : [
          { required: true, message: "封面图片不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询底部轮播图列表 */
    getList() {
      this.loading = true;
      listImg(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.imgList = response.rows;
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
        this.imgFile = []
      this.form = {
        id: null,
        middleImg: [],
        middleTitle: null,
        middleSpecification: '',
        middleCre: null,
        middleUp: null,
        status:0,
        sortNum:null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加底部轮播图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getImg(id).then(response => {
        response.data.middleImg = response.data.middleImg.split(",");
        this.form = response.data;
        this.open = true;
        this.title = "修改底部轮播图";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let formData = deepClone(this.form)
          formData.middleImg = formData.middleImg.join(",");
          formData.middleSpecification = formatString(formData.middleSpecification)
          if (formData.id != null) {
            updateImg(formData).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addImg(formData).then(response => {
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
      this.$confirm('是否确认删除底部轮播图编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delImg(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有底部轮播图数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportImg(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
<style>
.el-upload-list--picture .el-upload-list__item{
  transition: all 0s;
}
</style>