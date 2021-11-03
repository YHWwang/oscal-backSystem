<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="158px"
    >
      <el-form-item label="帖子编号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入帖子编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="1新发2热门3精华4所有" prop="communityType">
        <el-select
          v-model="queryParams.communityType"
          placeholder="请选择1新发2热门3精华4所有"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in postSortOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否属于板块" prop="osType">
        <el-select
          v-model="queryParams.osType"
          placeholder="请选择"
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
      <el-form-item label="是否首页推荐" prop="isHomeIndex">
        <el-select
          v-model="queryParams.isHomeIndex"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in isHomeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="帖子封面" prop="communityImg">
        <el-input
          v-model="queryParams.communityImg"
          placeholder="请输入帖子封面"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="帖子标题" prop="communityTitle">
        <el-input
          v-model="queryParams.communityTitle"
          placeholder="请输入帖子标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="创建时间" prop="communityCre">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.communityCre"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间"
        >
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="修改时间" prop="communityUp">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.communityUp"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择修改时间">
        </el-date-picker>
      </el-form-item> -->
      <!-- <el-form-item label="排序" prop="communitySort">
        <el-input
          v-model="queryParams.communitySort"
          placeholder="请输入排序"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="点赞数" prop="communityLike">
        <el-input
          v-model="queryParams.communityLike"
          placeholder="请输入点赞数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="浏览量" prop="communityNum">
        <el-input
          v-model="queryParams.communityNum"
          placeholder="请输入浏览量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论量" prop="communityComment">
        <el-input
          v-model="queryParams.communityComment"
          placeholder="请输入评论量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="简述" prop="communityName">
        <el-input
          v-model="queryParams.communityName"
          placeholder="请输入简述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="是否是新发帖0不是1是" prop="communityNew">
        <el-input
          v-model="queryParams.communityNew"
          placeholder="请输入是否是新发帖0不是1是"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否热门0不热门1热门" prop="communityHot">
        <el-input
          v-model="queryParams.communityHot"
          placeholder="请输入是否热门0不热门1热门"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否是精华贴0不是1是" prop="communityBetter">
        <el-input
          v-model="queryParams.communityBetter"
          placeholder="请输入是否是精华贴0不是1是"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="发帖状态" prop="communityStatus">
        <el-select v-model="queryParams.communityStatus" placeholder="请选择发帖状态0待审核1审核通过2审核拒绝" clearable size="small">
           <el-option
            v-for="dict in commentOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="发帖状态0待审核1审核通过2审核拒绝" prop="oscalCommentCategoryId">
        <el-input
          v-model="queryParams.oscalCommentCategoryId"
          placeholder="请输入发帖状态0待审核1审核通过2审核拒绝"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:invitation:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="sysAudit(1)"
        >批量审核拒绝</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          @click="sysAudit(2)"
        >批量审核通过</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:invitation:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:invitation:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="invitationList"
      @selection-change="handleSelectionChange"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="帖子编号" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column
        label="1新发2热门3精华4所有"
        align="center"
        sortable
        prop="communityType"
        :formatter="postsStatus"
      />
      <el-table-column label="帖子封面" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.communityImg"
            fit="scale-down"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="帖子标题"
        show-overflow-tooltip
        align="center"
        prop="communityTitle"
      />
      <el-table-column
        label="首页推荐"
        align="center"
        prop="isHomeIndex"
        sortable
        :formatter="isHomeStatus"
      />
      <el-table-column
        label="是否属于板块"
        align="center"
        sortable
        prop="osType"
        :formatter="isOsStatus"
      />
      <el-table-column
        label="点赞数"
        align="center"
        sortable
        prop="communityLike"
      />
      <el-table-column
        label="浏览量"
        align="center"
        sortable
        prop="communityNum"
      />
      <el-table-column
        label="评论量"
        align="center"
        sortable
        prop="communityComment"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="communityCre"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.communityCre, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        align="center"
        prop="communityUp"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.communityUp, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序" align="center" prop="communitySort" /> -->

      <!-- <el-table-column label="简述" align="center" prop="communityName" /> -->
      <!-- <el-table-column label="是否是新发帖0不是1是" align="center" prop="communityNew" />
      <el-table-column label="是否热门0不热门1热门" align="center" prop="communityHot" />
      <el-table-column label="是否是精华贴0不是1是" align="center" prop="communityBetter" /> -->
      <!-- <el-table-column label="发帖状态" align="center" prop="communityStatus" :formatter="commentsStatus" /> -->
      <!-- <el-table-column label="发帖状态0待审核1审核通过2审核拒绝" align="center" prop="oscalCommentCategoryId" /> -->
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
            v-hasPermi="['system:invitation:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:invitation:remove']"
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

    <!-- 添加或修改帖子对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <!-- <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item> -->
        <el-form-item label="1新发2热门3精华4所有" prop="communityType">
          <el-select
            v-model="form.communityType"
            placeholder="请选择1新发2热门3精华4所有"
          >
            <el-option
              v-for="dict in postSortOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="帖子封面" prop="communityImg">
          <el-input v-model="form.communityImg" placeholder="请输入帖子封面" />
        </el-form-item> -->
        <el-form-item label="帖子封面" prop="communityImg">
          <el-upload
            class="upload-demo"
            :action="imgUrl"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="imgFile"
            multiple
            list-type="picture"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="帖子标题" prop="communityTitle">
          <el-input
            v-model="form.communityTitle"
            placeholder="请输入帖子标题"
          />
        </el-form-item>
        <el-form-item label="帖子内容" prop="communityContent">
          <editor
            v-model="form.communityContent"
            :uploadUrl="url"
            :min-height="192"
          />
        </el-form-item>
        <!-- <el-form-item label="创建时间" prop="communityCre">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.communityCre"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修改时间" prop="communityUp">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.communityUp"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择修改时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序" prop="communitySort">
          <el-input v-model="form.communitySort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="点赞数" prop="communityLike">
          <el-input v-model="form.communityLike" placeholder="请输入点赞数" />
        </el-form-item>
        <el-form-item label="浏览量" prop="communityNum">
          <el-input v-model="form.communityNum" placeholder="请输入浏览量" />
        </el-form-item>
        <el-form-item label="评论量" prop="communityComment">
          <el-input v-model="form.communityComment" placeholder="请输入评论量" />
        </el-form-item> -->
        <el-form-item label="分类帖子" prop="oscalCommentCategoryId">
          <el-cascader
            v-model="form.oscalCommentCategoryId"
            :props="{ checkStrictly: true }"
            :options="options"
            :show-all-levels="false"
            clearable
            @change="selectCategoryId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="是否首页推荐" prop="isHomeIndex">
          <el-select
            v-model="form.isHomeIndex"
            placeholder="是否首页推荐0不推荐1推荐"
            size="small"
          >
            <el-option
              v-for="dict in isHomeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否属于板块" prop="osType">
          <el-select
            v-model="form.osType"
            placeholder="0不是1是"
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
        <el-form-item label="简述" prop="communityName">
          <el-input v-model="form.communityName" placeholder="请输入简述" />
        </el-form-item>
        <!-- <el-form-item label="是否是新发帖0不是1是" prop="communityNew">
          <el-input v-model="form.communityNew" placeholder="请输入是否是新发帖0不是1是" />
        </el-form-item>
        <el-form-item label="是否热门0不热门1热门" prop="communityHot">
          <el-input v-model="form.communityHot" placeholder="请输入是否热门0不热门1热门" />
        </el-form-item>
        <el-form-item label="是否是精华贴0不是1是" prop="communityBetter">
          <el-input v-model="form.communityBetter" placeholder="请输入是否是精华贴0不是1是" />
        </el-form-item> -->
        <!-- <el-form-item label="发帖状态0待审核1审核通过2审核拒绝">
          <el-radio-group v-model="form.communityStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发帖状态0待审核1审核通过2审核拒绝" prop="oscalCommentCategoryId">
          <el-input v-model="form.oscalCommentCategoryId" placeholder="请输入发帖状态0待审核1审核通过2审核拒绝" />
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
  listInvitation,
  getInvitation,
  delInvitation,
  addInvitation,
  updateInvitation,
  getTreeselectData,
  exportInvitation,
  sysAuditFun,
  sysAuditDelFun,
} from "@/api/system/invitation";
import Editor from "@/components/Editor";

