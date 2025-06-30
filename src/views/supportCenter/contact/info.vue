<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="70px"
    >
      <el-form-item label="日期范围" prop="addTime" class="date-item">
        <el-date-picker
          type="daterange"
          v-model="queryParams.addTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :style="{ width: '100%' }"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
          clearable
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="CustomDate(7)"
          >近七天</el-button
        >
        <el-button type="primary" size="mini" @click="CustomDate(30)"
          >近一个月</el-button
        >
        <el-button type="success" size="mini" @click="handleQuery"
          >搜索</el-button
        >
        <el-button type="info" size="mini" @click="searchReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="dataList">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column label="订单号" align="center" prop="orderId" />
      <el-table-column label="联系人" align="center" prop="contractName" />
      <el-table-column label="Email" align="center" prop="email" />
      <el-table-column label="机型名称" align="center" prop="modelId">
        <template slot-scope="scope">
          {{ formatModels(scope.row.modelId) }}
        </template>
      </el-table-column>
      <el-table-column label="平台" align="center" prop="platformName" />
      <el-table-column label="问题描述" align="center" prop="content" />
      <el-table-column label="问题类型" align="center" prop="subject" />
      <el-table-column label="创建时间" align="center" prop="addTime" />
      <!-- <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">

              </template>
            </el-table-column> -->
    </el-table>
    <!--分页组件-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getLists, getModels } from "@/api/system/supportCenter/contact";
export default {
  name: "Contact Us Info",

  data() {
    return {
      modelsList: [],
      options: [],
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
        addTime: [],
      },
    };
  },
  created() {
    this.CustomDate(7);
  },
  methods: {
    formatModels(id) {
      for (const item of this.modelsList) {
        if (item.models_id == id) {
          return item.models_name;
        }
      }
    },
    searchReset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        addTime: [],
      };
      this.getList();
    },
    CustomDate(date) {
      /*自定义时间 7天or30天*/
      this.queryParams.page = 1
      this.queryParams.addTime = [this.date_count(date), this.date_count(0)];
      this.$nextTick(() => {
        this.getList();
      });
    },
    date_count(date) {
      var date1 = new Date();
      var date2 = new Date(date1);
      date2.setDate(date1.getDate() - parseInt(date));
      var times =
        date2.getFullYear() +
        "-" +
        (date2.getMonth() + 1) +
        "-" +
        date2.getDate();
      var Year = 0;
      var Month = 0;
      var Day = 0;
      var CurrentDate = "";
      Year = date2.getFullYear();
      Month = date2.getMonth() + 1;
      Day = date2.getDate();
      CurrentDate += Year + "-";
      if (Month >= 10) {
        CurrentDate += Month + "-";
      } else {
        CurrentDate += "0" + Month + "-";
      }
      if (Day >= 10) {
        CurrentDate += Day;
      } else {
        CurrentDate += "0" + Day;
      }
      return CurrentDate;
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          this.getList();
        }
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      getLists(this.queryParams).then((response) => {
        this.dataList = response.rows;
        if (this.dataList.length > 0) {
          getModels(response.modelIds).then((res) => {
            this.modelsList = res.modelsList;
          });
        }
        this.total = response.total;
        this.loading = false;
      });
    },
  },
};
</script>
