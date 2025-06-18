<template>
  <div class="app-container">
    <el-table :data="configList">
      <el-table-column label="名称" align="center" prop="configName" />
      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:oscalConfig:edit']"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="名称" prop="configName">
          <el-input
            disabled
            v-model="form.configName"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="Code" prop="htmlText">
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 10 }"
            v-model="form.htmlText"
            placeholder="请输入"
          />
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
  listOscalConfig,
  getOscalConfig,
  updateOscalConfig,
} from "@/api/system/indexCode";

export default {
  name: "IndexCode",
  data() {
    return {
      // 总条数
      total: 0,
      // 表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 表单参数
      form: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      listOscalConfig().then((response) => {
        this.configList = response.rows;
        this.total = response.total;
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
        htmlText: null,
        configName: null,
      };
      this.resetForm("form");
    },
    /** 修改按钮 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getOscalConfig(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改Code";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateOscalConfig(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  },
};
</script>