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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="内容">
              <span>{{ props.row.issueDetails }}</span>
            </el-form-item>
            <el-form-item label="国家">
              <span>{{ props.row.countryName }}</span>
            </el-form-item>
            <el-form-item label="省/州">
              <span>{{ props.row.stateName }}</span>
            </el-form-item>
            <el-form-item label="地址1">
              <span>{{ props.row.addressLine1 }}</span>
            </el-form-item>
            <el-form-item label="地址2">
              <span>{{ props.row.addressLine2 }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ props.row.phoneNumber }}</span>
            </el-form-item>
            <el-form-item label="邮政编码">
              <span>{{ props.row.zipCode }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" align="center" prop="categoryName" />
      <el-table-column label="Email" align="center" prop="emailAddress" />
      <el-table-column label="名" align="center" prop="firstName" />
      <el-table-column label="姓" align="center" prop="lastName" />
      <el-table-column label="机型" align="center" prop="model" />
      <el-table-column label="订单号" align="center" prop="orderNo" />
      <el-table-column
        label="内容"
        align="center"
        show-overflow-tooltip
        prop="issueDetails"
      />
      <!--      <el-table-column label="国家" align="center" prop="countryName"/>-->
      <!--      <el-table-column label="省/州" align="center" prop="stateName"/>-->
      <!--      <el-table-column label="邮政编码" align="center" prop="zipCode"/>-->
      <!--      <el-table-column label="地址1" align="center" show-overflow-tooltip prop="addressLine1"/>-->
      <!--      <el-table-column label="地址2" align="center" show-overflow-tooltip prop="addressLine2"/>-->
      <!--      <el-table-column label="电话" align="center" prop="phoneNumber"/>-->

      <el-table-column label="订单截图" align="center" prop="orderImg">
        <template slot-scope="scope" v-if="scope.row.orderImg">
          <!--          <img style="width: 50px" :src="scope.row.orderImg" alt="">-->

          <div class="demo-image__preview">
            <el-image
              v-for="item of scope.row.orderImg.split(',')"
              :key="item"
              style="width: 50px"
              :src="item"
              :preview-src-list="[...item]"
            >
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="地址2" align="center" prop="addressLine2" />
      <el-table-column label="创建时间" align="center" prop="creTime" />
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
import { getLists } from "@/api/system/supportCenter/warranty/warranty";
import { formatTime } from "@/utils/index";

export default {
  name: "Info",

  data() {
    return {
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
        beginTime: "",
        endTime: "",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    formatTime,
    searchReset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        addTime: [],
        beginTime: "",
        endTime: "",
      };
      this.getList();
    },
    CustomDate(date) {
      /*自定义时间 7天or30天*/

      this.queryParams.pageNum = 1;
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
      this.queryParams.pageNum = 1;
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          this.getList();
        }
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      if (this.queryParams.addTime?.length) {
        this.queryParams.beginTime = this.queryParams?.addTime[0];
        this.queryParams.endTime = this.queryParams?.addTime[1];
      } else {
        this.queryParams.beginTime = null;
        this.queryParams.endTime = null;
      }
      let query = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        beginTime: this.queryParams.beginTime,
        endTime: this.queryParams.endTime,
      };
      getLists(query).then((response) => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
  },
};
</script>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
