<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="128px"
    >
      <el-form-item label="父id" prop="categoryPid">
        <el-input
          v-model="queryParams.categoryPid"
          placeholder="请输入父id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryCateName">
        <el-input
          v-model="queryParams.categoryCateName"
          placeholder="请输入分类名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="排序" prop="categorySort">
        <el-input
          v-model="queryParams.categorySort"
          placeholder="请输入排序"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="是否显示" prop="categoryIsShow">
        <el-select
          v-model="queryParams.categoryIsShow"
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
      <el-form-item label="是否属于OS" prop="isOs">
        <el-select
          v-model="queryParams.isOs"
          placeholder="请选择属于1不属于0"
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
      <el-form-item label="添加时间" prop="addTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.addTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择添加时间"
        >
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="添加时间" prop="categoryHoverPic">
        <el-input
          v-model="queryParams.categoryHoverPic"
          placeholder="请输入添加时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改时间" prop="upTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.upTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择修改时间">
        </el-date-picker>
      </el-form-item> -->
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
          v-hasPermi="['system:kind:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table id="tab1" :data="kindList" style="width: 100%">
      <!-- <p>{{rows}}</p> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            id="tab2"
            :header-cell-style="headClass"
            :data="props.row.children"
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  id="tab3"
                  :header-cell-style="headClass"
                  :data="props.row.children"
                  style="width: 100%"
                >
                  <el-table-column width="48"></el-table-column>
                  <el-table-column label="ID" align="center" prop="id" />
                  <el-table-column
                    label="父id"
                    align="center"
                    prop="categoryPid"
                  />
                  <el-table-column
                    label="分类名称"
                    align="center"
                    prop="categoryCateName"
                  />
                  <el-table-column
                    label="排序"
                    align="center"
                    prop="categorySort"
                  />
                  <el-table-column
                    label="图标"
                    align="center"
                    show-overflow-tooltip
                    prop="categoryPic"
                  />
                  <el-table-column
                    label="是否属于OS"
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
                      <span>{{
                        parseTime(scope.row.addTime, "{y}-{m}-{d}")
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="修改时间"
                    align="center"
                    prop="upTime"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <span>{{
                        parseTime(scope.row.upTime, "{y}-{m}-{d}")
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    align="center"
                    width="200"
                    class-name="small-padding fixed-width"
                  >
                    <template slot-scope="scope">
                      <!-- <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-plus"
                        @click="handleAddChild(scope.row)"
                        v-hasPermi="['system:kind:edit']"
                        >增加</el-button
                      > -->
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
              </template>
            </el-table-column>
            <el-table-column label="ID" align="center" prop="id" />
            <el-table-column label="父id" align="center" prop="categoryPid" />
            <el-table-column
              label="分类名称"
              align="center"
              prop="categoryCateName"
            />
            <el-table-column label="排序" align="center" prop="categorySort" />
            <el-table-column
              label="图标"
              show-overflow-tooltip
              align="center"
              prop="categoryPic"
            />
            <el-table-column
              label="是否属于OS"
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
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="父id" align="center" prop="categoryPid" />
      <el-table-column
        label="分类名称"
        align="center"
        prop="categoryCateName"
      />
      <el-table-column label="排序" align="center" prop="categorySort" />
      <el-table-column
        label="图标"
        show-overflow-tooltip
        align="center"
        prop="categoryPic"
      />
      <el-table-column
        label="是否属于OS"
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

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改商品分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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
            :file-list="fileList"
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

        <el-form-item label="是否OS" prop="isOs">
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
// import {Table} from "./table.vue"
export default {
  name: "Kind",
  // components: { Table },
  data() {
    return {
      fileList: [],
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
      kindList: [],
      kindListChild: [],
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
  created() {
    this.getList();
    this.getDicts("sys_postCategory_show").then((response) => {
      this.postCategoryOptions = response.data;
    });
    this.getDicts("sys_isos_show").then((response) => {
      this.isOsOptions = response.data;
    });
  },
  methods: {
    handleRemove(file, fileList) {
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
    headClass() {
      return "display:none";
    },

    /** 查询商品分类列表 */
    getList() {
      this.loading = true;
      listKind(this.queryParams).then((response) => {
        this.kindList = response.rows;
        // console.log(this.handleTree(response.rows, "id", "categoryPid"));
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
      this.title = "添加商品分类";
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
      this.fileList.length = 0;
      this.reset();
      const id = row.id || this.ids;
      getKind(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品分类";
        // this.fileList.push({ url: response.data.categoryPic });
        // console.log(this.fileList)
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form);
          if (this.form.id != null) {
            updateKind(this.form).then((response) => {
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
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有商品分类数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportKind(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style>
.el-table__row--level-1 .el-table_1_column_9 .cell button:nth-child(1) {
  display: none;
}
.el-table .el-table__body .el-table__expanded-cell {
  padding: 0 0 100px 0;
}
</style>