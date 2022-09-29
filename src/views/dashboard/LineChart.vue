<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
      echartDate: [],
      echartPV: [],
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.updateData();
        this.setOptions(this.echartDate, this.echartPV);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
    this.updateData();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    updateData() {
      this.echartDate.length = 0;
      this.echartPV.length = 0;
      this.chartData.forEach((res) => {
        this.echartDate.push(res.days);
        this.echartPV.push(res.num);
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.echartDate, this.echartPV);
    },
    setOptions(date, pageViews) {
      this.chart.setOption({
        xAxis: {
          type: "category",
          data: date,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        grid: {
          left: 40,
          right: 40,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        legend: {
          data: ["浏览量"],
        },
        series: [
          {
            name: "浏览量",
            itemStyle: {
              normal: {
                label: {
                  show: true,
                },
                color: "#409EFF",
                lineStyle: {
                  color: "#409EFF",
                  width: 2,
                },
              },
            },
            smooth: true,
            type: "line",
            data: pageViews,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
        ],
      });
    },
  },
};
</script>
