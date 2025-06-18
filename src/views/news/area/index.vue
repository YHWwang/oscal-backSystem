<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="活动标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入活动标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in activityOptions"
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
          v-hasPermi="['system:area:add']"
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
          v-hasPermi="['system:area:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:area:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:area:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="areaList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="活动标题" align="center" prop="title" />
      <el-table-column label="封面图" align="center" prop="coverPic">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.coverPic"
            fit="scale-down"
          >
          </el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="活动内容"
        align="center"
        show-overflow-tooltip
        prop="content"
      /> -->
      <el-table-column
        label="活动类型"
        align="center"
        :formatter="activityStatus"
        prop="type"
      />
      <el-table-column label="浏览数" align="center" prop="hitNum" />
      <el-table-column label="点赞数" align="center" prop="likeNum" />
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
            v-hasPermi="['system:area:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:area:remove']"
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

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择类型"
          >
            <el-option
              v-for="dict in activityOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictSort"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="帖子封面" prop="coverPic">
          <el-upload
            class="upload-demo"
            :action="imgUrl"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="imgFile"
            list-type="picture"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动内容" prop="content">
          <editor
            v-model="form.content"
            :uploadUrl="imgUrl"
            :min-height="192"
          />
        </el-form-item>

        <!-- <el-form-item label="浏览数" prop="hitNum">
          <el-input v-model="form.hitNum" placeholder="请输入浏览数" />
        </el-form-item>
        <el-form-item label="喜欢数" prop="likeNum">
          <el-input v-model="form.likeNum" placeholder="请输入喜欢数" />
        </el-form-item> -->
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
  listArea,
  getArea,
  delArea,
  addArea,
  updateArea,
  exportArea,
} from "@/api/system/area";
import Editor from "@/components/Editor";

export default {
  name: "Area",
  components: { Editor },
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
      // 【请填写功能名称】表格数据
      areaList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        coverPic: null,
        content: null,
        type: null,
        hitNum: null,
        likeNum: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
         coverPic: [
          { required: true, message: "封面图不能为空", trigger: "blur" }
        ],
         content: [
          { required: true, message: "活动内容不能为空", trigger: "blur" }
        ],
         type: [
          { required: true, message: "类型不能为空", trigger: "blur" }
        ],
      },
      activityOptions: "",
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_activity_type").then((response) => {
      this.activityOptions = response.data;
    });
  },
  methods: {
    // 活动类型状态字典翻译
    activityStatus(row, column) {
      return this.selectDictLabel(this.activityOptions, row.type);
    },
    handleRemove(file, fileList) {
      this.form.coverPic = [];
      this.imgFile = [];
      submitForm();
    },
    handleSuccess(file) {
      console.log(file);
      this.form.coverPic = file.url;
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`
      );
    },

    beforeUpload(file, fileList) {
      // 图片文件大小限制
      let _this = this;
      let imgWidth = "";
      let imgHight = "";
      const isSize = new Promise(function (resolve, reject) {
        let width = 387;
        let height = 301;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function () {
          imgWidth = img.width;
          imgHight = img.height;
          let valid = img.width == width && img.height == height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          _this.$message.warning({
            message:
              "上传文件的图片大小不合符标准,宽需要为387px，高需要为301px。当前上传图片的宽高分别为：" +
              imgWidth +
              "px和" +
              imgHight +
              "px",
            btn: false,
          });
          return Promise.reject();
        }
      );
      console.log(isSize);
      return isSize;
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listArea(this.queryParams).then((response) => {
        this.areaList = response.rows;
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
        title: null,
        coverPic: null,
        content: null,
        type: null,
        createTime: null,
        hitNum: null,
        likeNum: null,
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
      this.title = "添加活动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getArea(id).then((response) => {
        this.imgFile.push({ url: response.data.coverPic, name: "Image" });
        this.form = response.data;
        this.open = true;
        this.title = "修改活动";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateArea(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addArea(this.form).then((response) => {
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
        '是否确认删除活动编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delArea(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有【请填写功能名称】数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportArea(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
