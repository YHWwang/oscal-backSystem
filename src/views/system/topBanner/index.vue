<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="topBannerList">
      <el-table-column label="ID" align="center" width="55" prop="id" />
      <el-table-column label="顶部图片pc" align="center" prop="pcImgUrl" />
      <el-table-column label="顶部图片app" align="center" prop="appImgUrl" />
      <el-table-column label="跳转链接" align="center" prop="jumpUrl" />
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
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改topBanner对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="顶部图片pc" prop="pcImgUrl">
          <!-- <el-input v-model="form.pcImgUrl" placeholder="请输入顶部图片pc" /> -->
          <picUpload
            v-model="form.pcImgUrl"
            :pw="1920"
            :ph="100"
            :num="1"
          ></picUpload>
        </el-form-item>
        <el-form-item label="顶部图片app" prop="appImgUrl">
          <!-- <el-input v-model="form.appImgUrl" placeholder="请输入顶部图片app" /> -->
          <picUpload
            v-model="form.appImgUrl"
            :pw="750"
            :ph="100"
            :num="1"
          ></picUpload>
        </el-form-item>
        <el-form-item label="跳转链接" prop="jumpUrl">
          <el-input v-model="form.jumpUrl" placeholder="请输入跳转链接" />
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
} from "@/api/system/topBanner";
import { deepClone } from "@/utils/index";
import picUpload from "@/components/pic-upload/indexupload";

export default {
  name: "TopBanner",

  components: { picUpload },
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
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = deepClone(this.form);
          data.pcImgUrl = this.form.pcImgUrl[0];
          data.appImgUrl = this.form.appImgUrl[0];
          updateTopBanner(data).then((response) => {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
  },
};
</script>
