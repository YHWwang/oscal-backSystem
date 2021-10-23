<template>
  <div class="dashboard-editor-container">
   欢迎进入OSCAL后台管理系统
  </div>
</template>

<script>

export default {
  name: "Index",
  data() {
    return {
    };
  },
 
  methods: {

  },
};
</script>

<style lang="scss" scoped>

.dashboard-editor-container {
  padding: 32px;
  // background-color: rgb(240, 242, 245);
  position: relative;
  text-align: center;
  font-size: 40px;
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
