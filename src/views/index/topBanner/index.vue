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
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="topBannerList">
      <el-table-column label="ID" align="center" width="55" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="顶部图片pc" align="center" prop="pcImgUrl" >
        <template slot-scope="scope">
          <el-image 
            :src="scope.row.pcImgUrl" 
            :preview-src-list="[scope.row.pcImgUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="顶部图片app" align="center" prop="appImgUrl" >
        <template slot-scope="scope">
          <el-image 
            :src="scope.row.appImgUrl" 
            :preview-src-list="[scope.row.appImgUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" align="center" prop="jumpUrl" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'info':'success'">{{scope.row.status ? '隐藏':'显示'}}</el-tag>
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
            v-hasPermi="['system:topBanner:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:topBanner:remove']"
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
    <!-- 添加或修改topBanner对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="顶部图片pc" prop="pcImgUrl">
          <!-- <el-input v-model="form.pcImgUrl" placeholder="请输入顶部图片pc" /> -->
          <MaterialList
            v-model="form.pcImgUrl"
            type="image"
            :num="1"
          />
        </el-form-item>
        <el-form-item label="顶部图片app" prop="appImgUrl">
          <!-- <el-input v-model="form.appImgUrl" placeholder="请输入顶部图片app" /> -->
          <MaterialList
            v-model="form.appImgUrl"
            type="image"
            :num="1"
          />
        </el-form-item>
        <el-form-item label="跳转链接" prop="jumpUrl">
          <el-input v-model="form.jumpUrl" placeholder="请输入跳转链接" />
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
import {
  listTopBanner,
  getTopBanner,
  updateTopBanner,
  delTopBanner,
  addTopBanner
} from "@/api/system/topBanner";
import { deepClone } from "@/utils/index";
import MaterialList from "@/components/material";

export default {
  name: "TopBanner",

  components: { MaterialList },
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
      // topBanner表格数据
      topBannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pcImgUrl: null,
        appImgUrl: null,
        jumpUrl: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pcImgUrl: [
          { required: true, message: "顶部图片pc不能为空", trigger: "blur" },
        ],
        appImgUrl: [
          { required: true, message: "顶部图片app不能为空", trigger: "blur" },
        ],
        jumpUrl: [
          { required: true, message: "顶部图片app不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加广告";
    },
    /** 查询topBanner列表 */
    getList() {
      this.loading = true;
      listTopBanner(this.queryParams).then((response) => {
        this.topBannerList = response.rows;
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
        pcImgUrl: [],
        appImgUrl: [],
        jumpUrl: null,
        createTime: null,
        status: 0,
        sortNum: null,
        title:''
      };
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTopBanner(id).then((response) => {
        this.form = response.data;
        this.form.appImgUrl = [this.form.appImgUrl];
        this.form.pcImgUrl = [this.form.pcImgUrl];
        this.open = true;
        this.title = "修改topBanner";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除广告编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delTopBanner(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = deepClone(this.form);
          data.pcImgUrl = this.form.pcImgUrl[0];
          data.appImgUrl = this.form.appImgUrl[0];
          if(this.form.id){
          updateTopBanner(data).then((response) => {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          }else{
            addTopBanner(data).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  },
};
</script>
