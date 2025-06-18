<template>
  <div class="dashboard-editor-container">
    <div class="selectBox">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="选择日期" prop="selectData">
          <div class="block">
            <el-date-picker
              v-model="queryParams.selectData"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
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
    </div>
    <el-row class="row_style">
      <el-col :span="24">
        <LineChart :chartData="tableData"></LineChart>
      </el-col>
    </el-row>
    <el-row class="row_style">
      <el-col :span="24">
        <el-table
          :data="tableData"
          height="350"
          border
          show-summary
          style="width: 70%; margin: 0 auto"
        >
          <el-table-column prop="days" label="日期"> </el-table-column>
          <el-table-column prop="num" sortable label="浏览量">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from "@/views/dashboard/LineChart";
import { getData } from "@/api/system/echart";

export default {
  name: "Index",
  components: {
    LineChart,
  },
  data() {
    return {
      queryParams: {
        selectData: null,
      },
      beginTime: "",
      endTime: "",
      tableData: [],
    };
  },
  created() {
    this.getEchartData();
  },
  methods: {
    getEchartData() {
      getData(this.beginTime, this.endTime).then((res) => {
        this.tableData = res.data;
      });
    },
    resetQuery() {
      this.queryParams.selectData = null;
      this.beginTime = null
      this.endTime = null
      this.getEchartData();
    },
    handleQuery() {
      let time = this.queryParams.selectData;
      this.beginTime = time[0];
      this.endTime = time[1];
      this.getEchartData();
    },
  },
};
</script>

<style lang="scss" scoped>
.row_style {
  background-color: #f0f2f5;
  margin: 2vw 0;
  padding: 2vw;
  box-sizing: border-box;
}
.dashboard-editor-container {
  padding: 32px;
  // background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
