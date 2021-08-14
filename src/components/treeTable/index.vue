<template>
  <div>
    <el-table
      :id="name"
      class="tabChlid"
      :data="kindList"
      style="width: 100%"
      :header-row-style="head"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <TreeTableName
            v-if="props.row.children"
            @give-advice="showAdvice"
            :kindList="props.row.children"
            :head="headClass"
          ></TreeTableName>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="id" />
      <!-- <el-table-column label="父id" align="center" prop="categoryPid" /> -->
      <el-table-column label="图标" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.categoryPic"
            fit="scale-down"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="分类名称"
        align="center"
        prop="categoryCateName"
      />
      <el-table-column label="排序" align="center" prop="categorySort" />
      <el-table-column
        label="是否属于板块"
        align="center"
        prop="isOs"
        :formatter="isOsStatus"
      />
      <el-table-column
        label="是否显示"
        align="center"
        prop="categoryIsShow"
        :formatter="postCategoryStatus"
      />
      <el-table-column
        label="添加时间"
        align="center"
        prop="addTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        align="center"
        prop="upTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.upTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAddChild(scope.row)"
            v-hasPermi="['system:kind:edit']"
            >增加</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:kind:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:kind:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改商品分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="父id" prop="categoryPid">
          <el-input
            v-model="form.categoryPid"
            disabled
            placeholder="请输入父id"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryCateName">
          <el-input
            v-model="form.categoryCateName"
            placeholder="请输入分类名称"
          />
        </el-form-item>
        <el-form-item label="图标" prop="categoryPic">
          <el-upload
            class="upload-demo"
            :action="imgUrl"
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
          <!-- <el-input
            v-model="form.categoryPic"
            type="textarea"
            placeholder="请输入内容"
          /> -->
        </el-form-item>

        <el-form-item label="是否属于板块" prop="isOs">
          <el-select
            v-model="form.isOs"
            placeholder="请输入是否推荐0不显示1显示"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in isOsOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" prop="categoryIsShow">
          <el-select
            v-model="form.categoryIsShow"
            placeholder="请输入是否推荐0不显示1显示"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in postCategoryOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="categorySort">
          <el-input v-model="form.categorySort" placeholder="请输入排序" />
        </el-form-item>
        <!-- <el-form-item label="添加时间" prop="addTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.addTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="添加时间" prop="categoryHoverPic">
          <el-input v-model="form.categoryHoverPic" placeholder="请输入添加时间" />
        </el-form-item>
        <el-form-item label="修改时间" prop="upTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.upTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择修改时间">
          </el-date-picker>
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
  listKind,
  getKind,
  delKind,
  addKind,
  updateKind,
  exportKind,
} from "@/api/system/kind";
export default {
  name: "TreeTableName",
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
      // 商品分类表格数据
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryPid: null,
        categoryCateName: null,
        categorySort: null,
        categoryPic: null,
        categoryIsShow: null,
        addTime: null,
        categoryHoverPic: null,
        upTime: null,
        isOs: null,
      },
      postCategoryOptions: "",
      isOsOptions: "",
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        categoryCateName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        categoryPic: [
          { required: true, message: "图标地址不能为空", trigger: "blur" },
        ],
        isOs: [
          { required: true, message: "是否为OS帖不能为空", trigger: "blur" },
        ],
        categoryIsShow: [
          { required: true, message: "是否显示不能为空", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    kindList: {
      default: "",
    },
    name: {
      typeof: String,
      default: "",
    },
    head: {
      typeof: Object,
      default: "",
    },
  },
  created() {
    this.getDicts("sys_postCategory_show").then((response) => {
      this.postCategoryOptions = response.data;
    });
    this.getDicts("sys_isos_show").then((response) => {
      this.isOsOptions = response.data;
    });
  },
  methods: {
    showAdvice(advice) {
      //  this.$emit("kindList", advice);  无法回调数据，可能是由于kindList在组件直接没进行传值
      this.$emit("give-advice", advice);
    },
    headClass() {
      return "display:none";
    },
    handleRemove(file, fileList) {
      this.form.categoryPic = [];
      this.imgFile = [];
      console.log(file, fileList);
    },
    handleSuccess(file) {
      console.log(file);
      this.form.categoryPic = file.url;
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

    /** 查询商品分类列表 */
    getList() {
      this.loading = true;
      listKind(this.queryParams).then((response) => {
        this.$emit("give-advice", response.rows);
        //  this.kindList = response.rows
        // location.reload()
        this.loading = false;
      });
    },
    // 执行状态字典翻译
    postCategoryStatus(row, column) {
      // console.log(row)
      return this.selectDictLabel(this.postCategoryOptions, row.categoryIsShow);
    },
    isOsStatus(row, column) {
      return this.selectDictLabel(this.isOsOptions, row.isOs);
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
        categoryPid: 0,
        categoryCateName: null,
        categorySort: null,
        categoryPic: null,
        categoryIsShow: null,
        addTime: null,
        categoryHoverPic: null,
        upTime: null,
        isOs: null,
      };
      this.resetForm("form");
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商品分类";
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除商品分类编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delKind(ids);
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
          if (this.form.id != null) {
            updateKind(this.form).then((response) => {
              console.log(this.form);
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addKind(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 新增子类按钮操作 */
    handleAddChild(row) {
      this.reset();
      this.form.categoryPid = row.id;
      console.log(row);
      this.open = true;
      this.title = "添加子类商品分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.imgFile.length = 0;
      this.reset();
      const id = row.id || this.ids;
      getKind(id).then((response) => {
        this.form = response.data;
        this.imgFile.push({ url: response.data.categoryPic, name: "Image" });
        this.open = true;
        this.title = "修改商品分类";
      });
    },
  },
};
</script>

<style>
#tab1 table .el-table__body .el-table__expand-column {
  padding-left: 32px;
}
#tab1 .tabChlid .tabChlid .el-table__expand-column {
  padding-left: 64px;
}
#tab1 .tabChlid .tabChlid button:nth-child(1) {
  display: none;
}
#tab1 .tabChlid .tabChlid .el-table__expand-column .cell {
  display: none;
}
</style>