export default {
  name: "Invitation",
  components: { Editor },
  data() {
    return {
      imgFile: [],
      url: process.env.VUE_APP_BASE_API + "/summernoteUpload",
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
      // 帖子表格数据
      invitationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      options: [], //获取帖子分类数据
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        isHomeIndex: null,
        osType: null,
        oscalCommentCategoryId: null,
        communityType: null,
        communityImg: null,
        communityTitle: null,
        communityContent: null,
        communityCre: null,
        communityUp: null,
        communitySort: null,
        communityLike: null,
        communityNum: null,
        communityComment: null,
        communityName: null,
        communityNew: null,
        communityHot: null,
        communityBetter: null,
        communityStatus: null,
      },
      selectPostData: "",
      // 表单参数
      postSortOptions: "",
      postID: "",
      isOsOptions: "",
      isHomeOptions: "",
      commentOptions: "",
      form: {},
      // 表单校验
      rules: {
        communityType: [
          { required: true, message: "帖子种类不能为空", trigger: "blur" },
        ],
        communityTitle: [
          { required: true, message: "帖子标题不能为空", trigger: "blur" },
        ],
        communityContent: [
          { required: true, message: "帖子内容不能为空", trigger: "blur" },
        ],
        oscalCommentCategoryId: [
          { required: true, message: "帖子类型不能为空", trigger: "blur" },
        ],
        isHomeIndex: [
          { required: true, message: "是否首页推荐不能为空", trigger: "blur" },
        ],
        osType: [
          { required: true, message: "是否属于板块不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_comment_show").then((response) => {
      this.commentOptions = response.data;
    });
    this.getDicts("sys_sort_show").then((response) => {
      this.postSortOptions = response.data;
    });
    this.getDicts("sys_home_show").then((response) => {
      this.isHomeOptions = response.data;
    });
    this.getDicts("sys_isos_show").then((response) => {
      this.isOsOptions = response.data;
    });
  },
  methods: {
    handleRemove(file, fileList) {
      this.form.communityImg = [];
      this.imgFile = [];
      submitForm();
    },
    handleSuccess(file) {
      console.log(file);
      this.form.communityImg = file.url;
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
        let width = 818;
        let height = 445;
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
              "上传文件的图片大小不合符标准,宽需要为818px，高需要为445px。当前上传图片的宽高分别为：" +
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
    selectCategoryId(value) {
      // console.log(value);
    },
    /** 查询帖子列表 */
    getList() {
      this.loading = true;
      getTreeselectData().then((res) => {
        // this.options = copyTransFun(res.data)
        let col = [];
        let arr = res.data;

        arr.forEach((item, index) => {
          if (item.children) {
            col.push({
              value: item.id,
              label: item.label,
              children: this.changeObjFun(item.children),
            });
          } else {
            col.push({
              value: item.id,
              label: item.label,
            });
          }
        });
        this.options = col;
      });
      listInvitation(this.queryParams).then((response) => {
        this.invitationList = response.rows;
        this.total = response.total;
        this.loading = false;
        // this.fileList.length=0
        // this.fileList.push({'url':response.data.communityImg})
      });
    },
    changeObjFun(item) {
      let col = [];
      item.forEach((item, index) => {
        if (item.children) {
          col.push({
            value: item.id,
            label: item.label,
            children: this.changeObjFun(item.children),
          });
        } else {
          col.push({
            value: item.id,
            label: item.label,
          });
        }
      });
      return col;
    },
    // 帖子状态字典翻译
    commentsStatus(row, column) {
      return this.selectDictLabel(this.commentOptions, row.communityStatus);
    },
    // 帖子类型状态字典翻译
    postsStatus(row, column) {
      return this.selectDictLabel(this.postSortOptions, row.communityType);
    },
    isHomeStatus(row, column) {
      return this.selectDictLabel(this.isHomeOptions, row.isHomeIndex);
    },
    isOsStatus(row, column) {
      return this.selectDictLabel(this.isOsOptions, row.osType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    sysAudit(type) {
      // console.log(this.selectPostData)
      type == 1
        ? sysAuditFun(this.selectPostData).then((req) => {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          })
        : sysAuditDelFun(this.selectPostData).then((req) => {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
    },
    // 表单重置
    reset() {
      this.imgFile = [];
      this.form = {
        id: null,
        userId: null,
        communityType: null,
        communityImg: "",
        communityTitle: null,
        communityContent: null,
        communityCre: null,
        isHomeIndex: null,
        osType: null,
        oscalCommentCategoryId: null,
        communityUp: null,
        communitySort: null,
        communityLike: null,
        communityNum: null,
        communityComment: null,
        communityName: "",
        communityNew: null,
        communityHot: null,
        communityBetter: null,
        communityStatus: 0,
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
      var Arr = "";
      for (let i of selection) {
        Arr += i.id + ",";
      }
      this.selectPostData = Arr.slice(0, Arr.length - 1);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加帖子";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getInvitation(id).then((response) => {
        this.form = response.data;
        this.imgFile.push({ url: response.data.communityImg, name: "Image" });
        this.postID = response.data.oscalCommentCategoryId;
        this.open = true;
        this.title = "修改帖子";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.isHomeIndex == 1) {
            // console.log(11);
            if (this.form.communityImg == "") {
              // console.log(22);
              this.msgError("帖子封面不能为空");
              return false;
            }
            if (this.form.communityName == "") {
              this.msgError("帖子简述不能为空");
              return false;
            }
          }
          // console.log(this.form);
          if (this.form.oscalCommentCategoryId.length >= 1) {
            let len = this.form.oscalCommentCategoryId.pop();
            this.form.oscalCommentCategoryId = len;
          } else {
            this.form.oscalCommentCategoryId = this.form.oscalCommentCategoryId;
          }
          if (this.form.id != null) {
            updateInvitation(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInvitation(this.form).then((response) => {
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
      this.$confirm('是否确认删除帖子编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delInvitation(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有帖子数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportInvitation(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style>
.el-upload-list--picture .el-upload-list__item {
  transition: all 0s;
}
</style>