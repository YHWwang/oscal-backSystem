<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <!-- <el-form-item label="账号" prop="sysUserAccount">
        <el-input
          v-model="queryParams.sysUserAccount"
          placeholder="请输入账号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->

      <el-form-item label="邮箱" prop="userEmail">
        <el-input
          v-model="queryParams.userEmail"
          placeholder="请输入邮箱"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->

      <el-form-item label="是否签到" prop="isSign">
         <el-select v-model="queryParams.isSign" placeholder="是否签到0没有签到1签到" clearable size="small">
            <el-option
            v-for="dict in signedOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
     
      <!-- <el-form-item label="o币" prop="oCoin">
        <el-input
          v-model="queryParams.oCoin"
          placeholder="请输入o币"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关注了谁人数" prop="userFollowing">
        <el-input
          v-model="queryParams.userFollowing"
          placeholder="请输入关注了谁人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="被关注人数" prop="userFollowers">
        <el-input
          v-model="queryParams.userFollowers"
          placeholder="请输入被关注人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户发帖数" prop="userPosts">
        <el-input
          v-model="queryParams.userPosts"
          placeholder="请输入用户发帖数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      
      <el-form-item label="创建日期" prop="creDate">
           <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.creDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间">
        </el-date-picker>
        <!-- <el-input
          v-model="queryParams.creDate"
          placeholder="请输入创建日期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> -->
      </el-form-item>
      <!-- <el-form-item label="创建时间" prop="creTime">
        <el-input
          v-model="queryParams.creTime"
          placeholder="请输入创建时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="修改日期" prop="upDate">
        <el-input
          v-model="queryParams.upDate"
          placeholder="请输入修改日期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改日期" prop="upTime">
        <el-input
          v-model="queryParams.upTime"
          placeholder="请输入修改日期"
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

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:info:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="infoList" :default-sort = "{prop: 'date', order: 'descending'}" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="60" align="center" />
      <el-table-column label="Index" align="center" prop="id" />
      <el-table-column label="账号" align="center" prop="sysUserAccount" />
      <!-- <el-table-column label="父级链" align="center" prop="parentChain" /> -->
      <el-table-column label="邮箱" align="center" prop="userEmail" />
      <!-- <el-table-column label="昵称" align="center" prop="nickName" /> -->
      <!-- <el-table-column label="登录密码" align="center" prop="loginPassword" />
      <el-table-column label="支付密码" align="center" prop="payPassword" /> -->
      <el-table-column label="默认头像" align="center">
       <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.headPhoto"
            fit='scale-down'
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="是否签到" sortable align="center" prop="isSign" :formatter="signedStatus" />
      <el-table-column label="用户点赞数量" sortable align="center" prop="userLikes" />
      <!-- <el-table-column label="流水类型" align="center" prop="opType" />
      <el-table-column label="订单号" align="center" prop="opOrderId" /> -->
      <el-table-column label="o币" sortable align="center" prop="oCoin" />
      <el-table-column label="关注了谁人数" sortable align="center" prop="userFollowing" />
      <el-table-column label="被关注人数" sortable align="center" prop="userFollowers" />
      <el-table-column label="用户发帖数" sortable align="center" prop="userPosts" />
      <!-- <el-table-column label="ip" align="center" prop="lastLoginIp" /> -->
      <el-table-column label="创建日期" align="center" prop="creDate" />
      <!-- <el-table-column label="创建时间" align="center" prop="creTime" /> -->
      <el-table-column label="修改日期" align="center" prop="upDate" />
      <!-- <el-table-column label="修改日期" align="center" prop="upTime" /> -->
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:info:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:info:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="账号" prop="sysUserAccount">
          <el-input v-model="form.sysUserAccount" placeholder="请输入账号" />
        </el-form-item>
        <!-- <el-form-item label="父级链" prop="parentChain">
          <el-input v-model="form.parentChain" placeholder="请输入父级链" />
        </el-form-item> -->
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="form.userEmail" placeholder="请输入邮箱" />
        </el-form-item>
        <!-- <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称" />
        </el-form-item> -->
        <!-- <el-form-item label="登录密码" prop="loginPassword">
          <el-input v-model="form.loginPassword" placeholder="请输入登录密码" />
        </el-form-item>
        <el-form-item label="支付密码" prop="payPassword">
          <el-input v-model="form.payPassword" placeholder="请输入支付密码" />
        </el-form-item> -->
        <el-form-item label="默认头像" prop="headPhoto">
          <el-input v-model="form.headPhoto" placeholder="请输入默认头像" />
        </el-form-item>
        <el-form-item label="是否签到" prop="isSign">
          <el-input v-model="form.isSign" placeholder="请输入是否签到0没有签到1签到" />
        </el-form-item>
        <el-form-item label="用户点赞数量" prop="userLikes">
          <el-input v-model="form.userLikes" placeholder="请输入用户点赞数量" />
        </el-form-item>
        <!-- <el-form-item label="流水类型" prop="opType">
          <el-select v-model="form.opType" placeholder="请选择流水类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号" prop="opOrderId">
          <el-input v-model="form.opOrderId" placeholder="请输入订单号" />
        </el-form-item> -->
        <el-form-item label="o币" prop="oCoin">
          <el-input v-model="form.oCoin" placeholder="请输入o币" />
        </el-form-item>
        <el-form-item label="关注了谁人数" prop="userFollowing">
          <el-input v-model="form.userFollowing" placeholder="请输入关注了谁人数" />
        </el-form-item>
        <el-form-item label="被关注人数" prop="userFollowers">
          <el-input v-model="form.userFollowers" placeholder="请输入被关注人数" />
        </el-form-item>
        <el-form-item label="用户发帖数" prop="userPosts">
          <el-input v-model="form.userPosts" placeholder="请输入用户发帖数" />
        </el-form-item>
        <!-- <el-form-item label="ip" prop="lastLoginIp">
          <el-input v-model="form.lastLoginIp" placeholder="请输入ip" />
        </el-form-item> -->
        <el-form-item label="创建日期" prop="creDate">
          <el-input v-model="form.creDate" placeholder="请输入创建日期" />
        </el-form-item>
        <!-- <el-form-item label="创建时间" prop="creTime">
          <el-input v-model="form.creTime" placeholder="请输入创建时间" />
        </el-form-item> -->
        <el-form-item label="修改日期" prop="upDate">
          <el-input v-model="form.upDate" placeholder="请输入修改日期" />
        </el-form-item>
        <!-- <el-form-item label="修改日期" prop="upTime">
          <el-input v-model="form.upTime" placeholder="请输入修改日期" />
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo, exportInfo } from "@/api/system/info";

export default {
  name: "Info",
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
      // 用户表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sysUserAccount: null,
        parentChain: null,
        userEmail: null,
        nickName: null,
        loginPassword: null,
        payPassword: null,
        headPhoto: null,
        isSign: null,
        userLikes: null,
        opType: null,
        opOrderId: null,
        oCoin: null,
        userFollowing: null,
        userFollowers: null,
        userPosts: null,
        lastLoginIp: null,
        creDate: null,
        creTime: null,
        upDate: null,
        upTime: null
      },
      signedOptions:'',
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_signed_show").then((response) => {
      this.signedOptions = response.data;
    });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    signedStatus(row, column) {
      return this.selectDictLabel(this.signedOptions, row.isSign);
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
        sysUserAccount: null,
        parentChain: null,
        userEmail: null,
        nickName: null,
        loginPassword: null,
        payPassword: null,
        headPhoto: null,
        isSign: null,
        userLikes: null,
        opType: null,
        opOrderId: null,
        oCoin: null,
        userFollowing: null,
        userFollowers: null,
        userPosts: null,
        lastLoginIp: null,
        creDate: null,
        creTime: null,
        upDate: null,
        upTime: null
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
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除用户编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
