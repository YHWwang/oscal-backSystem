<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="158px">
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="1新发2热门3精华4所有" prop="communityType">
        <el-select v-model="queryParams.communityType" placeholder="请选择1新发2热门3精华4所有" clearable size="small">
            <el-option
            v-for="dict in postSortOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="社区封面" prop="communityImg">
        <el-input
          v-model="queryParams.communityImg"
          placeholder="请输入社区封面"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="社区标题" prop="communityTitle">
        <el-input
          v-model="queryParams.communityTitle"
          placeholder="请输入社区标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="communityCre">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.communityCre"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="修改时间" prop="communityUp">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.communityUp"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择修改时间">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="排序" prop="communitySort">
        <el-input
          v-model="queryParams.communitySort"
          placeholder="请输入排序"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="点赞数" prop="communityLike">
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
      </el-form-item>
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
      <el-form-item label="发帖状态0待审核1审核通过2审核拒绝" prop="communityStatus">
        <el-select v-model="queryParams.communityStatus" placeholder="请选择发帖状态0待审核1审核通过2审核拒绝" clearable size="small">
           <el-option
            v-for="dict in commentOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
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
      </el-col>
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
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="invitationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="Index" align="center" prop="id"  />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="1新发2热门3精华4所有" align="center" prop="communityType" :formatter="postsStatus"/>
      <el-table-column label="社区封面" align="center" prop="communityImg" />
      <el-table-column label="社区标题" align="center" prop="communityTitle" />
      <el-table-column label="社区内容" align="center" prop="communityContent" show-overflow-tooltip/>
      <el-table-column label="创建时间" align="center" prop="communityCre" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.communityCre, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="communityUp" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.communityUp, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序" align="center" prop="communitySort" /> -->
      <el-table-column label="点赞数" align="center" prop="communityLike" />
      <el-table-column label="浏览量" align="center" prop="communityNum" />
      <el-table-column label="评论量" align="center" prop="communityComment" />
      <!-- <el-table-column label="简述" align="center" prop="communityName" /> -->
      <!-- <el-table-column label="是否是新发帖0不是1是" align="center" prop="communityNew" />
      <el-table-column label="是否热门0不热门1热门" align="center" prop="communityHot" />
      <el-table-column label="是否是精华贴0不是1是" align="center" prop="communityBetter" /> -->
      <el-table-column label="发帖状态0待审核1审核通过2审核拒绝" align="center" prop="communityStatus" :formatter="commentsStatus" />
      <!-- <el-table-column label="发帖状态0待审核1审核通过2审核拒绝" align="center" prop="oscalCommentCategoryId" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:invitation:edit']"
          >修改</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:invitation:remove']"
          >删除</el-button> -->
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

    <!-- 添加或修改帖子对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <!-- <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item> -->
        <el-form-item label="1新发2热门3精华4所有" prop="communityType">
          <el-select v-model="form.communityType" placeholder="请选择1新发2热门3精华4所有">
             <el-option
            v-for="dict in postSortOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
          </el-select>
         
        </el-form-item>
        <!-- <el-form-item label="社区封面" prop="communityImg">
          <el-input v-model="form.communityImg" placeholder="请输入社区封面" />
        </el-form-item>
        <el-form-item label="社区标题" prop="communityTitle">
          <el-input v-model="form.communityTitle" placeholder="请输入社区标题" />
        </el-form-item>
        <el-form-item label="社区内容">
          <editor v-model="form.communityContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="创建时间" prop="communityCre">
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
        <!-- <el-form-item label="简述" prop="communityName">
          <el-input v-model="form.communityName" placeholder="请输入简述" />
        </el-form-item> -->
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
import { listInvitation, getInvitation, delInvitation, addInvitation, updateInvitation, exportInvitation,sysAuditFun,sysAuditDelFun } from "@/api/system/invitation";
import Editor from '@/components/Editor';

export default {
  name: "Invitation",
  components: { Editor },
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
      // 帖子表格数据
      invitationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
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
        oscalCommentCategoryId: null
      },
      selectPostData:'',
      // 表单参数
      postSortOptions:'',
      commentOptions:'',
      form: {},
      // 表单校验
      rules: {
      }
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
  },
  methods: {
    /** 查询帖子列表 */
    getList() {
      this.loading = true;
      listInvitation(this.queryParams).then(response => {
        this.invitationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
       // 帖子状态字典翻译
    commentsStatus(row, column) {
      return this.selectDictLabel(this.commentOptions, row.communityStatus);
    },
       // 帖子类型状态字典翻译
    postsStatus(row, column) {
      return this.selectDictLabel(this.postSortOptions, row.communityType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
     sysAudit(type){
      // console.log(this.selectPostData)
      type == 1 ? sysAuditFun(this.selectPostData).then((req) =>{
         this.msgSuccess("修改成功");
           this.open = false;
              this.getList();
      }):sysAuditDelFun(this.selectPostData).then((req) =>{
         this.msgSuccess("修改成功");
           this.open = false;
              this.getList();
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
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
        communityStatus: 0,
        oscalCommentCategoryId: null
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
      var Arr = ''
      for(let i of selection){
        Arr += i.id+','
      }
      this.selectPostData = Arr.slice(0,Arr.length-1)
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
      const id = row.id || this.ids
      getInvitation(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改帖子";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInvitation(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInvitation(this.form).then(response => {
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
          type: "warning"
        }).then(function() {
          return delInvitation(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有帖子数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInvitation(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
