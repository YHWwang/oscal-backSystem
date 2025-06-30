<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      @submit.native.prevent
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productId">
        <el-select
          v-model="queryParams.productId"
          placeholder="请选择产品"
          clearable
          filterable
          size="small"
        >
          <el-option
            v-for="item of options.product"
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
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="dataList" 
      :default-sort="{ prop: 'viewNum', order: 'descending' }"
    >
      <el-table-column label="标题" align="center" prop="title" width="300" />
      <el-table-column
        label="适用类型"
        align="center"
        prop="useType"
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.useType == 1 ? "大类" : "产品" }}
        </template>
      </el-table-column>
      <el-table-column label="适用机型" align="center" prop="useIds">
        <template slot-scope="scope" v-if="scope.row.useIds">
          <div>
            <el-tag
              style="margin: 5px"
              v-for="(items, index) of formatIds(
                scope.row.useType,
                scope.row.useIds
              )"
              :key="index"
              >{{ items }}</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="浏览数"
        align="center"
        prop="viewNum"
        sortable
        width="100"
      />
      <el-table-column
        label="点赞"
        align="center"
        prop="likeNum"
        sortable
        width="80"
      />
      <el-table-column
        label="踩"
        align="center"
        prop="unlikeNum"
        sortable
        width="80"
      />
      <!-- <el-table-column label="排序" align="center" prop="sort" /> -->
      <el-table-column label="状态" align="center" prop="isShow" width="80">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.isShow === 0" type="success">显示</el-tag>
            <el-tag v-else :type="'info'">隐藏</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="150"
      />
      <el-table-column label="已配置语言" align="center" prop="alreadySetLang">
        <template slot-scope="scope">
          {{ formatLang(scope.row.alreadySetLang) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-setting"
            @click="handleCommand(scope.row.id)"
            >多语种配置</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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
      top="5vh"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="适用类型" prop="useType">
          <el-select
            v-model="form.useType"
            placeholder="请选择适用类型"
            clearable
            @change="handleChage"
            size="small"
          >
            <el-option key="1" label="Category" :value="1" />
            <el-option key="2" label="Product" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="适用机型" prop="useIds">
          <el-select
            filterable
            v-model="form.useIds"
            placeholder="请选择适用机型"
            clearable
            multiple
            size="small"
          >
            <template v-if="form.useType == 1">
              <el-option
                v-for="item of options.category"
                :key="item.id"
                :label="item.name"
                :value="item.id + ''"
              />
            </template>
            <template v-else-if="form.useType == 2">
              <el-option
                v-for="item of options.product"
                :key="item.id"
                :label="item.name"
                :value="item.id + ''"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="简要描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入简要描述" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
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
              v-model="form.content"
              @onCreated="onCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="标签" prop="labels">
          <el-checkbox-group v-model="form.labels">
            <el-checkbox
              v-for="labs in lableOptions"
              :label="labs"
              :key="labs"
              >{{ labs }}</el-checkbox
            >
          </el-checkbox-group>
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
    <!-- 添加多语种对话框 -->
    <el-dialog
      title="多语种对话框"
      :visible.sync="lang.open"
      width="900px"
      :close-on-click-modal="false"
      top="5vh"
      append-to-body
    >
      <el-form
        ref="formLang"
        :model="lang.form"
        :rules="lang.rules"
        label-width="120px"
        v-loading="lang.loading"
      >
        <el-form-item label="语种" prop="lang">
          <el-radio-group v-model="lang.form.lang" @change="langRadioChange">
            <el-radio
              style="margin: 5px"
              v-for="lang of lang.options"
              :key="lang.key"
              :label="lang.key"
              >{{ lang.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="lang.form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div
            class="spec-box"
            style="border: 1px solid #ccc; margin-top: 10px"
            v-if="lang.open"
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
              v-model="lang.form.content"
              @onCreated="onCreated"
            />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormLang">确 定</el-button>
        <el-button @click="cancelLang">取 消</el-button>
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
  getOption,
  getCategory,
  getLang,
  saveLang,
} from "@/api/system/supportCenter/faq";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { deepClone } from "@/utils/index";
import { getToken } from "@/utils/auth";
export default {
  name: "Faq",
  components: {
    Editor,
    Toolbar,
  },
  data() {
    return {
      lang: {
        loading: false,
        open: false,
        options: [
          {
            key: "zh-rCN",
            value: "中文",
          },
          {
            key: "de",
            value: "德语",
          },
          {
            key: "es",
            value: "西班牙语",
          },
          {
            key: "fr",
            value: "法语",
          },
          {
            key: "it",
            value: "意大利语",
          },
          {
            key: "ja",
            value: "日语",
          },
          {
            key: "ru",
            value: "俄语",
          },
          {
            key: "uk",
            value: "乌克兰语",
          },
          {
            key: "cs",
            value: "捷克语",
          },
          {
            key: "pt",
            value: "葡萄牙语",
          },
          {
            key: "ar",
            value: "阿拉伯语",
          },
          {
            key: "pl",
            value: "波兰语",
          },
          {
            key: "hu",
            value: "匈牙利语",
          },
          {
            key: "hr",
            value: "克罗地亚",
          },
          {
            key: "iw",
            value: "希伯来语",
          },
          {
            key: "bg",
            value: "保加利亚",
          },
        ],
        form: {
          id: null,
          faqId: null,
          lang: "",
          title: "",
          content: "",
        },
        queryForm: {
          id: null,
          faqId: null,
          lang: "",
          title: "",
          content: "",
        },
        rules: {
          lang: [
            { required: true, message: "语种不能为空", trigger: "change" },
          ],
          title: [
            { required: true, message: "标题不能为空", trigger: "change" },
          ],
        },
      },
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
      lableOptions: [
        "Before you buy",
        "Troubleshooting",
        "How To’s",
        "Hardware & Software",
        "Policy related",
      ],
      options: {
        product: [],
        category: [],
      },
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
        type: 1,
        title: null,
        productId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        useType: [
          { required: true, message: "适用类型不能为空", trigger: "change" },
        ],
        useIds: [
          { required: true, message: "适用机型不能为空", trigger: "change" },
        ],
        title: [{ required: true, message: "标题不能为空", trigger: "change" }],
      },
    };
  },
  created() {
    getOption().then((res) => {
      this.options.product = res.data;
    });
    getCategory().then((res) => {
      this.options.category = res.data;
    });
    this.getList();
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
  },
  methods: {
    formatLang(langs) {
      if (langs) {
        langs = langs.split(",");
        let str = "";
        langs.forEach((lang) => {
          for (const item of this.lang.options) {
            if (lang == item.key) {
              str += item.value + ",";
              break;
            }
          }
        });
        str = str.slice(0, str.length - 1);
        return str;
      }
    },
    langRadioChange(val) {
      //多语言单选切换
      this.lang.loading = true;
      this.lang.queryForm.faqId = this.lang.form.id;
      this.lang.queryForm.lang = val;
      let data = {
        faqId: this.lang.queryForm.faqId,
        lang: this.lang.queryForm.lang,
      };
      getLang(data)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.lang.queryForm.id = res.data.id;
              this.lang.form.title = res.data.title;
              this.lang.form.content = res.data.content;
            } else {
              this.lang.queryForm.id = null;
              this.lang.form.title = "";
              this.lang.form.content = "";
            }
          }
        })
        .finally(() => {
          this.lang.loading = false;
        });
    },
    handleCommand(id) {
      //点击多语言配置按钮
      this.cancelLang();
      this.lang.form.id = id;
      this.lang.open = true;
    },
    submitFormLang() {
      //多语言提交
      this.$refs["formLang"].validate((valid) => {
        if (valid) {
          this.lang.queryForm.title = this.lang.form.title;
          this.lang.queryForm.content = this.lang.form.content;
          saveLang(this.lang.queryForm).then((response) => {
            if (response.code == 200) {
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1000,
              });
              this.getList();
            } else {
              this.$message({
                message: response.msg,
                type: "error",
                duration: 1000,
              });
            }
          });
        }
      });
    },
    cancelLang() {
      this.lang.open = false;
      this.lang.form = {
        id: null,
        faqId: null,
        lang: "",
        title: "",
        content: "",
      };
      if (this.$refs["formLang"]) {
        this.$refs["formLang"].resetFields();
      }
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 【注意】一定要用 Object.seal() 否则会报错
    },
    handleChage() {
      this.form.useIds = [];
    },
    formatIds(type, ids) {
      let name = [];
      let options = [];
      if (ids) {
        options = type == 1 ? this.options.category : this.options.product;
        for (const id of ids.split(",")) {
          for (const item of options) {
            if (item.id == id) {
              name.push(item.name);
              break;
            }
          }
        }
        return name;
      }
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
        type: 1,
        useType: null,
        useIds: [],
        labels: [],
        title: "",
        content: "",
        description: null,
        sort: 0,
        isShow: 0,
        createTime: null,
        videoUrl: null,
      };
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
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
        let arr = response.data.useIds.split(",");
        let result = [];
        let options = [];
        options =
          response.data.useType == 1
            ? this.options.category
            : this.options.product;
        for (const id of arr) {
          for (const item of options) {
            if (item.id == id) {
              result.push(id);
              break;
            }
          }
        }
        response.data.useIds = result;

        response.data.labels = response.data.labels
          ? response.data.labels.split(",")
          : [];
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
          data.useIds = data.useIds.join(",");
          data.labels = data.labels.join(",");
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

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>