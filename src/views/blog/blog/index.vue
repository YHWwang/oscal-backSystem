<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="128px"
    >
      <el-form-item label="分类" prop="level1Id">
        <el-cascader
          v-model="queryParams.level1Id"
          :options="categoryQueryOptions"
          :show-all-levels="true"
          clearable
          :props="{ value: 'id', label: 'name', checkStrictly: true }"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="博客标题" prop="blogTitle">
        <el-input
          v-model="queryParams.blogTitle"
          placeholder="请输入博客标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="isShow">
        <el-select
          v-model="queryParams.isShow"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option :key="0" label="隐藏" :value="0" />
          <el-option :key="1" label="显示" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否热门" prop="isHot">
        <el-select
          v-model="queryParams.isHot"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option :key="0" label="否" :value="0" />
          <el-option :key="1" label="是" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否Banner" prop="isBanner">
        <el-select
          v-model="queryParams.isBanner"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option :key="0" label="否" :value="0" />
          <el-option :key="1" label="是" :value="1" />
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
          v-hasPermi="['system:blog:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="blogList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="封面图" align="center" prop="coverImage">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.coverImage"
            :preview-src-list="[scope.row.coverImage]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="博客标题"
        align="center"
        show-overflow-tooltip
        prop="blogTitle"
      />
      <el-table-column label="路由" align="center" prop="blogRoute" />
      <el-table-column label="状态" align="center" prop="isShow">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isShow ? 'success' : 'info'">{{
            scope.row.isShow ? "显示" : "隐藏"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否热门" align="center" prop="isHot">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isHot ? 'success' : 'info'">{{
            scope.row.isHot ? "是" : "否"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否定时" align="center" prop="isScheduled">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isScheduled ? 'success' : 'info'">{{
            scope.row.isScheduled ? "是" : "否"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否banner" align="center" prop="isBanner">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isBanner ? 'success' : 'info'">{{
            scope.row.isBanner ? "是" : "否"
          }}</el-tag>
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
            v-hasPermi="['system:blog:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:blog:remove']"
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

    <!-- 添加或修改博客对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="分类" prop="level1Id">
          <el-cascader
            v-model="form.level1Id"
            :options="categoryOptions"
            :show-all-levels="true"
            clearable
            :props="{ value: 'id', label: 'name' }"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="封面图" prop="coverImage">
          <Upload :value="form.coverImage" :pw="900" :ph="500" />
        </el-form-item>
        <el-form-item label="博客标题" prop="blogTitle">
          <el-input v-model="form.blogTitle" placeholder="请输入博客标题" />
        </el-form-item>
        <el-form-item label="博客描述" prop="blogDescription">
          <el-input
            v-model="form.blogDescription"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="博客正文">
          <el-input
            v-model="form.blogContent"
            type="textarea"
            :rows="10"
            placeholder="请输入博客正文"
          />
        </el-form-item>
        <el-form-item label="博客路由" prop="blogRoute">
          <el-input v-model="form.blogRoute" placeholder="请输入博客路由" />
        </el-form-item>
        <el-form-item label="seo标题" prop="seoTitle">
          <el-input v-model="form.seoTitle" placeholder="请输入seo标题" />
        </el-form-item>
        <el-form-item label="seo描述" prop="seoDescription">
          <el-input
            v-model="form.seoDescription"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="状态" prop="isShow">
          <el-radio-group v-model="form.isShow">
            <el-radio :label="0">隐藏</el-radio>
            <el-radio :label="1">显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否热门" prop="isHot">
          <el-radio-group
            v-model="form.isHot"
            @change="isChange(['hotSortNum'], form.isHot, ['热门排序值'])"
          >
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="热门排序"
          prop="hotSortNum"
          v-show="form.isHot == 1"
        >
          <el-input-number
            :step="1"
            :min="0"
            step-strictly
            v-model="form.hotSortNum"
            placeholder="请输入热门排序值"
          />
        </el-form-item>
        <el-form-item label="是否定时发布" prop="isScheduled">
          <el-radio-group
            v-model="form.isScheduled"
            @change="
              isChange(['scheduledTime'], form.isScheduled, ['定时发布时间'])
            "
          >
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="定时发布时间"
          prop="scheduledTime"
          v-show="form.isScheduled == 1"
        >
          <el-date-picker
            v-model="form.scheduledTime"
            type="datetime"
            placeholder="选择定时发布时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否banner" prop="isBanner">
          <el-radio-group
            v-model="form.isBanner"
            @change="
              isChange(['bannerSortNum', 'bannerUrl'], form.isBanner, [
                'banner排序',
                'banner图片',
              ])
            "
          >
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="banner排序"
          prop="bannerSortNum"
          v-show="form.isBanner == 1"
        >
          <el-input-number
            :step="1"
            :min="0"
            step-strictly
            v-model="form.bannerSortNum"
            placeholder="请输入banner排序"
          />
        </el-form-item>
        <el-form-item
          label="banner图片"
          prop="bannerUrl"
          v-show="form.isBanner == 1"
        >
          <Upload :value="form.bannerUrl" :pw="1920" :ph="600" />
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
  listBlog,
  getBlog,
  delBlog,
  addBlog,
  updateBlog,
  exportBlog,
  getCategory,
} from "@/api/system/blog/blog";
import Upload from "@/components/pic-upload/indexupload";
import { deepClone } from "@/utils/index";
export default {
  name: "Blog",
  components: { Upload },
  data() {
    return {
      categoryOptions: [],
      categoryQueryOptions: [],
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
      // 博客表格数据
      blogList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        level1Id: null,
        level2Id: null,
        blogTitle: null,
        isShow: null,
        isHot: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        level1Id: [
          { required: true, message: "一级分类不能为空", trigger: "blur" },
        ],
        level2Id: [
          { required: true, message: "二级分类不能为空", trigger: "blur" },
        ],
        coverImage: [
          { required: true, message: "封面图不能为空", trigger: "blur" },
        ],
        blogTitle: [
          { required: true, message: "博客标题不能为空", trigger: "blur" },
        ],
        blogDescription: [
          { required: true, message: "博客描述不能为空", trigger: "blur" },
        ],
        blogContent: [
          { required: true, message: "博客正文不能为空", trigger: "blur" },
        ],
        blogRoute: [
          { required: true, message: "博客路由不能为空", trigger: "blur" },
        ],
        isShow: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        isHot: [
          { required: true, message: "是否热门不能为空", trigger: "blur" },
        ],
        isScheduled: [
          { required: true, message: "是否定时发布不能为空", trigger: "blur" },
        ],
        isBanner: [
          { required: true, message: "是否banner不能为空", trigger: "blur" },
        ],
        hotSortNum: [],
        scheduledTime: [],
        bannerSortNum: [],
        bannerUrl: [],
      },
    };
  },
  created() {
    this.getList();
    this.getCategoryOptions();
  },
  methods: {
    // 获取分类下拉数据
    getCategoryOptions() {
      getCategory().then((res) => {
        // 搜索下拉数据
        this.categoryQueryOptions = deepClone(res.data);
        res.data.forEach((node) => {
          if (!node.children) {
            node.disabled = true;
          }
        });
        // 表单下拉数据
        this.categoryOptions = res.data;
      });
    },
    // 设置必填项
    isChange(key, val, text) {
      if (val == 1) {
        for (let idx = 0; idx < key.length; idx++) {
          this.rules[key[idx]].push({
            required: true,
            message: text[idx] + "不能为空",
            trigger: "blur",
          });
        }
      } else {
        for (let idx = 0; idx < key.length; idx++) {
          this.rules[key[idx]] = [];
          this.form[key[idx]] = Array.isArray(this.form[key[idx]]) ? [] : null;
        }
      }
    },

    /** 查询博客列表 */
    getList() {
      this.loading = true;
      let queryParams = deepClone(this.queryParams);
      if (queryParams.level1Id) {
        queryParams.level2Id = queryParams.level1Id[1] ?? null;
        queryParams.level1Id = queryParams.level1Id[0];
      }
      listBlog(queryParams).then((response) => {
        this.blogList = response.rows;
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
        level1Id: null,
        level2Id: null,
        coverImage: [],
        blogTitle: null,
        blogDescription: null,
        blogContent: null,
        blogRoute: null,
        seoTitle: null,
        seoDescription: null,
        isShow: null,
        isHot: null,
        hotSortNum: null,
        isScheduled: null,
        scheduledTime: null,
        isBanner: null,
        bannerSortNum: null,
        bannerUrl: [],
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
      this.title = "添加博客";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBlog(id).then((response) => {
        let data = response.data;
        data.coverImage = data.coverImage ? [data.coverImage] : [];
        data.bannerUrl = data.bannerUrl ? [data.bannerUrl] : [];
        data.level1Id = [data.level1Id, data.level2Id];
        this.form = data;
        this.open = true;
        this.title = "修改博客";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let form = deepClone(this.form);
          form.coverImage = form.coverImage ? form.coverImage.join() : "";
          form.bannerUrl = form.bannerUrl ? form.bannerUrl.join() : "";
          form.level2Id = form.level1Id[1];
          form.level1Id = form.level1Id[0];
          console.log(form);
          if (form.id != null) {
            updateBlog(form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBlog(form).then((response) => {
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
      this.$confirm('是否确认删除博客编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delBlog(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>
