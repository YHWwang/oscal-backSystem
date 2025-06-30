<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true"  label-width="70px">
      <el-form-item label="日期范围" prop="subTime" class="date-item">
        <el-date-picker type="daterange" v-model="queryParams.subTime" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期" end-placeholder="结束日期"
                        range-separator="至" clearable></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  size="mini" @click="CustomDate(7)">近七天</el-button>
        <el-button type="primary" size="mini" @click="CustomDate(30)">近一个月</el-button>
        <el-button type="success" size="mini" @click="getList">搜索</el-button>
        <el-button type="info" size="mini" @click="searchReset">重置</el-button>

      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="dataList">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column label="Email" align="center" prop="email"/>
      <el-table-column label="订阅时间" align="center" prop="subTime" />
<!--      <el-table-column-->
<!--        label="操作"-->
<!--        align="center"-->
<!--        class-name="small-padding fixed-width"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--     -->
<!--        </template>-->
<!--      </el-table-column>-->
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
import {
  getLists
} from "@/api/system/supportCenter/subscribed";

export default {
  name: "Subscribed",

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
        subTime:[]
      },

    };
  },
  created() {

    this.getList();
  },
  methods: {

    /** 查询列表 */
    getList() {
      this.loading = true;
      getLists(  this.queryParams).then((response) => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    searchReset(){
      this.queryParams={
        pageNum: 1,
        pageSize: 10,
        subTime:[]
      }
      this.getList();
    },
    CustomDate(date){ /*自定义时间 7天or30天*/

      this.queryParams.subTime = [this.date_count(date), this.date_count(0)]
      this.$nextTick(() => {
        this.getList();
      })
    },
    date_count(date){
      var date1 = new Date();
      var date2 = new Date(date1);
      date2.setDate(date1.getDate() - parseInt(date));
      var times = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
      var Year = 0;
      var Month = 0;
      var Day = 0;
      var CurrentDate = "";
      Year = date2.getFullYear();
      Month = date2.getMonth() + 1;
      Day = date2.getDate();
      CurrentDate += Year + "-";
      if(Month >= 10) {
        CurrentDate += Month + "-";
      } else {
        CurrentDate += "0" + Month + "-";
      }
      if(Day >= 10) {
        CurrentDate += Day;
      } else {
        CurrentDate += "0" + Day;
      }
      return CurrentDate
    }, 

  },
};
</script>
