<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      @submit.native.prevent
    >
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select
          v-model="queryParams.categoryId"
          placeholder="请选择分类"
          clearable
          size="small"
        >
          <el-option
            v-for="item of categoryLists"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="isShow">
        <el-select
          v-model="queryParams.isShow"
          placeholder="请选择分类"
          clearable
          size="small"
        >
          <el-option key="0" label="显示" value="0" />
          <el-option key="1" label="隐藏" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          native
          >搜索</el-button
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
          v-hasPermi="['system:product:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="产品图" align="center" prop="images">
        <template slot-scope="scope">
          <a
            :href="formatImages(scope.row.images)[0]"
            style="color: #42b983"
            target="_blank"
            ><img
              :src="formatImages(scope.row.images)[0]"
              alt="点击打开"
              class="el-avatar"
          /></a>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" prop="categoryId">
        <template slot-scope="scope">
          {{ formatCategoryName(scope.row.categoryId) }}
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" prop="isShow">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.isShow === 0" type="success">显示</el-tag>
            <el-tag v-else :type="'info'">隐藏</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
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
            v-hasPermi="['system:product:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:product:remove']"
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

    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="900px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select
            v-model="form.categoryId"
            placeholder="请选择分类"
            clearable
            size="small"
          >
            <el-option
              v-for="item of categoryLists"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品图" prop="images">
          <MaterialList
            v-model="form.images"
            type="image"
            :num="4"
            :width="150"
            :height="150"
          />
        </el-form-item>
        <el-form-item label="规格属性" prop="productSpecifications">
          <div
            class="spec-box"
            style="border: 1px solid #ccc; margin-top: 10px"
            v-if="open"
          >
            <!-- 工具栏 -->
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
            />
            <!-- 编辑器 -->
            <Editor
              style="height: 400px; overflow-y: hidden"
              :defaultConfig="editorConfig"
              v-model="form.productSpecifications"
              @onCreated="onCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            :min="0"
            v-model="form.sort"
            placeholder="请输入排序值"
          />
        </el-form-item>
        <el-form-item label="状态" prop="isShow">
          <el-radio-group v-model="form.isShow">
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
  getLists,
  del,
  add,
  update,
  detail,
  getCategory,
} from "@/api/system/supportCenter/product";
import { deepClone } from "@/utils/index";
import { getToken } from "@/utils/auth";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

import MaterialList from "@/components/material";
export default {
  name: "SupportCenterProduct",
  components: {
    MaterialList,
    Editor,
    Toolbar,
  },
  data() {
    return {
      editor: null,
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        excludeKeys: ["group-video", "fullScreen", "emotion"],
      },
      editorConfig: {
        placeholder: "请输入内容...",
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          uploadImage: {
            server: process.env.VUE_APP_BASE_API + "/wangEditer/uploadImg",
            fieldName: "file",
            maxFileSize: 10 * 1024 * 1024,
            headers: { Authorization: getToken() },
          },
        },
      },
      categoryLists: [],
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
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isShow: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        productName: [
          { required: true, message: "名称不能为空", trigger: "change" },
        ],
        categoryId: [
          { required: true, message: "分类不能为空", trigger: "change" },
        ],
        images: [
          { required: true, message: "产品图不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    getCategory().then((res) => {
      this.categoryLists = res.data;
    });
    this.getList();
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 【注意】一定要用 Object.seal() 否则会报错
    },
    formatCategoryName(id) {
      for (const item of this.categoryLists) {
        if (item.id == id) return item.name;
      }
    },
    formatImages(str) {
      return str.split(",");
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      getLists(this.queryParams).then((response) => {
        this.dataList = response.rows;
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
        productName: null,
        images: [],
        sort: 0,
        categoryId: null,
        isShow: 0,
        productSpecifications: "",
        createTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          this.getList();
        }
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      detail(id).then((response) => {
        response.data.images = response.data.images.split(",");
        this.form = response.data;
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = deepClone(this.form);
          data.images = data.images.join(",");
          if (data.id != null) {
            update(data).then((response) => {
              this.msgSuccess("修改成功");
              this.getList();
              this.open = false;
            });
          } else {
            add(data).then((response) => {
              this.msgSuccess("新增成功");
              this.getList();
              this.open = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return del(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
.spec-box a {
  color: blue;
}
.table-container {
  border: none !important;
  padding: 0 !important;
}
</style>